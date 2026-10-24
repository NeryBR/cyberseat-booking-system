# Backend

One Python/FastAPI server deployment exposing the planned `/api/v1` REST API. PostgreSQL is shared by all server modules. No runnable server, installed dependencies or schema migrations are present yet.

| Path | Responsibility |
|---|---|
| [`app/api/`](app/api/README.md) | HTTP boundary and versioned routing |
| [`app/core/`](app/core/README.md) | Configuration, identity context and common error contracts |
| [`app/db/`](app/db/README.md) | Database sessions, shared transaction coordinator and persistence conventions |
| [`app/modules/`](app/modules/README.md) | Domain responsibilities and module boundaries |
| [`migrations/`](migrations/README.md) | Future Alembic revisions; no pretend or untested schema |
| [`tests/`](tests/README.md) | Backend unit and actual-PostgreSQL integration checks |

## Dependency direction

HTTP routes validate transport data and call the relevant domain service. Services enforce business rules and use shared database access; HTTP handlers and frontend code do not write tables directly. Shared infrastructure must not import a domain module just to initialise itself. Cross-module mutations follow the single protocol in [ECR-10](../docs/diagrams/architecture.md).

Alibi owns booking and database design. Nurali owns administrative functionality. Both coordinate changes to `app/core/`, `app/db/` and migrations.

## First implementation checkpoints

ECR-12 defines the schema. ECR-22 introduces verified dependency/configuration files, FastAPI entry point, migrations and the booking API. ECR-23 adds administrative operations. Record compatible versions and tested commands in this README when that implementation exists. SQLAlchemy, Alembic and Pytest remain the proposed tools from [ECR-6](../docs/research/technology-comparison.md).
