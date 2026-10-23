# CyberSeat - Booking and Non-functional Requirements

Version 1.0 | October 23, 2026 | Owner: Aibekuly Alibi | [ECR-7](https://nerybr.youtrack.cloud/issue/ECR-7)

Status: design baseline prepared for review. Must = mandatory for the core system; Should = desirable for the diploma version. Acceptance statements describe future verification, not tests already passed. Sources: [ECR-1 scenarios](user-scenarios.md), [proposal](../report/project-proposal.md), [research](../research/literature-review.md).

## Domain semantics

A station belongs to exactly one club. A reservation identifies its owner, station, start and end instants and persisted status `CONFIRMED` or `CANCELLED`. A past visit is determined from the end instant; it is not a third stored booking status. Sending, failed and unknown are interface states. An event is informational and creates no reservation automatically.

The club-configured minimum duration is validated for new reservations (as agreed in ECR-1); its initial value requires club/user confirmation. All intervals are finite and half-open `[s,e)` with `s < e`. Two intervals overlap exactly when `s1 < e2 AND s2 < e1`. Times are transmitted with an offset, validated against the club's IANA zone and stored as UTC instants; the zone identifier remains part of club configuration. Ambiguous or nonexistent local times require explicit resolution, never silent guessing. Future working intervals may cross midnight and must be converted to a continuous instant interval before containment is checked.

Availability requires an active club and station, full containment within an open working interval, and no overlap with a confirmed reservation or maintenance interval. Displayed availability is advisory. At commit, the server clock must still place the start in the future.

## Functional requirements and acceptance criteria

| ID / priority | Requirement | Verifiable acceptance criterion | Trace |
|---|---|---|---|
| BR-01 Must | Search availability for the selected club, station type and interval | Seed one free PC, one reserved PC and one blocked console; search returns the expected station statuses for that interval, with visible club zone | SC-01, SC-02 |
| BR-02 Must | Validate interval and station/club identity on the server | Missing fields, `end <= start`, duration below the configured club minimum, past start, inactive station, wrong club/station pairing or out-of-hours interval are rejected without a new reservation | SC-02, SC-03 |
| BR-03 Must | Create one reservation for the authenticated visitor after revalidation | For a valid free interval, committed record has the authenticated owner, selected station, exact instants, unique ID and `CONFIRMED`; success is shown only after committed response | SC-03 |
| BR-04 Must | Prevent overlapping confirmed bookings, including concurrent requests | Release 20 different visitors simultaneously against one free station and identical interval: exactly one success absent infrastructure faults; DB contains exactly one confirmed record. Repeat for partial overlap and containment | SC-03 |
| BR-05 Must | Permit adjacent intervals and independent stations | Book `[14:00,15:00)` then `[15:00,16:00)` on the same station: both succeed; same interval on two stations also succeeds | SC-02, SC-03 |
| BR-06 Must | Deduplicate retries of one logical creation operation | Two concurrent requests with the same authenticated owner and operation key and identical body return the same reservation ID; one record exists. Reusing the key for a different body returns a conflict | SC-03; common states |
| BR-07 Must | List and show only the visitor's own reservations | Visitor A cannot obtain B's details by changing an ID or list filter; authenticated ownership comes from the session, not a client owner field | SC-04; common states |
| BR-08 Must | Cancel an own confirmed booking only before its start | A valid cancellation records `CANCELLED`, preserves history and releases only that booking's occupancy. At/after start or for another owner it is rejected. A repeat of a completed cancellation is harmless | SC-05 |
| BR-09 Must | Coordinate bookings with maintenance creation and changes | Race a valid reservation and overlapping maintenance for the same station: no committed state contains both. If a booking wins, maintenance is rejected; if maintenance wins, booking is rejected | SC-03, SC-10 |
| BR-10 Must | Preserve reservations when working hours or station status change | A change that would invalidate a future confirmed booking is rejected with a conflict; it does not silently cancel or delete the booking | SC-08, SC-09 |
| BR-11 Must | Reconcile an unknown network outcome | Drop the response after commit; refresh own reservations and retry/query using the same operation key resolves to the original ID. UI says result is being checked until reconciliation, and does not create a new operation automatically | SC-03; common states |
| BR-12 Must | Revalidate after stale availability or session expiry | A second client takes the displayed slot; first client receives a conflict and refreshes choices. An expired session cannot commit; after login the interval is checked again | SC-02, SC-03; common states |
| BR-13 Must | Distinguish loading, empty, validation, conflict and server failure | Each state has a textual message and an appropriate next action. A server error is never displayed as an empty catalogue or confirmed booking | All scenarios; common states |
| BR-14 Must | Show club-local time consistently | Confirmation, own history, administration and calendar show the same instant in the selected club's zone with zone label; UTC/local conversion round-trips in a controlled fixture | SC-02 through SC-06 |
| BR-15 Must | Retain an audit trail for changes | Creation, cancellation and rejected administrative conflicts can be correlated through operation/request IDs; audit records contain actor, action, target, time and result, without credentials | SC-03, SC-05, SC-09 |
| BR-16 Should | Offer another interval or station after a conflict | Conflict view preserves the selected club/time and allows another availability search; alternatives are not presented as already held | SC-02, SC-03 |

## Invariants and state transitions

I1: no two confirmed reservations for one station overlap. I2: confirmed reservations and maintenance for one station do not overlap. I3: a new or changed reservation fits an open schedule at commit. I4: a logical creation operation has at most one reservation. I5: owner and assigned-club checks are server-side. I6: cancellation cannot erase history or another occupancy source.

Only `CONFIRMED -> CANCELLED` is a persisted user transition. Creation enters `CONFIRMED` atomically; rollback creates no booking. Repeated cancellation returns the existing cancelled result. Creating a new reservation after cancellation uses a new operation key; retrying the old key returns the original, now cancelled booking.

## Proposed API contract (design, not implemented endpoints)

| Operation | Proposed contract | Principal result/error |
|---|---|---|
| Availability | `GET /api/v1/clubs/{id}/availability?start=...&end=...` | 200 advisory statuses; 422 invalid interval |
| Create | `POST /api/v1/reservations`, operation key plus station and offset-aware interval | 201 first commit; 200 replay; 409 conflict; 401 session absent/expired; 422 invalid input |
| Own list/details | `GET /api/v1/me/reservations`, `GET /api/v1/me/reservations/{id}` | 200 own data; 404 absent or foreign resource |
| Cancel | `POST /api/v1/me/reservations/{id}/cancellation` | 200 cancelled/replayed result; 409 started; 404 absent/foreign |
| Reconcile creation | `GET /api/v1/me/reservation-operations/{key}` | 200 committed result; 202 in progress; 404 no durable result yet, which alone is not proof that an in-flight request failed |

Error bodies carry a stable machine code, safe message and correlation ID. The client cannot supply a trusted owner or role. Proposed idempotency records are unique by owner and operation key, include a normalised-body fingerprint and are committed with the booking. Retain the operation mapping for the lifetime of the booking in the MVP. A future retention limit requires an explicit protocol change. Standard HTTP POST is not assumed to be inherently idempotent.

## Non-functional requirements

| ID / priority | Requirement and target | Verification conditions |
|---|---|---|
| NFR-01 Must | Zero invariant violations in the defined concurrency suite | Real PostgreSQL, independent connections/API workers, synchronised race starts; 100 runs each for same-slot, partial overlap, booking vs maintenance, booking vs closure and cancel vs create; query DB state after each run |
| NFR-02 Must | No unauthorised own-record or cross-club operation | Negative tests for unauthenticated, visitor A/B, assigned/unassigned administrator and system administrator; direct HTTP requests as well as UI checks. ECR-8 defines complete administrative permissions |
| NFR-03 Must | Committed data survives API restart | Commit a booking, restart API, reconcile operation and read history; ID/status unchanged. Force failure before commit: neither booking nor success mapping remains |
| NFR-04 Must | Draft performance target: p95 availability <=500 ms, creation/cancellation <=1000 ms; unexpected HTTP 5xx <1% | Dedicated 4-vCPU/8-GB host, local Docker network, one API service and PostgreSQL; 10 clubs, 500 stations, 100,000 reservations, 30-day horizon; 50 virtual users, 80% availability/10% creates/10% cancels, 2-min warmup and 10-min measured run, three runs. Report achieved request rate and raw results; classify expected 409 conflicts separately. Targets require team agreement |
| NFR-05 Must | Bounded contention and errors | Draft lock timeout 2 s, maximum 3 full-transaction retries for retryable deadlock/serialization failure with bounded backoff; exhaustion returns explicit retryable failure, never success. Timeouts and retry counts must be recorded with load results |
| NFR-06 Must | Usable core flow at 360px and desktop width, with keyboard access | Check visible focus, meaningful labels and text statuses, field errors, no keyboard trap and no horizontal page overflow for core screens; use WCAG 2.2 AA as the design target, not a claim of certified conformance |
| NFR-07 Should | Draft usability goal: at least 80% unassisted task completion | Recruit at least 5 relevant visitors; each finds a free station, books and cancels. Report per-task counts, time and errors plus SUS where appropriate. Small convenience samples are formative and cannot establish population-wide benefit |
| NFR-08 Must | Reproducible environment and migrations | A teammate uses documented pinned dependencies, synthetic seed and migrations in a fresh environment; no undocumented manual schema edits. This check belongs to implementation, not current documentation |
| NFR-09 Must | Safe operational data handling | HTTPS in deployment; secrets excluded from source; credential/token values absent from error bodies and logs; server-side authorisation repeated on every operation. Authentication mechanism to be agreed in ECR-8 |
| NFR-10 Must | Reports use defined denominators and consistent snapshots | Utilisation definition specifies booking statuses, time clipping and available station-minutes; compare with hand-calculated synthetic fixtures. Past end time alone does not prove attendance; occupancy reporting is scheduled utilisation, not measured actual usage |

These numerical targets are explicit proposed evaluation conditions, not derived user evidence or measured performance. NFR-04 and NFR-07 require Nurali's evaluation-plan review and Mansur's UX review.

## Boundary examples for later tests

| Existing / requested data | Expected result |
|---|---|
| Confirmed `[14:00,15:00)` / request `[14:30,15:30)` | Reject overlap |
| Confirmed `[14:00,15:00)` / request `[13:00,16:00)` | Reject containment |
| Confirmed `[14:00,15:00)` / request `[15:00,16:00)` | Allow if other rules pass |
| Cancelled `[14:00,15:00)` / same interval new operation | Allow if other rules pass |
| Maintenance `[14:00,15:00)` / request same interval | Reject regardless of cancelled booking history |
| Open interval 22:00-02:00 next day / request 23:00-01:00 | Allow after club-zone conversion if other rules pass |
| Booking vs concurrent closure of the same club | Serialise at shared club guard; whichever commits second sees the first |
| Same operation key / changed station or interval | Reject key reuse; never create second booking |

## Review and dependencies

Review requested: Nurali for BR-09/10, administrative write protocol and NFR-02/10; Mansur for BR-11/13/14 and interface feasibility. New-document approval is pending. ECR-8 must use the same guards for schedule/maintenance writes; ECR-13 must record agreed targets and executed test evidence later; ECR-12 must translate invariants into schema/migrations. The October deliverable is this specification with its acceptance criteria.
