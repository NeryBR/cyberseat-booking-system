# CyberSeat — Verification and Evaluation Plan

Version 1.0 · October 23, 2026 · ECR-13 · Document coordinator: Akhmetov Nurali

**Status: planned; no application tests or user studies have been executed under this plan.** Numerical examples are expected values, not observed results. Reviewer confirmation for this plan is pending; approval of earlier requirements is not approval of this new deliverable.

## 1. Submission scope and objectives

This document addresses university item 9, Verification and evaluation plan, for the first analysis/design/planning submission. It defines future checks and measurement procedures, not final results from a finished product. Required submission: **October 24, 2026 before 18:00 in the university-specified time zone**. October 22, 2026 21:00 is the team's internal planning target, not a separate university deadline.

Verification asks whether the implementation will meet its specified behaviour; evaluation asks whether representative users can complete the intended tasks and how the proposed workflow compares with a controlled manual workflow. A working frontend/backend and executed final tests are not prerequisites for this October document.

The planned scope covers booking integration/concurrency, permissions, administrative safeguards, reports, UX/responsiveness, persistence, reproducibility and performance. Payments/revenue, loyalty, hardware control, event registration and deferred post-start cancellation rules are excluded. Informational events must not automatically occupy stations.

## 2. Inputs, baseline and responsibilities

The plan is based on the repository after [requirements merge 2c1c419](https://github.com/NeryBR/cyberseat-booking-system/commit/2c1c419d6cda0a10b2ba516e89007bcd284ab1df). At every future execution record the actual implementation SHA, requirement revision and fixture version; changed inputs require an impact review before comparing results.

| Input | Baseline | Use |
| --- | --- | --- |
| [User scenarios](../requirements/user-scenarios.md) | ECR-1, v1.0 | SC-01–SC-14 and shared interface states |
| [Booking and NFR specification](../requirements/booking-and-nfr.md) | ECR-7, v1.1 | BR-01–16; NFR-01–10; invariants I1–I6 |
| [Role matrix](../requirements/roles-and-permissions.md) | ECR-8, v1.0 | RBAC-01–09; four roles and assigned-club boundaries |
| [Administrative specification](../requirements/administrative-requirements.md) | ECR-8, v1.0 | ADM-01–15; protected changes and report definitions |
| [Architecture](../diagrams/architecture.md) | ECR-10, v1.1 | React/TypeScript, FastAPI REST API, PostgreSQL, shared transaction coordinator |
| [UX coverage](../ux/README.md), [editable prototype](../ux/prototype.html), [screen export](../ux/cyberseat-ux-prototype.png) | ECR-9, v1.0 | Screen walkthrough and later user-task basis; static screens are not a working reservation service |

| Owner | Future work | Cross-review |
| --- | --- | --- |
| Aibekuly Alibi | INT booking checks, CON races, persistence, PostgreSQL fixtures and k6 load execution | Nurali reviews reservation-safe administrative races; Mansur checks API/UI failure handling |
| Akhmetov Nurali | SEC permission checks, ADM integration checks, REP hand-calculated oracles, audit; coordinates this plan | Alibi checks data/snapshot assumptions; Mansur checks understandable report/error presentation |
| Mansur Urynbassar | UX task protocols, responsive/keyboard checks, browser integration and formative user sessions | Nurali checks role-specific navigation; Alibi checks booking-state consistency |

Owners coordinate boundary cases together; assigning an owner does not record completed work or approval. Tools are planned: Pytest with real PostgreSQL for integration/races, Vitest/Testing Library for client components, Playwright for browser flows, and k6 for load. Pin actual versions and executable commands when a runnable build exists; no unverified setup commands are presented as working instructions.

## 3. Environments and synthetic data

| Dataset/environment | Exact planned conditions |
| --- | --- |
| F-CORE | Resettable two-club fixture: C-A and C-B, PC/console stations, active/inactive resources, weekly hours plus dated closure, overnight hours, CONFIRMED/CANCELLED bookings, maintenance and DRAFT/PUBLISHED/CANCELLED events. Use a documented positive club minimum, e.g. 30 minutes for this fixture only. |
| F-AUTH | Guest, visitors V-A/V-B, administrator of C-A only, administrator assigned to both clubs, revoked administrator, and superadministrator without a club assignment. Give each protected resource an owning club. Also test an explicit club assignment added to/revoked from the superadministrator. |
| F-TIME | Freeze the server clock at a recorded instant; place create/cancel boundaries relative to it. Default club zone Asia/Almaty; add UTC round trips and an IANA zone with an offset transition, with pinned time-zone data. Test unresolved ambiguous/nonexistent local times. Never hard-code future bookings that become past as the calendar advances. |
| F-REPORT | REP-01–10 below. Hand-calculated expected records are versioned independently of production report code. Historical capacity revisions are mandatory inputs. Corrupt/missing-history examples use isolated test fixtures, not production writes. |
| F-LOAD | 10 clubs with 50 stations each (40 PC/10 console); all active and open 24 hours, minimum duration 30 minutes, no maintenance in the load seed (maintenance is exercised separately). Seed 20261023; a future 30-day UTC horizon begins at the next UTC midnight after the frozen test clock. Each station has 200 one-hour reservations spaced three hours apart from horizon start: first 160 CONFIRMED, remaining 40 CANCELLED, for exactly 100,000 records (80,000/20,000). Distribute ownership deterministically across 50 synthetic visitors. Use free gaps for valid creates and owned future confirmed rows for cancels; never count fixture exhaustion as normal business conflict. Restore this seed for each run; record counts at measurement start/end, since warmup and load mutate records. No real personal data. |
| E-INTEGRATION | Real PostgreSQL with applied migrations; independent connections and at least two independent API workers/processes for races. The load environment remains one API service, as NFR-04 specifies. In-process mocks/SQLite cannot establish the PostgreSQL concurrency guarantees. |
| E-LOAD | Dedicated 4-vCPU/8-GB host; local Docker network; one API service plus PostgreSQL, no unrelated workload. Record OS, CPU model, DB/API worker counts, resource limits, connection pools, dependency versions and k6 host placement. Keep these constant in baseline and target runs. |
| E-UI | Record browser/OS versions. Planned Chromium desktop viewport 1440x900; mobile 360x800 and 390x844; tablet 768x1024. Also repeat core flows in current stable Firefox and WebKit at 360px and desktop width, pinning actual versions at execution. Real-device checks are supplementary and explicitly labelled. |

All intervals use [start,end); adjacent endpoints are allowed. Reservation statuses remain CONFIRMED/CANCELLED; past end is not an attendance status. Reset synthetic databases between independent runs, but preserve durable state deliberately during restart/replay checks. Use deterministic seeds and independent request/operation IDs; capture the seed with any failure.

## 4. Integration and administrative checks

All cases are **NOT RUN**. Every table row expands into explicit test parameters from the linked requirements. Must cases must pass all listed variants; Should features may be deferred with a recorded reason.

| Test ID | Owner | Procedure and expected outcome | Requirement trace |
| --- | --- | --- | --- |
| INT-01 | Alibi | Search F-CORE: free PC, booked PC and blocked console give correct statuses. Submit missing fields, reversed/empty/past intervals, below-minimum duration, out-of-hours, inactive resource and mismatched club/station IDs: reject without writes. | BR-01/02; SC-01/02 |
| INT-02 | Alibi | Create on a valid free interval; assert committed owner comes from session, station/instants match, one stable ID is CONFIRMED and success follows commit. | BR-03; SC-03 |
| INT-03 | Alibi | Book adjacent intervals on one station and identical intervals on different stations: both succeed. Partial overlap, containment and equality on one station fail. | BR-04/05; SC-02/03 |
| INT-04 | Alibi | Retry identical operation key/body: same ID and one record; changed body conflicts. After cancellation, replay old key returns original cancelled record; a new logical creation uses a new key. | BR-06; I4 |
| INT-05 | Alibi/Nurali | List/view own history; change visitor ID, detail ID and filters to another owner: no disclosure. Cancelled history remains linked to original station. | BR-07; RBAC-04; SC-04 |
| INT-06 | Alibi | Cancel before start, repeat cancellation and test exact start/after start. Only permitted cancellation changes status, preserves history and releases its own occupancy; maintenance remains effective. | BR-08; I6; SC-05 |
| INT-07 | Alibi/Mansur | Drop response after commit; refresh own list/reconcile and retry same key: original ID, no duplicate. Drop before submission: no success. Missing operation result alone does not prove an in-flight request failed. | BR-11; SC-03; shared states |
| INT-08 | Alibi/Mansur | Another client takes a displayed slot; first gets conflict and refreshed choices. Expire session before confirmation: no commit; sign-in requires revalidation. Alternatives are not represented as reserved. | BR-12/16; SC-02/03 |
| INT-09 | Alibi | F-TIME: offset/UTC/club-zone round trips, overnight hours, exact schedule boundaries and server start-time boundary. Reject unresolved invalid local times; show consistent zone labels. | BR-02/14; SC-02–06 |
| INT-10 | Nurali | Validate club creation, active state, minimum duration, assignments and duplicate pairs; create/edit station labels/types. Duplicate label within one club fails, same label across clubs succeeds; resources cannot be reparented. | ADM-01/02/03; SC-08/14 |
| INT-11 | Nurali/Alibi | Change hours, dated exceptions, maintenance, club/station activation and zone around future/in-progress bookings. Conflicting whole mutation fails with no silent move/cancel/delete. Safe block removal preserves other restrictions/history. Increased minimum affects new requests only. | BR-09/10; ADM-04/05/06/08; SC-08–10 |
| INT-12 | Nurali/Mansur | Admin pre-start cancellation needs assignment/reason and is replay-safe; at/after start reject. Validate draft/event publication/cancellation: guests see published/cancelled records, never drafts; events never change station occupancy. | ADM-09/10/11; SC-05/06/11/13 |

## 5. Concurrency protocol and cases

Owner: Alibi, with Nurali reviewing administrative/assignment races. Use real PostgreSQL and independent API requests, connections and workers. A synchronisation barrier releases contenders together; record actual arrival/start/commit times. Instrument lock acquisition or a test-only barrier when necessary to prove the intended overlap. Exercise both orderings in two-writer races through controlled scheduling, as well as free races. A sequentially processed run is not concurrency evidence.

Run **100 fresh repetitions of each named race variant**, as required by NFR-01; record winner/order and query committed DB state after every repetition. CON-01 has three separate variants, each with 100 runs. Restore fixtures/keys between repetitions. Infrastructure failures are recorded separately and replaced with valid repetitions; they do not count as passes and a persistently unstable environment makes the suite inconclusive.

| Test ID | Concurrent stimulus and expected committed outcome | Trace |
| --- | --- | --- |
| CON-01 | 20 different visitors, distinct operation keys, one free station: identical [14:00,15:00); partial-overlap starts 14:00 through 14:19 with 60-minute duration; containment uses ten [13:00,16:00) and ten [14:00,15:00) requests. All contenders in each variant mutually overlap. Exactly one creation succeeds per valid repetition; all others receive domain conflicts; no overlapping confirmed rows. | BR-04/05; NFR-01; I1 |
| CON-02 | Two same-owner requests with same key/body: same booking ID, exactly one row. Same key with different bodies: at most one logical payload accepted, other conflicts. Repeat for replay after a dropped response. | BR-06/11; I4 |
| CON-03 | Booking vs overlapping maintenance creation/update: one wins, other observes conflict; never committed booking plus conflicting block. | BR-09; ADM-06/08; I2 |
| CON-04 | Booking vs club closure, schedule shrink and station deactivation: each is a separate 100-run variant. Booking first means unsafe change fails; change first means invalid booking fails. No partial multi-station update. | BR-10; ADM-04/05/08; I3 |
| CON-05 | Cancel existing booking vs create in its interval: create may fail if ordered before cancellation, or succeed after it. Cancellation preserves old history. After cancellation returns, a fresh valid operation can book unless another restriction applies. Race new booking and block removal separately: no restriction is bypassed. | BR-08/09; NFR-01; I6 |
| CON-06 | Revoke assignment vs protected admin write: write either commits before revocation or fails after revocation. Every request begun after revocation commit is denied. Test stale sessions and direct resource requests. | RBAC-05; ADM-02; architecture authorisation guard |
| CON-07 | Two admin changes based on one resource version: one succeeds, the stale one gets 409 and cannot overwrite it; cancellation retries remain harmless. | ADM-14; transaction/version contract |

After each run independently inspect: no overlapping CONFIRMED intervals per station; no confirmed/maintenance overlap; valid schedule/state at the transaction's effective time; one mapping/booking per logical operation; unchanged rejected resources and preserved histories; authorised actor/scope; durable audit of success. Compare historical validity with the effective revision at commit, not a later configuration.

**Baseline:** run the same fixtures and logical requests sequentially under the same production protocol. It must already satisfy invariants; concurrency must not introduce violations. Do not benchmark against an intentionally unsafe implementation or claim that a finite suite proves absence of all races. Failure count threshold is zero; one integrity/access violation fails the affected Must suite.

## 6. Permissions and data handling

Owner: Nurali. For every protected operation in the role matrix run an allowed control, then guest, visitor, assigned/unassigned/revoked admin and unassigned superadministrator variants where applicable. Test direct HTTP requests and browser navigation; hidden buttons alone are not enforcement. Record the complete actor x operation x resource-scope matrix, not just one representative endpoint.

| Test ID | Procedure and expected outcome | Trace |
| --- | --- | --- |
| SEC-01 | Guest protected request 401; visitor admin route 403; forged role/owner ignored. Own-record ID/filter substitution gives 404 without foreign details. | RBAC-01/04; BR-07/08; NFR-02 |
| SEC-02 | Admin C-A changes path/body/nested station, booking, event, block, list/report scope to C-B: denied without disclosure. Mixed-club aggregate scope is rejected; counts, audit reads and any implemented export obey scope. | RBAC-02/03/06; ADM-07; NFR-02 |
| SEC-03 | Admin cannot grant privileges or edit system club identity/zone. Superadministrator without assignment manages clubs/assignments but cannot read operational reports; explicit assignment enables only its club. Revocation removes it. | RBAC-05/06/07; ADM-01/02 |
| SEC-04 | Inspect successful/error response bodies, report output and scoped audit entries: only specified service fields; no unrelated visitor profile, credentials or tokens. Audit includes actor/action/resource/club/time/result/reason/correlation ID. | RBAC-08/09; BR-15; ADM-13 |
| SEC-05 | In controlled deployment confirm HTTPS, secret exclusion from repository/config examples and credential-free logs/errors. Authentication-specific checks are added after mechanism is agreed; unresolved auth blocks full security acceptance. | NFR-09 |

**Baseline/oracle:** the allowed/denied cells in ECR-8, plus successful same-club/own-record controls. Threshold: every expected denial and allow outcome matches, zero unauthorised reads/writes and zero credential disclosure. A universally broken API that denies everything fails its positive controls.

## 7. Report verification with independent expected values

Owner: Nurali; Alibi reviews fixture/history design. Use one committed snapshot T, display club/zone/[from,to), T, generation time and definition version. Hand-calculate the fixture first and store expected values without importing production report functions. Baseline is this independent arithmetic, not the implementation's previous output.

Capacity A is open active station-minutes minus the union of effective maintenance; bookings are not removed from capacity. Occupied O is CONFIRMED scheduled time clipped to period/capacity. Free=A-O; utilisation=100*O/A, otherwise N/A when A=0. Count distinct CONFIRMED/CANCELLED IDs whose original visit intervals overlap the period; cancellation share is cancelled/total, otherwise N/A. Aggregate exact durations before two-decimal half-up formatting; club utilisation uses total O/A. Missing history or invalid occupancy must not be disguised as a valid zero/percentage.

| Test ID | Controlled fixture and expected result | Trace |
| --- | --- | --- |
| REP-01 | P 10:00–12:00; two active/open stations; S1 maintenance 10:00–10:30 and confirmed 10:30–11:30; S2 confirmed 11:00–12:00 and cancelled 10:00–11:00. A=210, O=120, free=90 min; utilisation=57.14%; confirmed=2, cancelled=1, total=3, cancellation share=33.33%. | ADM-12; NFR-10; SC-12 |
| REP-02 | One station open 10:00–14:00; booking 10:30–11:30; P 11:00–12:00. A=60, O=30, free=30; utilisation=50.00%, confirmed=1. | Period clipping/counts |
| REP-03 | P 10:00–12:00; one open station, blocks 10:00–10:45 and 10:30–11:00; no bookings. Maintenance union=60, A=60, O=0, free=60; utilisation=0.00%; counts=0; cancellation share=N/A. | Union denominator; empty data |
| REP-04 | All stations closed/inactive/blocked during P. A=O=free=0; utilisation=N/A with no-capacity explanation. Calculation failure is a separate error. | Zero denominator |
| REP-05 | P 10:00–11:00: cancelled visits ending exactly at 10:00 or starting exactly at 11:00 do not count. A booking with positive overlap counts once regardless of creation/cancellation timestamp. | Half-open boundaries; visit-period counts |
| REP-06 | Historical P had 120 active/open minutes; later deactivate station, change future hours or remove a future block. Historical A stays 120 under retained effective history. Missing required revision returns insufficient historical data. | Historical capacity |
| REP-07 | Isolated corrupt fixture: overlapping confirmed bookings or booking intersecting maintenance/out-of-hours. Raise data-integrity error and withhold valid utilisation/free result. | Invalid-data detection |
| REP-08 | Station S1 A=30/O=30; S2 A=90/O=0. Club A=120/O=30, utilisation=25.00%, not the unweighted 50%. Repeat disjoint periods: durations add under the same snapshot; spanning distinct counts are not blindly summed. | Aggregation/rounding |
| REP-09 | Report spans a controlled reservation cancellation. Snapshot before cancellation gives REP-01; new snapshot after cancelling S1 booking gives A=210/O=60/free=150, utilisation=28.57%, confirmed=1/cancelled=2/share=66.67%. Each report must match one whole snapshot, never mixed-query values. | Consistent snapshot; restatement |
| REP-10 | Convert a one-hour UTC interval to each fixture's club zone; elapsed duration remains 60 min. Inclusive date range ends at next local midnight; test an offset-transition day using pinned zone data and explicit offsets. End <= start or unresolved local ambiguity is rejected. | BR-14; ADM-12; club-local boundaries |

Threshold: exact ID counts and exact expected interval/duration values before formatting; exact displayed two-decimal strings/N/A/error outcomes. Do not loosen tolerance to hide a wrong denominator. No financial revenue or actual-attendance inference is evaluated because those inputs are outside scope.

## 8. UX, responsiveness and formative comparison

Owner: Mansur, with Nurali on admin/report tasks. In October a walkthrough can inspect prototype coverage; record its findings separately as design-review observations. A static mockup cannot establish server enforcement, real persistence, end-to-end performance or successful production booking. Application UX acceptance is executed later on a runnable integrated build.

| Test ID | Procedure and expected outcome | Trace |
| --- | --- | --- |
| UX-01 | Walk SC-01–06: catalogue/filter, interval/station, confirmation/conflict, own history/cancellation and public calendar. Verify club/zone and selected context persist. Optional adjacent-seat mockup does not imply an implemented multi-seat feature. | BR-01/03/07/08/14/16; SC-01–06 |
| UX-02 | Inject loading, empty, invalid, expired session, forbidden, conflict, stale version, server failure, offline-before-send and unknown-after-send states. Distinct textual message, safe next action, retained valid input; never false success/empty-data substitution. | BR-11/12/13; ADM-14; common states |
| UX-03 | Execute core visitor/admin flows at all E-UI viewports and browser combinations. No page-level horizontal overflow, clipped critical control, overlapping unreadable text or inaccessible modal action. Tables may scroll inside a labelled contained area. | NFR-06; SC-01–14 |
| UX-04 | Keyboard-only catalogue/book/cancel and admin block/report flow: meaningful labels, visible focus, logical order, reachable actions, no keyboard trap. Statuses convey text as well as colour. Automated accessibility checks supplement manual checks; no WCAG certification claim. | NFR-06; BR-13 |
| UX-05 | Formative visitor study using the paired baseline protocol below: find a specified free station, create one reservation and cancel it. Score final state independently. Goal at least 80% unassisted completion per task. | NFR-07; SC-01–05 |
| UX-06 | Assigned admin selects correct club, reviews bookings, attempts conflicting block, then requests report. Out-of-scope controls/data are absent, conflict preserves booking, period/denominator/N/A are understandable. If ADM-15 preview exists, verify its summary and later conflict handling. | ADM-07/12/15; SC-07/10/11/12 |

### Controlled manual-workflow baseline

Recruit at least five relevant visitors outside the development team; record sample size and experience, obtain consent for anonymised timing/error notes, and allow withdrawal. Add two representative club staff/admin participants if available for a separate formative UX-06 round; if unavailable, label team admin walkthrough as expert inspection, not a user study.

Compare the runnable CyberSeat workflow with a **simulated manual booking workflow**: participant requests station/time from a moderator acting as club operator; the operator checks an equivalent reservation spreadsheet and records/cancels the booking. Use synthetic data and an in-session conversation; do not send real messages or make real club reservations. This is a reproducible comparison condition, not a measured description of a particular real club.

Use matched but different task data for two conditions, same devices, identical club hours/availability/conflicts and a frozen moderator script. Counterbalance order: for five visitors, three manual-first and two CyberSeat-first; alternate for further participants. Give equal short neutral introductions and one practice task outside scoring. Reset data between conditions; keep moderator workload and response script fixed, record actual response delays. Do not remove manual operator waiting time from the end-to-end measure; log it separately so its effect is visible.

For each task start timer when instruction is shown; stop at independently verified intended final state. Task cap is 180 seconds, proposed for this study. Timeout, incorrect state or facilitator intervention means not unassisted success; record failure/censoring, not an invented completion time. Offer assistance only after scoring the task. For create, verify one correct reservation; for cancellation, verify retained CANCELLED history and released occupancy in the system, and equivalent retained cancelled row in the manual baseline.

Record per participant/condition/task: success, assistance, completion time, errors, wrong station/time choices and duplicate/conflicting entries. Report per-task counts, paired outcomes and individual times, not only a pooled percentage. Compute time reduction only for paired successful attempts: 100*(manual_time-system_time)/manual_time; report median individual reduction and how many pairs qualify. Report failures separately to avoid survivorship bias. With five people the 80% target means at least 4/5 unassisted successes on each task. Samples are formative and cannot establish population-wide productivity gains.

## 9. Metrics, thresholds and comparison conditions

Existing NFR-04/07 targets are retained. Additional usability-time targets below are explicit proposed evaluation goals, not user-derived or already approved numerical findings. Changes require a versioned rationale before execution, never after seeing results.

| Metric | Conditions, data and measurement | Planned threshold | Baseline/comparison |
| --- | --- | --- | --- |
| Functional correctness | All Must INT/SEC/REP/OPS cases and mandatory browser flows on reset fixtures; assert responses and durable state. | 100% defined Must cases pass; zero critical/high defects; blocked/not-run does not pass. | Requirement outcomes and positive/negative fixture controls. |
| Concurrency integrity | CON suite, independent workers and synchronised starts, 100 valid runs per named variant. Count DB invariant violations per run. | Zero violations; CON-01 exactly one successful creation in every valid run. | Same requests sequentially under the same safe implementation; zero violations there too. |
| Access control | Full F-AUTH operation/scope matrix through direct API and UI; verify no unauthorised data or mutation. | All expected allow/deny outcomes match; zero unauthorised operations. | ECR-8 matrix, with permitted own/assigned-club controls. |
| Report correctness | F-REPORT at fixed snapshot; compare independent arithmetic, counts and formatted values. | Exact expected counts/durations and displayed values/errors/N/A. | Hand-calculated REP fixtures, not production-code reuse. |
| API latency | E-LOAD/F-LOAD; k6 50 VUs, 80% availability/10% create/10% cancel, 2-min warmup excluded + 10-min measured run; three independent restored runs. Measure client HTTP elapsed time by operation, including lock/retry waits. Use nearest-rank p95 on successful responses; classify conflict/error latency separately. | In every run p95 availability <=500 ms; create/cancel <=1000 ms. At least 100 successful samples per operation per measured run, otherwise inconclusive. | Three additional 1-VU baseline runs with same data/mix/durations and fixed environment. Report absolute and relative latency; baseline does not replace absolute thresholds. |
| Reliability and contention | Same measured workload: unexpected 5xx / all completed requests; report transport failures separately and include them in overall failure rate. Count bounded retries and timeouts; record achieved request/s and operation mix. | Unexpected 5xx <1% in each run; no integrity loss. Zero successful response for a rolled-back operation; configured lock timeout 2 s, at most 3 full-transaction retries after initial attempt. | 1-VU run and explicit injected-fault checks; expected business 409 conflicts are reported separately, not unexpected failures. No invented throughput threshold. |
| Viewport/keyboard usability | E-UI browser/viewport matrix, core flows and defined UI states. | Zero blocking layout/keyboard defects; all required textual status/error states visible and actionable. | Same task outcomes in desktop 1440x900; mobile must retain required functions. |
| Visitor task success | Paired study, >=5 visitors, three tasks, 180 s cap, independent final-state scoring. | NFR-07 Should goal >=80% unassisted for each task; show numerator/denominator and failures. | Matched simulated manual workflow under counterbalanced order. |
| Visitor task time and errors | Same paired study; task/participant times and wrong/duplicate/conflicting entries. | Proposed Should improvement goal: median paired time reduction >=20% per task with at least 4 valid paired successes; otherwise descriptive/inconclusive. Proposed guardrail: no more duplicate/conflicting reservations than manual condition. | Manual workflow times/errors. No benefit claim if baseline unavailable, failed or incomparable. |
| Persistence/reproducibility | Commit/restart/rollback fixtures and independent clean setup. | All expected IDs/statuses/mappings survive restart; no pre-commit residue; teammate reproduces migrations/seed without hidden manual changes. | Pre-restart snapshots and documented fresh-install inputs. |

Keep all three load-run summaries and raw samples; do not choose the best run. Use the same fixed bounded pacing/think-time configuration in target and single-VU baseline and record it with the load script. Prepare enough nonoverlapping slots and owned cancellable records to exercise valid create/cancel paths; report achieved operation mix rather than assuming configured weights were achieved. A timeout/failure is not silently omitted from reliability reporting, even though success-only latency is a separate distribution.

## 10. Operational/failure checks

| Test ID | Owner | Procedure and expected outcome | Trace |
| --- | --- | --- | --- |
| OPS-01 | Nurali | Verify creation/cancellation/admin success audit is durable with mutation. Force rollback: neither success mapping nor partial business/audit success remains. Rejected conflicts/access failures retain safe correlated operational evidence. | BR-15; ADM-13; RBAC-09 |
| OPS-02 | Alibi | Commit booking, restart API, reconcile same key/read history: same ID/status. Inject failure before commit: no booking or success mapping; lost committed response resolves original result. | NFR-03; BR-06/11 |
| OPS-03 | Alibi | Another teammate installs pinned dependencies, applies migrations and loads versioned synthetic seed in fresh environment using recorded commands; no undocumented schema edits. | NFR-08 |
| OPS-04 | Alibi/Nurali | Isolated fault harness induces lock wait/deadlock/serialization failure and exhaustion. Check 2 s lock-timeout configuration, whole-transaction retries <=3, safe rollback and explicit retryable failure; known 409 business conflict is not retried as infrastructure failure. This bound is not a promise of <=2 s total request time across retries. | NFR-05; architecture protocol |

## 11. Requirement-to-check coverage

This is planned traceability, not a pass report. Case IDs refer to the procedures above; every source Must requirement has a planned check. PERF-01 is the three-run load protocol in section 9. Optional/deferred cases must be labelled rather than silently removed.

| Source requirement | Planned checks |
| --- | --- |
| BR-01, BR-02 | INT-01, INT-09, UX-01 |
| BR-03 | INT-02, UX-01 |
| BR-04, BR-05 | INT-03, CON-01 |
| BR-06 | INT-04, CON-02, OPS-02 |
| BR-07 | INT-05, SEC-01/02 |
| BR-08 | INT-06, CON-05, SEC-01 |
| BR-09, BR-10 | INT-11, CON-03/04/05 |
| BR-11, BR-12 | INT-07/08, CON-02, UX-02, OPS-02 |
| BR-13 | UX-02/03/04 |
| BR-14 | INT-09, REP-10, UX-01 |
| BR-15 | OPS-01, SEC-04 |
| BR-16 (Should) | INT-08, UX-01/02 |
| RBAC-01, RBAC-04 | SEC-01, INT-05/06 |
| RBAC-02, RBAC-03 | SEC-02, INT-10/11/12, REP-01–10 with foreign-club variants |
| RBAC-05 | SEC-03, CON-06 |
| RBAC-06, RBAC-07 | SEC-02/03 |
| RBAC-08, RBAC-09 | SEC-04, OPS-01 |
| ADM-01, ADM-02, ADM-03 | INT-10, SEC-02/03, CON-06 |
| ADM-04, ADM-05, ADM-06, ADM-08 | INT-11, CON-03/04/05 |
| ADM-07 | INT-05, SEC-02, UX-06 |
| ADM-09, ADM-10, ADM-11 | INT-12, SEC-02, UX-01/06 |
| ADM-12 | REP-01–10, SEC-02, UX-06 |
| ADM-13 | OPS-01, SEC-04 |
| ADM-14 | CON-07, INT-07, UX-02 |
| ADM-15 (Should) | UX-06 if preview is implemented; otherwise record deferral |
| NFR-01 | CON-01–07; DB invariant oracles |
| NFR-02 | SEC-01–04, INT-05, CON-06 |
| NFR-03 | OPS-01/02 |
| NFR-04 | PERF-01, section 9 conditions and thresholds |
| NFR-05 | OPS-04, PERF-01 contention/failure counters |
| NFR-06 | UX-01–04/06, E-UI matrix |
| NFR-07 (Should) | UX-05; counterbalanced manual baseline |
| NFR-08 | OPS-03 |
| NFR-09 | SEC-05, SEC-01/04 |
| NFR-10 | REP-01–10 |
| SC-01–06 | INT-01–09, INT-12, UX-01/02/05 |
| SC-07–14 | INT-10–12, SEC-01–04, REP-01–10, UX-06 |

## 12. Execution gates, evidence and evaluation limits

**October plan acceptance:** inputs/owners exist, cases have expected outcomes, metrics have conditions/data/threshold/baseline, traceability is complete and no executed-results claim is made. A named teammate must review the new plan against its commit; record actual agreement source (PR review or reported team agreement), without impersonating another reviewer.

**Future execution entry:** integrated build available; schema/auth/API contracts agreed; shared booking/admin protocol implemented; migrations and deterministic seed verified; dependency/browser/time-zone versions and test commands pinned; measurement environment and manual baseline prepared. Until these exist, corresponding tests remain NOT RUN or BLOCKED, never PASS. Prototype-only inspection is labelled separately.

**Execution order:** clean setup and smoke checks -> integration/report/access checks -> controlled races/faults -> load -> browser/responsive checks -> formative paired user evaluation. Stop affected testing on data loss/access leakage, retain evidence, fix and rerun affected cases plus dependent regression checks.

**Future exit:** every defined Must case passes under recorded conditions; zero unresolved critical/high defects; mandatory latency/reliability/integrity thresholds met in all valid runs. Record all Should failures/deferments separately. Critical = unauthorised access, data loss or double booking; High = core booking/cancellation/report flow unusable or materially wrong; lower-severity cosmetic issues require an owner and disposition. Failed or missing evidence cannot be converted to PASS by merging this document.

For each future run retain: run ID/date, commit/requirements SHA, dataset seed/revision, environment manifest, commands, case IDs, expected and actual outcomes, status (NOT RUN/BLOCKED/PASS/FAIL), defect links, request/operation IDs, sanitised traces and DB assertions. Load evidence includes raw per-request samples, percentiles by operation, rates, errors/conflicts, retries/timeouts and all three run summaries. UX evidence uses anonymised participant IDs, condition/order, task scripts, assistance, timing, failures and qualitative notes. No credentials or unnecessary personal data enter artifacts.

Evidence locations will be docs/testing/results/<run-id>/ with a run manifest and machine-readable results plus a readable summary; these paths are planned, not files claimed to exist. Summarise planned vs executed vs passed vs failed vs blocked counts with explicit denominators. Keep design-review observations apart from application test results.

Limitations to report: convenience sample and learning effects; simulated rather than observed real-club baseline; hardware/network dependence of latency; finite race repetitions; mockup limitations; absent attendance/financial data. Compare only runs with matching conditions or explain the change. Quantified efficiency claims require the actual baseline and corresponding raw results.

## 13. Task completion evidence

- [x] Plan defines integration/concurrency work for Alibi, permission/report checks for Nurali and UX/responsiveness work for Mansur.
- [x] Metrics specify conditions, synthetic data, thresholds and explicit baselines.
- [x] Requirement IDs map to planned checks, using requirements, architecture and UX inputs.
- [x] Plan clearly distinguishes expected values and future execution from actual results.
- [ ] Record the actual reviewing participant, plan commit and outcome; resolve blocking comments.
- [ ] Attach this file, commit and Pull Request links to ECR-13.
- [ ] Confirm all task criteria and only then change the task to Done.

Existing approval of ECR-8 is not approval of ECR-13. No final tests, measured improvement or new reviewer approval are asserted by this plan.
