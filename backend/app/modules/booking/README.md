# Reservations and availability

Primary owner: Alibi. Implement availability, authenticated reservation creation, own history, pre-start cancellation and durable operation replay here.

Preserve the domain rules in [ECR-7](../../../../docs/requirements/booking-and-nfr.md): finite half-open intervals, club minimum duration, authoritative server revalidation, no concurrent overlap, maintenance/schedule coordination and retained cancelled history. A missing response has an unknown outcome until reconciled; it is not permission to create a fresh operation automatically.

Use `app/db/` for the shared transaction protocol. Administrative operations that affect reservations must use the same protocol. Do not replace actual PostgreSQL race checks with an in-memory test that cannot exercise its constraints.

Trace: SC-02 through SC-05, BR-01 through BR-16, ECR-12 and ECR-22. Implementation is not included yet.
