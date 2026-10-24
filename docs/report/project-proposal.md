# CyberSeat - Project Proposal and Scope

Version 1.1 | October 23, 2026 | Owner: Aibekuly Alibi | [ECR-2](https://nerybr.youtrack.cloud/issue/ECR-2)

Status: documentation completed; team agreement confirmed by Alibi on October 23, 2026. This is a design-stage proposal, not evidence of an implemented or evaluated product.

## 1. Project identity

**Title:** Information System for Managing Gaming Station Reservations in Esports Centres.

**Programme and group:** Software Engineering, Astana IT University, SE-2404. **Supervisor:** Myrzakerimova Alua. The names and responsibilities below follow the current repository README.

| Participant | Diploma responsibility | Initial-evaluation contribution |
|---|---|---|
| Aibekuly Alibi | Shared database and reservation module | Proposal, literature review, technology comparison, booking and non-functional requirements, system context and component diagrams |
| Mansur Urynbassar | Visitor and administrator interfaces | User evidence, existing-system comparison, scenarios, UX mockups and use-case diagram |
| Akhmetov Nurali | Administrative server functionality | Administrative requirements, access matrix, evaluation plan, risks and supervisor-feedback record |

## 2. Problem and evidence boundary

The working problem hypothesis is that separate telephone, messaging and spreadsheet records make it difficult to give visitors consistent station availability and administrators a consolidated schedule. Two users may both see a station as available before either reservation is saved. Independent administrative changes can also invalidate a reservation if schedule and maintenance rules are checked inconsistently.

The [ECR-3 evidence record](../research/user-needs-evidence.md) now documents three anonymised visitor discussions supplied by its owner. They support the exploratory visitor-need findings; they do not establish a representative market estimate, administrator validation, client endorsement or measured reduction in manual work. The [ECR-5 system comparison](../research/existing-systems-comparison.md) provides the product comparison. Literature supports the concurrency problem and design methods; local visitor evidence comes from ECR-3. The records retain their provenance and validation limits.

**Target users:** guests comparing clubs; registered visitors reserving PC or console stations; administrators operating assigned clubs; a system administrator maintaining clubs and administrator assignments. A multi-club manager can be represented through assignments to several clubs, without an unrestricted extra role.

## 3. Aim, research questions and objectives

**Aim:** design, implement and evaluate a web information system that combines gaming-station discovery, interval reservations and club administration while preserving reservation consistency and role-based access boundaries.

**RQ1:** Can the proposed transaction protocol preserve non-overlapping active reservations and maintenance intervals under concurrent operations and retries? **RQ2:** Can target users complete discovery, reservation and cancellation tasks through the proposed interface? **RQ3:** Does a shared schedule provide administrators with correct, reproducible utilisation information?

| Objective | Deliverable | Planned evidence of achievement |
|---|---|---|
| O1 Identify users, needs and scope | Evidence record and bounded proposal | Trace each claimed need to a real interview/client record or label it an assumption |
| O2 Examine research and alternatives | Critical review, product comparison, technology decisions | Cited sources, limitations and explicit requirement implications |
| O3 Specify verifiable behaviour | Requirements, access matrix and scenarios | IDs, priorities, acceptance criteria and cross-document traceability |
| O4 Design interactions and architecture | UX mockups, context, components and use cases | Consistency check against scenarios, data ownership and failure flows |
| O5 Build the core workflow after initial evaluation | Web client, API, relational schema and migrations | Demonstration of discovery, creation, viewing and cancellation |
| O6 Evaluate correctness and usability | Reproducible tests and participant task observations | Invariant checks, access tests, load conditions and task results; no invented outcomes |

## 4. Included and excluded scope

| Included | Boundary |
|---|---|
| Club and station catalogue | PC and console specifications, club address, working hours, filters and station layout |
| Availability search | One station and a finite visit interval; club-local display; server decides at commit |
| Personal reservations | Authenticated creation, own-record viewing, cancellation before start and retained history |
| Club administration | Assigned-club stations, schedules, maintenance intervals, reservations, events and reports |
| Role-based access | Guest, visitor, club administrator and system administrator; enforced by the server |
| Event calendar | Informational published events; browsing does not create a reservation or tournament entry |
| Reporting | Defined utilisation measures from controlled booking and schedule data; no financial settlement |

**Excluded:** online payments, loyalty programmes, hardware/device control, native mobile applications, automatic tournament registration and paid ticketing. External tournament feeds, email/SMS and social login are not required dependencies. Administrators can enter event information manually with its source and publication status. Group booking across multiple stations is deferred; the core transaction reserves one station.

## 5. Proposed solution and critical constraints

A React/TypeScript web client communicates with a FastAPI REST API. The API is a modular monolith with access, catalogue, reservation, administration, events and reporting boundaries backed by PostgreSQL. These are proposed choices, justified in the [technology comparison](../research/technology-comparison.md), not installed or benchmarked services.

The central invariant is that confirmed reservations for the same station never overlap. A reservation must also respect working hours and maintenance. Checking the browser display alone cannot preserve this invariant. Creation, cancellation, maintenance and schedule changes must share a database transaction protocol. Repeated submission of one logical creation operation must not create another booking. An unknown network outcome must remain unknown until reconciled.

The design uses half-open intervals `[start, end)`, explicit club time zones and UTC instants in storage. A booking ending at 15:00 may be followed by one starting at 15:00. A detailed schema is deferred to ECR-12; these semantics are already required for the October design.

## 6. Delivery stages and evaluation

| Stage | Exit condition |
|---|---|
| Initial submission, October 24, 2026 before 18:00 according to the university's stated time | Analysis, cited research, requirements, diagrams, UX and evaluation plan assembled; outstanding evidence/review clearly identified |
| Foundation | Schema, migrations, authentication and catalogue can be demonstrated on synthetic data |
| Core MVP | Reservation creation, own history, cancellation, maintenance coordination and assigned-club access pass integration tests |
| Diploma extension | Event calendar, station layout, defined reports and audit trail are integrated |
| Final evaluation | Reproducible correctness and load results, usability observations, limitations and demonstration are reported |

No final experiment results are required or claimed at the initial submission. Planned correctness checks include simultaneous conflicting requests, adjacent intervals, retries, cancellation races, maintenance races and cross-club access attempts. Performance targets and workload conditions are specified in [ECR-7 requirements](../requirements/booking-and-nfr.md); Nurali's ECR-13 plan should adopt or explicitly revise them. Usability assessment should combine task success, time, observed errors and a validated questionnaire, rather than treating a questionnaire score as proof of all quality attributes.

## 7. Assumptions, dependencies and review

The project depends on access to target users for ECR-3, team agreement on administrative rules in ECR-8, a hosting environment for the eventual prototype and supervisor review recorded in ECR-16. The main technical risks are interval races, inconsistent authorisation and scope growth; mitigations are shared transactional writes, negative access tests and the exclusions above. Real personal data is unnecessary for the October package.

This proposal aligns with the current README and approved ECR-1 scenarios. Reviewer requested: Mansur for user flow/event scope and Nurali for administrative scope and evaluation alignment. Alibi subsequently confirmed his teammates' agreement in the working chat on October 23, 2026. Supervisor approval is not implied.

## Related deliverables

- [Critical literature review and source matrix](../research/literature-review.md)
- [Technology alternatives and decisions](../research/technology-comparison.md)
- [Booking and non-functional specification](../requirements/booking-and-nfr.md)
- [Architecture, diagrams and transaction protocol](../diagrams/architecture.md)
- [User and administrator scenarios](../requirements/user-scenarios.md)
