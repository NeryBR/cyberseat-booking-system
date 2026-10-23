# CyberSeat — Administrative Requirements Specification

Version 1.0 · October 23, 2026 · Owner: Akhmetov Nurali · ECR-8

Status: proposed specification, ready for team review. Shared-model agreement and reviewer confirmation are pending. Acceptance examples describe future verification, not executed application tests.

## Purpose and submission scope

This specification and the [role matrix](roles-and-permissions.md) cover the administrative part of university requirement 6, Requirements specification. They complement Alibi's [booking and non-functional baseline](booking-and-nfr.md) and Mansur's [SC-01–SC-14 scenarios](user-scenarios.md).

October covers analysis, design and planning. Mandatory submission: **October 24, 2026 before 18:00 in the university-specified time zone**. The team's October 21, 2026 23:00 target is an internal milestone. A completed frontend/backend and final test results are not required for this submission.

Must = required product behaviour; Should = desirable capability that may be deferred explicitly. Documenting a Must feature does not assert implementation in October. Payments, revenue reports, loyalty, hardware control, event registration, permanent deletion and superadministrator provisioning are outside this task.

## Shared domain contract

| Entity | Required meaning and relationships |
| --- | --- |
| User | Stable authenticated identity; personal booking ownership comes from this identity. |
| Club | Stable ID, name, address, IANA time zone, active state and configurable positive minimum booking duration. |
| Administrator assignment | User-to-club relationship with active/revoked state or validity interval. Many clubs per administrator and many administrators per club; no duplicate active pair. |
| Gaming station | Stable ID, exactly one club, club-unique label, PC/console type, specifications and effective active intervals. Referenced stations cannot be moved or deleted. |
| Working schedule | Club-local weekly intervals plus dated exceptions. An exception replaces the regular schedule for its local date; a closed exception supplies no opening interval. Merge overlapping opening intervals before calculations. |
| Maintenance interval | Station, start/end instants, reason, effective/cancelled state and audit metadata; restricts availability independently of reservation history. |
| Reservation | Owner, station, start/end instants and persisted CONFIRMED or CANCELLED status, matching the booking baseline. Retain cancellation actor/time/reason. Past end time is derived, not proof of attendance. |
| Event | Exactly one club; title, description, location, start/end instants and DRAFT/PUBLISHED/CANCELLED state. No automatic station occupancy. |
| Audit entry | Actor, action, target, club where applicable, UTC instant, result, change/reason summary and correlation ID; no credentials. |

All booking, maintenance and report intervals are finite and half-open: [start,end), start < end. Overlap is start1 < end2 AND start2 < end1; adjacent intervals do not overlap. Store instants in UTC, retain the club's IANA zone and display local time with the zone. Ambiguous/nonexistent local times require explicit resolution. Overnight hours become continuous intervals after conversion.

Retain effective-dated club/station activity, schedule and maintenance history to reproduce historical capacity. Later deactivation, block removal or schedule revision must not overwrite past capacity. Exact tables, revision fields and migrations require Alibi's shared-model review; they are proposed requirements here, not an assertion about the current ER model.

## Functional requirements and acceptance criteria

Every operation obeys the [permission matrix](roles-and-permissions.md); operational permissions never extend beyond assigned clubs.

| ID / priority | Requirement | Verifiable acceptance criterion | Trace |
| --- | --- | --- | --- |
| ADM-01 / Must | Superadministrator creates clubs and manages activation/time zone. Assigned admin edits only club name/address and operational settings. | Missing/invalid zone or non-positive minimum duration is rejected. Admin cannot create clubs, change club identity/zone or access another club. System changes obey ADM-08. | SC-07, SC-14 |
| ADM-02 / Must | Superadministrator grants/revokes administrator assignments. | Grant enables exactly the selected existing club/user pair; duplicate active pair is rejected; revocation denies subsequent operations and is audited. | SC-14; RBAC-05 |
| ADM-03 / Must | Assigned admin creates/edits stations. | Validate required label/type; reject duplicate label in one club, allow same label in different clubs. Public specifications match saved data. Reparenting is rejected. | SC-08 |
| ADM-04 / Must | Deactivate stations without deleting bookings/history. | Immediate deactivation with a future or in-progress confirmed booking is rejected. Otherwise it succeeds and blocks new bookings; past records remain resolvable. | SC-08; BR-10 |
| ADM-05 / Must | Define weekly hours and dated exceptions. | Reject invalid instant intervals; accept valid overnight hours; apply dated exception instead of regular hours. Reject any change invalidating a protected booking atomically. | SC-09; BR-10 |
| ADM-06 / Must | Create/update/remove maintenance with reason. | Booking [14:00,15:00) prevents block [14:30,15:30); adjacent [15:00,16:00) is permitted if otherwise valid. Removal retains history and never removes another block/booking. | SC-10; BR-09 |
| ADM-07 / Must | List club bookings by period/station/status with minimum service data. | Return only bookings overlapping selected period in the assigned club. Cancelled records never appear occupied; foreign nested station IDs are rejected. | SC-11 |
| ADM-08 / Must | Preserve protected bookings during club/station/schedule/block/zone changes. | Reject the whole change if any CONFIRMED booking with end > server_now becomes invalid; show a safe conflict summary within authorised scope. Never automatically cancel, shorten, move or delete bookings. | SC-08–10, SC-14; BR-09/10 |
| ADM-09 / Must | Allow explicit admin cancellation before booking start, with a reason. | Recheck assignment, reason and server_now < start; retain record and actor/time/reason; release only its own occupancy. Replay is harmless. At/after start return 409 until separate club rules are approved. | SC-05, SC-11 |
| ADM-10 / Must | Create/edit drafts and publish valid club events. | Require nonempty title/description/location and a valid interval. Public queries exclude drafts and show saved published details in club-local time. | SC-06, SC-13 |
| ADM-11 / Must | Cancel published events while retaining history. | Public details clearly show CANCELLED; retries preserve one event record. Publication/cancellation never changes station occupancy. | SC-06, SC-13 |
| ADM-12 / Must | Produce defined reservation and scheduled-utilisation reports. | Show club, zone, [from,to), generation instant, snapshot cutoff and formula version; reject invalid/unauthorised scope. Controlled fixtures below give stated results. | SC-12; NFR-10 |
| ADM-13 / Must | Audit administrative changes and rejected conflicts. | Successful mutations have durable audit records; failed transactions leave no partial mutation. Safe failure records correlate actor/action/target/time/result/reason/request. | SC-09–14; BR-15 |
| ADM-14 / Must | Detect stale updates and reconcile uncertain writes. | Obsolete resource version yields 409. Creation retries with same actor/key/body return original result; changed body conflicts. Lost response never appears as confirmed success before reconciliation. | Common states; BR-06/11 |
| ADM-15 / Should | Show a change summary before saving. | Summary identifies club/station, effective interval and change. A later concurrent conflict still rejects the write at commit. | SC-08–10 |

## Transactional booking protection

Booking creation and administrative writes must use the same protection protocol, not only an advisory UI check. Reuse Alibi's shared club guard and deterministic station lock ordering, or an equivalent agreed transactional mechanism. Validate current assignments, versions, schedule, effective states and conflicts atomically with the write. Order assignment revocation with protected mutations as required by RBAC-05.

| Race/boundary | Required committed outcome |
| --- | --- |
| Booking vs overlapping maintenance | One may commit; the other observes the conflict. Never commit both. |
| Booking vs closure/reduced hours/deactivation | Booking first means conflicting admin change fails. Admin change first means invalid booking fails. |
| Two edits from one version | First succeeds; stale second edit fails without overwriting it. |
| Cancellation vs block | Serialize and revalidate; block may follow cancellation if all remaining constraints permit it. |
| Multi-station change | All valid changes commit together or none. |
| Increased minimum duration | Applies to new requests only; existing bookings are not invalidated retroactively. |
| Zone change with future/in-progress confirmed bookings | Reject in this baseline. Without protected bookings, change prospectively and preserve historical zone/schedule revisions. |

SC-08 permits deactivation while preserving records; BR-10 rejects changes invalidating future bookings. Together they mean that immediate conflicting deactivation must fail. Future-effective deactivation may be specified separately.

SC-05/SC-11 leave post-start status changes dependent on approved club rules. This baseline enables explicit pre-start cancellation only. Post-start cancellation, attendance, refunds, relocation and additional statuses remain deferred; an administrative role alone does not define those business rules.

## Report calculation rules

### Scope, period and snapshot

Select one authorised club and finite nonempty P=[from,to) in its zone. Convert boundaries to UTC; measure elapsed durations between instants in minutes. A date-only inclusive last day converts to midnight of the following local day and is displayed as the resulting exclusive end. Reject empty/reversed/malformed or unresolved ambiguous periods.

Read all inputs from one consistent committed snapshot T; show T and definition version with results. Apply historical schedules, club/station activity and maintenance effective during P, not today's configuration projected backwards. Later cancellation may restate a newly generated report; an earlier saved result retains its snapshot identity. These indicators measure scheduled bookings, not actual attendance or revenue.

For each station s existing during some part of P:

- W_s is the union of effective club opening intervals, intersected with P and effective active club/station intervals.
- M_s is the union of effective maintenance intersected with W_s. Merge overlaps before subtraction; never subtract a minute twice.
- A_s = W_s minus M_s: available capacity, including time occupied by bookings.
- B_s is the union of booking intervals whose status is CONFIRMED at T, intersected with P.
- O_s = B_s intersect A_s: scheduled occupied time. CANCELLED contributes no occupied minutes.

| Indicator | Exact definition |
| --- | --- |
| Confirmed count | Distinct CONFIRMED IDs at T whose visit intervals overlap P, including bookings starting outside P. |
| Cancelled count | Distinct CANCELLED IDs at T whose original visit intervals overlap P; not a count by cancellation timestamp. |
| Total count | Confirmed + cancelled count; no additional persisted status assumed. |
| Available station-minutes | A = sum duration(A_s). Subtract maintenance and closed/inactive time, not bookings. |
| Scheduled occupied station-minutes | O = sum duration(O_s), clipped to P and capacity. |
| Free station-minutes | A - O. |
| Scheduled utilisation | 100 * O / A when A > 0; otherwise N/A with no-capacity explanation. |
| Cancellation share | 100 * cancelled_count / total_count when total_count > 0; otherwise N/A. |

Aggregate exact durations before formatting; display minutes and percentages to two decimal places, rounding half up. Compute club utilisation from total O/A, not an average of station percentages. A spanning booking can count in several overlapping periods; do not sum those distinct counts into a unique total. Durations over disjoint periods are additive under the same snapshot and definitions.

If historical inputs are missing, show insufficient historical data rather than fabricated zero. If confirmed bookings overlap each other or fall outside effective capacity, report a data-integrity error and withhold utilisation/free-time results; do not silently hide invalid data through clipping or interval unions. An empty booking set with positive capacity gives O=0 and utilisation=0.00%. A calculation/loading error is never an empty result.

### Controlled acceptance examples

These are proposed future fixtures, not executed test results. Times within each fixture use one explicitly labelled club zone.

| Fixture | Expected result |
| --- | --- |
| P 10:00–12:00; two active/open stations; S1 maintenance 10:00–10:30, confirmed 10:30–11:30; S2 confirmed 11:00–12:00, cancelled 10:00–11:00 | A=210 min; O=120; free=90; utilisation=57.14%; confirmed=2; cancelled=1; total=3; cancellation share=33.33%. |
| P 11:00–12:00; one station open 10:00–14:00; confirmed 10:30–11:30 | A=60; O=30; free=30; utilisation=50.00%; confirmed count=1. |
| P 10:00–12:00; one station open throughout; blocks 10:00–10:45 and 10:30–11:00; no bookings | Maintenance union=60 min, not 75; A=60; O=0; free=60; utilisation=0.00%; counts=0; cancellation share=N/A. |
| All stations closed/blocked throughout P | A=0; O=0; free=0; utilisation=N/A, with no-capacity explanation. |
| P 10:00–11:00; cancelled booking ends exactly at 10:00 or starts exactly at 11:00 | Neither boundary-only booking is counted. |
| Historical P has 120 open/active minutes; station deactivated after P | Historical A stays 120. |
| Historical schedule revision is missing | Insufficient historical data; no valid utilisation shown. |
| Invalid confirmed booking overlaps maintenance | Data-integrity error; no valid utilisation/free-time result shown. |

## Cross-cutting verification plan

Reuse NFR-01–NFR-10 from the booking baseline: concurrency, authorisation, persistence, performance and usability targets remain future evaluation conditions. No performance measurement or final test pass is asserted here.

Administrative forms distinguish loading, empty data, validation, insufficient permissions, conflicts, expired sessions, server errors and unknown write outcomes. Preserve valid input; use textual statuses alongside colour. Show a saved result only after server confirmation. Core flows support 360px and desktop widths, labelled controls and keyboard access according to NFR-06.

Later implementation checks use two clubs, a one-club admin, a multi-club admin, a visitor, an unassigned superadministrator, overnight hours and the report fixtures above. Check direct HTTP requests as well as UI flows. Reuse NFR-01's real-PostgreSQL concurrency conditions. October review verifies that cases and expected outcomes are documented, not that a finished application passes them.

## Coordination and pending decisions

| Topic | Proposed decision | Reviewer needed |
| --- | --- | --- |
| Shared relationships/statuses | Stable IDs; many-to-many assignments; CONFIRMED/CANCELLED booking statuses. | Aibekuly Alibi |
| Transaction ordering | Common club/station guards; revocation ordered with writes. | Aibekuly Alibi |
| Historical reports | Effective activity/schedule/maintenance history and consistent snapshots. | Aibekuly Alibi |
| Admin cancellation | Reason required, pre-start only; post-start policy deferred. | Aibekuly Alibi and Mansur Urynbassar |
| Navigation and states | Guest events; separate personal/club scope; N/A/conflict/stale-data states. | Mansur Urynbassar |

Earlier agreement about booking materials does not prove review of this new specification. Obtain a new review against its commit. Revise this document, the role matrix and affected scenarios/booking rules together if the team changes a proposed decision.

Open decisions: exact authentication/session design and superadministrator bootstrap; initial club minimum duration; post-start club policy; physical history schema/retention; final report response schema. A blocking disagreement on a Must rule must be resolved or explicitly scoped before closure.

## October deliverable acceptance

| Task criterion | Evidence | State |
| --- | --- | --- |
| Four separate roles | Role definitions, permission matrix, RBAC-01–09 | Documented; review pending |
| Clubs, stations, schedules, blocks, events, reports | ADM-01–15 | Documented; review pending |
| Admin limited to assigned clubs | Matrix; RBAC-02/03/05/06 | Documented; review pending |
| Existing bookings protected | ADM-04/05/06/08; transaction table | Documented; shared-model review pending |
| Priorities and verifiable criteria | Must/Should, IDs, acceptance columns | Documented |
| Explicit report calculations | Formulas, boundaries, historical inputs, fixtures | Documented; model review pending |
| Scenario and model coordination | SC/BR/RBAC traces and review table | Traced; agreement pending |
| Result/commit/PR links and named reviewer | GitHub files and PR; reviewer records commit/outcome | Link evidence in task; review pending |

- [ ] Attach both document links and the commit/Pull Request to ECR-8.
- [ ] Obtain Alibi's agreement on the shared data/transaction model.
- [ ] Record the actual reviewing participant, reviewed commit and outcome; resolve blocking comments.
- [ ] Confirm every criterion, then move the task to Done.

File creation or a PR alone does not complete team review. Do not claim approval or final application test results for this October specification.
