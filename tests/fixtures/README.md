# Shared synthetic fixtures

Reserve deterministic, documented fixture sets for tests and demonstrations. No real visitors, contact details or supervisor credentials belong here.

The first fixture implementation should include multiple clubs/time zones, PC/console stations, open and overnight schedules, confirmed/cancelled reservations, maintenance intervals and assigned/unassigned actors. Give scenarios stable identities and explicit expected outcomes; avoid hidden dependence on the current date.

Keep executable seed/reset logic with the component that owns its schema. This folder can hold shared data descriptions or versioned input files. Destructive resets must verify the target is a disposable test environment.
