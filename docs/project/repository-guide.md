# Repository and Configuration Guide

Prepared October 24, 2026. Task: [ECR-14](https://nerybr.youtrack.cloud/issue/ECR-14). Owner: Aibekuly Alibi. Design stage: the scaffold is present; application implementation is pending.

## Architecture to directory map

| Boundary | Path | Owner / rationale |
|---|---|---|
| HTTP transport | `backend/app/api/` | Domain owners agree routers and errors; routes delegate business decisions |
| Common configuration and request contracts | `backend/app/core/` | Alibi and Nurali maintain the shared contract |
| Shared database/transaction coordinator | `backend/app/db/` | Alibi coordinates all booking-affecting writers with Nurali |
| Access and assignments | `backend/app/modules/identity/` | Nurali; owner/object and assigned-club checks |
| Club and station records | `backend/app/modules/catalogue/` | Nurali, with Alibi on the shared schema |
| Availability and reservation lifecycle | `backend/app/modules/booking/` | Alibi; operation identity, cancellation and conflict prevention |
| Working hours and maintenance | `backend/app/modules/administration/` | Nurali; uses the shared write protocol |
| Informational calendar | `backend/app/modules/events/` | Nurali provides server behaviour; Mansur provides interfaces |
| Indicators and audit retrieval | `backend/app/modules/reporting/` | Nurali; documented denominators and committed records |
| Shared schema revisions | `backend/migrations/` | Alibi and Nurali coordinate Alembic history |
| App composition and screens | `frontend/src/app/`, `frontend/src/pages/` | Mansur; route/layout composition |
| Domain interactions | `frontend/src/features/` | Mansur; feature state and user operations |
| Browser transport and reusable UI | `frontend/src/shared/api/`, `frontend/src/shared/ui/` | Mansur, with backend contract coordination |

The module map follows [ECR-10](../diagrams/architecture.md). It is one modular monolith, not six server deployments. The shared database coordinator keeps booking and administrative operations consistent.

## Verification locations

| Location | Intended evidence |
|---|---|
| `backend/tests/unit/` | Pure rules and validation helpers |
| `backend/tests/integration/` | Actual PostgreSQL transactions/constraints and API effects |
| `frontend/tests/` | Local component and frontend interaction checks |
| `tests/e2e/` | Integrated browser journeys |
| `tests/load/` | API load/contended workload definitions |
| `tests/fixtures/` | Deterministic synthetic scenario descriptions and shared inputs |
| `docs/testing/` | Agreed plan and intentionally curated executed evidence |

No test suite has been implemented by this structure change. Test setup and runner configuration must arrive with the relevant implementation. Do not confuse a folder or a test plan with an executed result.

## Environment contract

The root [`.env.example`](../../.env.example) lists intended names. It is not an active settings loader, a provisioned database account or a production configuration.

| Group | Keys | Boundary |
|---|---|---|
| Server | `CYBERSEAT_ENV`, `API_HOST`, `API_PORT`, `CORS_ORIGINS`, `APP_SECRET_KEY` | Server only; validate settings when implemented |
| PostgreSQL | `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD` | Server only; passwords are placeholder text |
| Integration tests | `TEST_DATABASE_NAME` | Must identify a separate disposable database; the name alone is not a safeguard |
| Public client | `VITE_API_BASE_URL` | Intentionally public browser bundle configuration; never put secrets under this prefix |

Local `.env` and environment variants are ignored. `.env.example` files remain tracked. A frontend implementation must explicitly document its environment-loading location; Vite must not be assumed to read the repository-root `.env` when run from `frontend/`. The same explicit loading rule applies to the backend.

## What gets committed

Commit source, documentation, reviewed migrations, synthetic fixture inputs, example configuration, dependency manifests and lockfiles when introduced. Preserve Mermaid diagram sources and reviewed readable exports together.

Keep actual passwords/keys, local environments, installed dependencies, build output, caches, raw test output and local database backups out of commits. The root `.gitignore` implements these ordinary exclusions; it is not a claim that secrets scanning or an access review has been completed.

## Team workflow and the next implementation

See [CONTRIBUTING.md](../../CONTRIBUTING.md) and the [Pull Request template](../../.github/pull_request_template.md). Each participant uses their own account and references an ECR task. Shared schema/API/configuration changes require explicit coordination before another module depends on them.

Next implementation work remains in ECR-12 (data model), ECR-21 (frontend), ECR-22 (booking/database) and ECR-23 (administration). Add only layers that have a real implementation; the current guide does not mandate empty services or generic repositories. ECR-17 owns access verification and final submission tagging.
