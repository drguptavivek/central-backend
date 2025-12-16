# Commands

## Apply vg app-user auth SQL migration

Assumes docker-compose project `central` with Postgres service name `central-postgres14-1` and database/user `odk`.

```sh
docker exec -i central-postgres14-1 psql -U odk -d odk < plan/sql/vg_app_user_auth.sql
```
