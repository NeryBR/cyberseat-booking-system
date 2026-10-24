# Shared server contracts

Shared configuration parsing, identity/session context, stable error codes and request-correlation conventions belong here. Define infrastructure contracts that domain modules can reuse without importing one another's HTTP routes.

The [root environment example](../../../.env.example) proposes configuration keys. The first implementation must validate them, reject placeholder secrets before any non-development deployment and document where local `.env` is loaded. No configuration loader exists yet.

Keep passwords, session/token values and connection credentials out of logs and error responses. Club ownership and assignment policy is implemented in the identity/access module, not inferred from a globally trusted role string.
