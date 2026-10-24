# Frontend

Primary owner: Mansur. This directory is the implementation scaffold for the proposed React/TypeScript web client. No runnable UI or dependency installation is included yet.

| Path | Responsibility |
|---|---|
| [`src/app/`](src/app/README.md) | Application entry, route composition, providers and shared layout |
| [`src/pages/`](src/pages/README.md) | Visitor/admin screen composition and route-level states |
| [`src/features/`](src/features/README.md) | Domain interactions such as station selection and reservation cancellation |
| [`src/shared/api/`](src/shared/api/README.md) | One HTTP client boundary, request models and safe error/retry behaviour |
| [`src/shared/ui/`](src/shared/ui/README.md) | Accessible reusable controls and common view states |
| [`tests/`](tests/README.md) | Component and frontend integration checks |

The first ECR-21 implementation should introduce a verified Vite/React/TypeScript project, dependency manifest, lockfile and documented development/build/test commands. This scaffold deliberately does not invent an executable entry point or a successful build.

## Boundary rules

Pages compose features and shared UI. Features call the shared HTTP boundary; shared UI does not contain reservation business rules. Keep server-derived availability separate from local selection and in-flight/unknown interface states.

Only `VITE_` configuration intended to be public may enter the browser bundle. The root [`.env.example`](../.env.example) documents the proposed API origin; no secrets or database connection settings belong in frontend code. The server still enforces all owner and club-assignment checks.

Use [ECR-1 scenarios](../docs/requirements/user-scenarios.md), [ECR-7 requirements](../docs/requirements/booking-and-nfr.md) and the later [UX materials](../docs/ux/README.md) as the interaction contract.
