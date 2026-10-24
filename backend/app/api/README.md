# HTTP API boundary

Place FastAPI routers, versioned route registration and HTTP-specific request/response adapters here. The planned public prefix is `/api/v1`; route files can be grouped by domain when implemented.

- Validate request shape and timezone-aware input at the boundary.
- Obtain actor identity from the server's authentication context, not a request owner/role field.
- Delegate booking/admin decisions to domain services; keep transactions out of ad hoc route code.
- Map validation, authentication, absence, conflict and retryable failures to the agreed error contract, without exposing database details or secrets.
- Preserve correlation and operation IDs across safe retries.

The [proposed endpoint table](../../../docs/requirements/booking-and-nfr.md) is the current design contract. There are no callable endpoints in this scaffold. Export OpenAPI only after router behaviour has been implemented and verified.
