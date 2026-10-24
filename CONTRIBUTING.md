# Contributing to CyberSeat

The repository currently contains reviewed design materials and an implementation scaffold. The directories define where work belongs; they do not mean an application, database or automated test suite is already operational.

## Ownership and coordination

| Area | Primary owner | Coordination |
|---|---|---|
| `backend/app/modules/booking/`, shared data design, migrations and booking tests | Aibekuly Alibi | Nurali reviews interactions with schedules, maintenance and permissions |
| Identity/access, catalogue administration, events and reports | Akhmetov Nurali | Alibi reviews database and transaction changes |
| `frontend/` and browser interaction | Mansur Urynbassar | Backend owners agree API request/response/error shapes |
| `backend/app/db/`, configuration and cross-component contracts | Alibi and Nurali | Announce schema/configuration changes before depending on them |
| Documentation and system-level checks | All participants | Another participant reviews the affected area |

These are collaboration responsibilities, not GitHub permission settings. Each person commits from their own account. Do not manufacture commits, reviews or contribution evidence for another person.

## A small, reviewable change

1. Start from the latest `master` and create a branch such as `codex/ECR-22-booking-api` or `ECR-21-catalogue-screen`.
2. Keep the change tied to an ECR task and one meaningful outcome. Include the task ID in the commit and Pull Request title.
3. Read the relevant module README, [booking requirements](docs/requirements/booking-and-nfr.md) and [architecture](docs/diagrams/architecture.md) before implementation.
4. Include evidence appropriate to the change. Documentation: resolve links and inspect diagrams. Implementation: run applicable tests and report exact results and limitations.
5. Have the relevant teammate review changes. Record who actually reviewed; agreement reported by another person must be labelled as such.
6. Merge through a Pull Request. Add deliverable, commit/PR and review evidence to the YouTrack card before marking it Done.

Do not add unverified startup commands or claim a passing test suite that does not exist. Dependency manifests, lockfiles, migrations and runtime commands belong to the first implementation changes and must be checked there.

## Shared rules

- The backend is one modular monolith. A module is not a separate microservice.
- The server decides ownership and assigned-club access. A hidden frontend button is not authorisation.
- Booking, cancellation, schedule and maintenance mutations use the shared transaction protocol. Do not create an independent administration write path that bypasses it.
- Preserve half-open `[start, end)` intervals and explicit club-zone display. Use the requirements' operation identity for safe retries.
- Browser API calls go through `frontend/src/shared/api/`; the browser never reaches PostgreSQL directly.
- Keep credentials in ignored local configuration. Only public values may use the `VITE_` prefix.
- Use synthetic fixtures for development, tests, screenshots and reports. Do not commit participant contact details or real customer records.
- Generated test output belongs in ignored artifact directories. Final evidence intentionally included in a report belongs under `docs/testing/` or `docs/report/`.

## Repository hygiene

The root `.editorconfig` sets UTF-8, LF line endings and indentation. The root `.gitignore` covers local secrets, dependencies, caches and test output. Commit reproducibility files when they are introduced: `package-lock.json`, `pnpm-lock.yaml`, `uv.lock` or equivalent must not be ignored.

The final `pre-defense-1` tag is managed in ECR-17 after the complete submission version and access checks are verified. Do not move an existing submission tag.
