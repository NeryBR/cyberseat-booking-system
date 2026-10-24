# Shared HTTP boundary

The future API base URL, transport client, response/error mapping and reusable request conventions belong here. Pages/features should not duplicate ad hoc HTTP calls.

Contract to preserve:

- `/api/v1` is the proposed prefix; actual endpoints are implemented and verified later.
- Treat availability as advisory and use the server's committed reservation response for success.
- Carry the original operation key through a creation retry. Do not blindly retry every POST or generate a fresh key after an unknown response.
- Distinguish 401 session expiry, 404 missing/foreign own resource, 409 domain conflict, validation failures and retryable infrastructure failures.
- Refresh own history and reconcile a lost creation response before reporting success/failure.
- Send offset-aware instants and display the club zone consistently. Changing an interval invalidates old availability results.

Coordinate the final typed contract with the backend owners. TypeScript types are not runtime validation or authorisation. Do not hard-code real credentials or assume the authentication transport before the team chooses it.
