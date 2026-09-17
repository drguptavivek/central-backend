#!/bin/bash -eu
set -o pipefail

serverUrl="http://localhost:8383"
userEmail="x@example.com"
userPassword="STR0NG-secret-1234?"
garageContainer="odk-central-s3-garage"
garageDiagnosticsPrefix="${RUNNER_TEMP:-${TMPDIR:-/tmp}}/odk-central-s3-garage"

log() { echo "[test/e2e/s3/run-tests] $*"; }

cleanup() {
  status=$?
  if [[ -n "${_cleanupStarted-}" ]]; then return; fi
  _cleanupStarted=1 # track to prevent recursive cleanup

  log "Cleaning up background service(s); ignore subsequent errors."
  set +eo pipefail
  docker inspect "$garageContainer" > "${garageDiagnosticsPrefix}.inspect" 2>&1 || true
  docker logs "$garageContainer" > "${garageDiagnosticsPrefix}.log" 2>&1 || true
  if [[ "$status" != 0 ]]; then
    log "Garage container diagnostics:"
    cat "${garageDiagnosticsPrefix}.inspect" || true
    cat "${garageDiagnosticsPrefix}.log" || true
  fi
  kill -- -$$ 2>/dev/null || true
  docker rm --force "$garageContainer" >/dev/null 2>&1 || true
  exit "$status"
}
trap cleanup EXIT SIGINT SIGTERM SIGHUP

if curl -s -o /dev/null $serverUrl; then
  log "!!! Error: server already running at: $serverUrl"
  exit 1
fi

make base

if [[ "${CI-}" = '' ]]; then
  set +e
fi

log "Attempting to create user..."
echo "$userPassword" | node ./lib/bin/cli.js user-create  -u "$userEmail" && log "User created."
log "Attempting to promote user..."
node ./lib/bin/cli.js user-promote -u "$userEmail" && log "User promoted."

if [[ "${CI-}" = '' ]]; then
  set -e
  cat <<EOF

    ! It looks like you're running this script outside of a CI environment.
    !
    ! If your blobs table is not empty, you may see test failures due to
    ! de-duplication of blobs.
    !
    ! A quick fix for this could be:
    !
    !   docker exec odk-central-backend-dev-postgres psql -U jubilant jubilant -c "TRUNCATE blobs CASCADE"
    !
    ! Press <enter> to continue...

EOF
  read -rp ''
fi

log "Waiting for Garage RPC and S3 readiness..."
garageReady=''
for _ in $(seq 1 60); do
  garageState="$(docker inspect --format '{{.State.Status}}' "$garageContainer" 2>/dev/null || true)"
  if [[ "$garageState" != running ]]; then
    [[ "$garageState" = '' || "$garageState" = restarting ]] || log "Garage state: $garageState"
    sleep 1
    continue
  fi
  if docker exec "$garageContainer" /garage -c /etc/garage.toml status >/dev/null 2>&1 \
      && curl -sS -o /dev/null http://localhost:9000; then
    log "Garage RPC and S3 API are UP!"
    garageReady=1
    break
  fi
  sleep 1
done
[[ "$garageReady" = 1 ]] || { log "!!! Garage did not become ready."; docker logs "$garageContainer" || true; exit 1; }

NODE_CONFIG_ENV=s3-dev node lib/bin/s3-create-bucket.js
NODE_CONFIG_ENV=s3-dev make run | tee server.log &
serverPid=$!

log 'Waiting for backend to start...'
backendReady=''
for _ in $(seq 1 30); do
  if curl -s -o /dev/null "$serverUrl"; then
    backendReady=1
    break
  fi
  sleep 1
done
[[ "$backendReady" = 1 ]] || { log '!!! Backend did not become ready.'; exit 1; }
log 'Backend started!'

cd test/e2e/s3
npx mocha test.js

if ! curl -s -o /dev/null "$serverUrl"; then
  log '!!! Backend died.'
  exit 1
fi

log "Tests completed OK."
