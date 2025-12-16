# Concrete backend plan for app-user login + short-lived tokens

  1. Schema

  - Add to field_keys:
      - login (optional, unique per project) if you don’t want to reuse displayName as the login identifier.
      - password (hashed, nullable for legacy field keys).
  - Migration: add columns, create uniqueness constraint on (projectId, login) if login is used, and backfill
    existing rows with null passwords.

  2. App User create/update API (/projects/:projectId/app-users)

  - Accept login (optional) and password in the payload.
  - If password provided, hash it (reuse user bcrypt helper) before storing.
  - If password is set:
      - Do NOT auto-issue a 9999-year session token.
  - If password is absent (legacy behavior):
      - Keep current behavior (issue long-lived token) to avoid breaking existing deployments.
  - Optionally allow password update endpoint/flag to set/change the hash.

  3. Login endpoint

  - New route: POST /projects/:projectId/app-users/login.
  - Payload: { login: string | displayName, password: string } (decide whether to prefer login or fall back to
    displayName).
  - Lookup field_key by projectId + login/displayName; verify password hash.
  - On success:
      - Issue a short-lived session via Sessions.create(actor, expiresAt = now + N days) (e.g., 5 days).
      - Return { token, projectId } or a managed QR JSON (server_url with /v1/key/<token>/projects/:projectId>).
  - On failure: generic auth failed.

  4. Revocation endpoint

  - New route: POST /projects/:projectId/app-users/:id/revoke (or /logout).
  - Action: Sessions.terminateByActorId(fieldKey.actorId); optionally also terminate the current token from
    context.
  - Use existing auth to require field_key.delete or similar admin verb, or allow self-revoke if authenticated as
    that field key.

  5. Session issuance defaults

  - Update FieldKeys.create:
      - If a password is present, skip creating the long-lived session.
      - If no password, preserve current long-lived token issuance for backward compatibility.
  - (Optional) Add an admin knob to disable long-lived tokens globally for field keys.

  6. Auth handler

  - No change needed for /key/<token>; it already looks up sessions and enforces expiry.
  - With short-lived sessions, expired tokens will be rejected naturally.

  7. Backward compatibility and migration behavior

  - Existing field keys (no password) continue to work with their long-lived tokens.
  - New password-protected field keys only function after the login endpoint issues a short-lived token.
  - Document that managed/legacy QR generation should be adjusted to:
      - For password-protected field keys: do not embed password; use the login endpoint to fetch a token/QR.
      - For legacy: unchanged.

  8. Admin UX considerations

  - Expose password set/update in the app-user API/UI.
  - Provide the login endpoint response in a form your AIIMS wrapper can consume (token + projectId, optionally
    full managed QR JSON).
  - Optionally add an API to list active sessions for a field key if you want visibility.

## Rationale, choices, gotchas

- Why short-lived tokens: limits blast radius of leaked devices; re-login plus PIN is required after expiry, unlike current 9999-year tokens.
- Why keep field-key tokens: Collect already uses `/key/<token>`; no Collect changes needed. We only change how the token is obtained.
- Why add passwords: gives an interactive login step so tokens are not printed in QR codes or pre-provisioned; admin can gate issuance behind credentials.
- Backward compatibility: legacy field keys without passwords keep working; we avoid breaking existing deployments.
- Token vs Basic: Basic would require extending authHandler for field_keys and lacks easy expiry/rotation; issuing short sessions is cleaner and revocable.
- Gotchas: deciding the login identifier (displayName vs dedicated login); must hash passwords; ensure we skip auto-issuing long-lived sessions when password is set; revocation should kill all sessions for that actor; document that managed QR should not include passwords (login endpoint returns token/QR).
