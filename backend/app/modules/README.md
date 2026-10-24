# Domain modules

Modules are logical boundaries within the same FastAPI server and PostgreSQL deployment.

| Module | Primary owner | Owns | Coordination |
|---|---|---|---|
| [`identity/`](identity/README.md) | Nurali | Identity, owner checks and club assignments | Shared guard protocol for revocation-sensitive writes |
| [`catalogue/`](catalogue/README.md) | Nurali | Clubs, station specifications and club zone | Booking reads these records; station-status changes coordinate with active bookings |
| [`booking/`](booking/README.md) | Alibi | Availability, reservation lifecycle and operation identity | Uses schedules/maintenance and shared database coordinator |
| [`administration/`](administration/README.md) | Nurali | Working hours, maintenance and authorised operational changes | No separate unsafe booking writer |
| [`events/`](events/README.md) | Nurali | Published informational calendar records | Mansur implements visitor/admin calendar interfaces |
| [`reporting/`](reporting/README.md) | Nurali | Defined indicators and audit queries | Alibi aligns persistence; Mansur implements the views |

Each module can introduce its own models, schemas, services and queries when implementation requires them. Avoid empty layers or duplicate generic repositories merely to match a template. The route boundary lives in `app/api/`; common persistence and transactions live in `app/db/`.
