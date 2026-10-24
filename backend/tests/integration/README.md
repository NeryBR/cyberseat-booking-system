# Actual-PostgreSQL integration checks

Alibi verifies booking/persistence; Nurali verifies administrative permissions and shared mutations. Use independent connections/workers and controlled fixtures on the supported PostgreSQL environment.

Required future cases include simultaneous same-slot and partially overlapping bookings, adjacency, booking versus maintenance, booking versus schedule closure, cancellation versus creation, duplicate operation keys, changed payload with the same key, rollback, response loss after commit and cross-owner/cross-club access attempts.

After a race, inspect committed database state using the domain invariant, not just the number of HTTP success responses. Preserve a readable failing history with operation/request IDs. A SQLite substitute does not exercise PostgreSQL range constraints or the shared guard protocol.

Target conditions are specified in [`docs/requirements/booking-and-nfr.md`](../../../docs/requirements/booking-and-nfr.md). No suite has been executed yet.
