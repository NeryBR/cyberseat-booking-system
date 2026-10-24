# Shared persistence and transaction coordination

Owner: Alibi, coordinated with Nurali. Future database-session/unit-of-work code and common persistence conventions belong here. Domain records and queries can remain with their owning module, but every booking-affecting writer uses this shared transaction coordinator.

Implementation contract from [ECR-10](../../../docs/diagrams/architecture.md):

1. Deduplicate reservation creation by authenticated owner and operation key.
2. Acquire club guards before station guards, following ascending IDs for batches.
3. Use the club guard to coordinate working-hours/configuration changes and station guards for booking/maintenance/status changes.
4. Revalidate access, server time, schedules, confirmed reservations and maintenance after acquiring the guards.
5. Commit the business change, durable operation identity and applicable audit record together.
6. Keep the PostgreSQL reservation exclusion constraint as additional protection. A constraint on the reservations table does not enforce a separate maintenance table's rule.

Define connection lifetime, rollback and bounded retry handling here rather than duplicating them across routers. Detailed ER/schema decisions remain ECR-12; no database has been created by this directory.
