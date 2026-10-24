# Backend verification

| Path | Scope | Owners |
|---|---|---|
| [`unit/`](unit/README.md) | Pure business rules and validation helpers | Module owners |
| [`integration/`](integration/README.md) | Actual PostgreSQL constraints, transactions, permissions and API effects | Alibi and Nurali |

Pytest is the proposed runner. Test files, fixtures and runner configuration will arrive with verified implementation, not as pretend passing placeholders. Cross-component browser checks live at [`tests/e2e/`](../../tests/e2e/README.md); load workloads live at [`tests/load/`](../../tests/load/README.md).

Use a separate disposable test database and synthetic data. Never run destructive setup against development, supervisor or customer databases. Executed evidence should record the commit, environment and result in `docs/testing/`.
