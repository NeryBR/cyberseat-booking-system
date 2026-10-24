# System-level verification

| Path | Purpose | Owner / coordination |
|---|---|---|
| [`e2e/`](e2e/README.md) | Browser journeys against an integrated application | Mansur, with Alibi/Nurali for backend setup |
| [`load/`](load/README.md) | Reproducible API load and contention workloads | Alibi; measurement plan coordinated with Nurali |
| [`fixtures/`](fixtures/README.md) | Shared synthetic scenarios and fixture conventions | All participants |

Backend-local tests belong in `backend/tests/`; frontend-local checks belong in `frontend/tests/`. Put generated reports in ignored `tests/artifacts/`, `test-results/` or `playwright-report/`, then intentionally select final evidence for `docs/testing/`.

The directory structure is ready; application test tools and tests are not implemented by this scaffold. ECR-13 owns the evaluation plan and later executed evidence must identify workload, environment, version and limitations.
