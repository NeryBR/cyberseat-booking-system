# Database migrations

This is the reserved location for Alembic configuration and revision history. No revision, table or database is created by this README.

Alibi introduces the first verified migration after ECR-12 defines the shared schema. Coordinate revision ownership with Nurali: fetch the latest history before creating a revision, avoid conflicting heads and review generated changes rather than accepting them blindly.

The first migration change must record the tested PostgreSQL version, driver, required extensions, creation/upgrade commands and synthetic seed procedure. Verify foreign keys, interval bounds, the active-reservation exclusion constraint and operation-key uniqueness on actual PostgreSQL. Add downgrade or recovery guidance appropriate to the change; never edit an applied revision to hide a new schema change.
