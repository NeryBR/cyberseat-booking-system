# CyberSeat User Needs and Relevance Evidence

Version 1.0 · October 23, 2026 · [ECR-3](https://nerybr.youtrack.cloud/issue/ECR-3)

Document owner: Mansur Urynbassar  
Status: Three anonymised user discussions completed and synthesised

## Purpose

This document records evidence used to assess the relevance of CyberSeat and to inform its requirements. It distinguishes findings supported by discussions with representatives of the intended user group from assumptions that still require validation. It does not claim that the proposed system has already been implemented or evaluated.

## Method

Three semi-structured asynchronous text discussions were conducted on October 23, 2026, with people who have direct experience visiting gaming clubs. All participants gave permission for their responses to be used anonymously in the diploma project. No names, contact details, account identifiers, or other unnecessary personal data were retained.

The same eleven core questions were used in each discussion. They covered current availability checking and reservation practices, recurring problems, information needed before confirmation, conflict and cancellation handling, the value of an event calendar, mobile access, and factors affecting trust.

The sample is exploratory and is not statistically representative. It provides initial evidence from visitors, while administrative workflows and reporting needs still require validation with a club administrator or manager.

## Participant Overview

| ID | User role | Relevant experience | Date | Method | Consent |
|---|---|---|---|---|---|
| R1 | Regular gaming-club visitor | Regular CS2 player who visits clubs with friends and uses higher-performance club equipment | October 23, 2026 | Asynchronous text discussion | Anonymous use approved |
| R2 | Occasional gaming-club visitor | Visits clubs with friends to play CS2, Dota 2, and Valorant | October 23, 2026 | Asynchronous text discussion | Anonymous use approved |
| R3 | Regular gaming-club visitor | Competitive CS2 player who prioritises powerful PCs and high-refresh-rate monitors | October 23, 2026 | Asynchronous text discussion | Anonymous use approved |

## Discussion Questions

1. What is your role or experience with gaming clubs?
2. How do you currently check whether a suitable station is available?
3. How do you currently make or receive reservations?
4. What problems occur most often?
5. What information should be visible before confirming a reservation?
6. What should happen if the selected station becomes unavailable?
7. How should reservation cancellation work?
8. Would an event or tournament calendar be useful? Why?
9. What information must be convenient to view on a phone?
10. What would make you trust or distrust such a system?
11. May the answers be used as anonymous research notes for the diploma project?

## Discussion Records

### R1 Regular Gaming-Club Visitor

**Role and experience.** R1 regularly plays CS2 and sometimes visits gaming clubs with friends to use better equipment.

**Current process.** Availability is normally checked through WhatsApp, Instagram, or an in-person request to the administrator. Reservations are made by message or telephone call, specifying the number of PCs and the desired time.

**Problems observed.** Higher-performance PCs may already be occupied, group members may be unable to obtain adjacent stations, and the administrator may take time to respond.

**Information required before confirmation.** R1 expects to see PC specifications, monitor refresh rate, hourly price, available intervals, station location, and whether stations are adjacent.

**Conflict and cancellation expectations.** If a station becomes unavailable, the system should notify the visitor immediately and offer a station with similar specifications or another time. Cancellation should be available in the application, with rules and any applicable refund conditions explained before booking.

**Events and mobile access.** R1 considers a calendar useful for discovering CS2 tournaments, checking dates, and potentially registering for events. On mobile devices, R1 expects availability, price, specifications, reservation time and status, and cancellation options.

**Trust factors.** Real-time availability, transparent prices, and reliable confirmation would increase trust. Incorrect availability and unexpected cancellation would reduce trust.

**Consent.** R1 approved anonymous use of the responses.

### R2 Occasional Group Visitor

**Role and experience.** R2 occasionally visits gaming clubs with friends to play CS2, Dota 2, and Valorant.

**Current process.** Availability is checked through friends or WhatsApp. One person normally calls the club and books stations for the entire group.

**Problems observed.** The club may not have enough free PCs for the group, or the available stations may be far apart.

**Information required before confirmation.** R2 expects to see the number of available PCs, hourly prices, PC specifications, and whether stations are adjacent.

**Conflict and cancellation expectations.** If a selected station becomes unavailable, the system should offer another station or allow the reservation time to be changed. Visitors should be able to cancel through the application without calling the administrator.

**Events and mobile access.** R2 considers a local tournament calendar useful for group participation. On mobile devices, R2 expects availability, prices, booking confirmation, and reservation history.

**Trust factors.** Accurate reservations and ease of use would increase trust. Incorrect information would reduce trust.

**Consent.** R2 approved anonymous use of the responses.

### R3 Competitive Gaming-Club Visitor

**Role and experience.** R3 regularly plays competitive games, particularly CS2, and prefers clubs with powerful PCs and high-refresh-rate monitors.

**Current process.** Availability is checked by contacting the administrator or reviewing the club's social-media pages. A specific station is reserved by message for a defined number of hours.

**Problems observed.** A preferred PC may already be occupied, and current availability cannot be checked without contacting the club.

**Information required before confirmation.** R3 expects to see GPU, CPU, monitor refresh rate, peripherals, hourly price, and exact availability.

**Conflict and cancellation expectations.** If a station becomes unavailable, the system should notify the visitor and offer another PC with similar performance. Cancellation should use a simple action with clearly stated rules and deadlines.

**Events and mobile access.** R3 considers a tournament calendar useful for following upcoming CS2 events and planning practice sessions. On mobile devices, R3 expects specifications, available intervals, prices, and upcoming reservations.

**Trust factors.** Accurate specifications, reliable reservations, transparent pricing, and prompt notifications would increase trust.

**Consent.** R3 approved anonymous use of the responses and explicitly requested that no name be disclosed.

## Evidence Synthesis

| ID | Finding | Evidence | Project implication | Status |
|---|---|---|---|---|
| F1 | Visitors currently depend on messaging, calls, social media, or in-person requests to check availability and reserve stations. | R1, R2, R3 | Provide self-service availability search and reservation. | Validated across all three discussions |
| F2 | Visitors cannot reliably inspect current station availability without contacting club staff. | R1, R3; indirectly supported by R2 | Display current availability and revalidate it on the server before confirmation. | Validated |
| F3 | Groups need enough available stations and prefer adjacent seating. | R1, R2 | Represent station location or adjacency and support group-oriented selection in later design work. | Validated by two discussions |
| F4 | Equipment specifications influence station choice. | R1, R2, R3 | Display CPU, GPU, monitor refresh rate, peripherals, and other relevant station attributes. | Validated across all three discussions |
| F5 | Price and exact available intervals are required before confirmation. | R1, R2, R3 | Show transparent hourly prices, time zone, and available intervals before confirmation. | Validated across all three discussions |
| F6 | When availability changes, visitors expect prompt notification and an alternative station or time. | R1, R2, R3 | Provide a clear conflict state and offer comparable stations or another interval. | Validated across all three discussions |
| F7 | Visitors expect self-service cancellation with clear rules. | R1, R2, R3 | Provide cancellation in the personal account and display applicable rules and deadlines. | Validated across all three discussions |
| F8 | A local tournament and event calendar is considered useful. | R1, R2, R3 | Retain the event calendar in the planned scope. Treat event registration as a separate scope decision. | Validated across all three discussions |
| F9 | Key reservation functions must be convenient on mobile devices. | R1, R2, R3 | Use responsive layouts for availability, specifications, prices, confirmation, status, history, and cancellation. | Validated across all three discussions |
| F10 | Trust depends on accurate availability, specifications and prices, reliable confirmation, and timely notifications. | R1, R2, R3 | Prioritise data consistency, explicit confirmation, transparent information, and visible error handling. | Validated across all three discussions |

## Requirements Informed by Evidence

| Requirement candidate | Evidence reference | Resulting decision |
|---|---|---|
| The system shall allow visitors to view station availability without contacting club staff. | F1, F2 | Retain as a mandatory functional requirement. |
| The server shall revalidate availability before confirming a reservation. | F2, F6, F10 | Retain as a mandatory integrity requirement. |
| Station details shall include relevant PC, monitor, and peripheral specifications. | F4 | Expand the station-information requirement. |
| The interface shall display hourly price and exact available intervals before confirmation. | F5, F10 | Add as mandatory information requirements. |
| The station-selection design shall communicate location or adjacency. | F3 | Include in UX prototype; evaluate a floor layout against a structured list. |
| An availability conflict shall offer another comparable station or time. | F6 | Retain as an acceptance criterion for reservation confirmation. |
| A visitor shall be able to cancel an eligible personal reservation without contacting the administrator. | F7 | Retain; define deadlines and club-specific rules before implementation. |
| The system shall provide a calendar of club events and tournaments. | F8 | Retain in scope. Event registration remains outside the confirmed mandatory scope. |
| Principal visitor workflows shall support mobile screens. | F9 | Retain as a non-functional usability requirement. |
| The interface shall distinguish confirmed, failed, and uncertain reservation outcomes. | F6, F10 | Retain as a reliability and UX requirement. |

## Verified Findings and Remaining Assumptions

### Verified by the Discussions

- Existing availability checking and reservation processes rely heavily on direct communication with club staff.
- Visitors need accurate station availability, specifications, price, and time information.
- Group visitors value adjacent stations.
- Visitors expect self-service cancellation and explicit conflict handling.
- Participants considered an event calendar useful.
- Mobile access and data accuracy are important trust factors.

### Assumptions Requiring Further Validation

| Assumption | Why it remains unverified | Planned validation |
|---|---|---|
| Club administrators need the proposed schedule, station, event, and reporting workflows. | No administrator or manager participated in this sample. | Interview at least one club administrator or manager and evaluate the administrative prototype. |
| Utilisation reports should use the currently proposed indicators and calculation rules. | Visitors were not asked to define administrative reporting metrics. | Administrator discussion and comparison with a controlled data set. |
| Event registration should be integrated into CyberSeat. | Participants expressed interest, but the current scope confirms only event discovery. | Treat registration as optional and evaluate it during scope review. |
| Refund processing should be part of cancellation. | R1 mentioned refund conditions, but online payment is outside the mandatory scope. | Define cancellation information without implementing payments; revisit only if payment enters scope. |
| A visual floor layout is more usable than a structured station list. | Two participants need adjacency information, but no interface alternative was evaluated. | Compare both representations during prototype evaluation. |
| Minimum reservation duration and cancellation deadlines are acceptable. | Participants requested clear rules but did not agree on concrete values. | Validate club-specific rules with an administrator or manager. |

## Conflicting and Divergent Views

No direct contradiction was identified in this small sample. Participants differed mainly in visit frequency and the amount of technical detail they expected. R3 emphasised specific hardware characteristics, while R2 focused more on group availability and ease of use. The proposed interface should therefore provide essential information at a glance and allow users to inspect detailed specifications when needed.

The absence of disagreement in three discussions does not imply agreement across the wider user population.

## Effect on the Project

The discussions support the relevance of CyberSeat's central problem: visitors currently rely on manual communication and cannot independently verify accurate availability. The evidence strengthens the requirements for server-validated availability, transparent station information, conflict alternatives, self-service cancellation, responsive mobile access, and an event calendar.

The evidence also changes the level of detail required by the interface. Station information should include hardware and monitor characteristics, price, exact time availability, and location or adjacency. Group seating should be represented in the UX prototype rather than treated only as a future idea.

No evidence from club administrators was collected in this round. Administrative workflows, reporting metrics, maintenance rules, and concrete cancellation deadlines therefore remain assumptions and must not be presented as user-validated findings.

## Limitations

- The sample contains three participants and is exploratory rather than statistically representative.
- All participants represent visitors; no club administrator, operator, manager, or client participated.
- All three participants play competitive games, especially CS2, which may overemphasise performance specifications and tournament-related needs.
- The discussions were conducted through text rather than direct observation of the reservation process.
- Self-reported practices may differ from observed behavior.
- Findings should be revisited during UX prototype evaluation and later system testing.

## Conclusion

Three anonymised discussions provide initial evidence that CyberSeat addresses a relevant user problem. All participants currently rely on staff communication, social media, or calls to determine availability and make reservations. They consistently requested accurate availability, detailed station information, transparent pricing, clear confirmation, alternatives during conflicts, self-service cancellation, mobile access, and an event calendar.

These findings support the planned visitor-facing functionality and refine its acceptance criteria. They do not validate administrative and reporting requirements, which require a separate discussion with a club administrator or manager. The project shall preserve this distinction between evidence and assumptions in subsequent requirements, diagrams, and UX materials.

## Evidence provenance and verification boundary

The discussion summaries and consent statements above were supplied by the document owner. The documentation consistency review did not contact participants or independently verify the original exchanges. It verifies coverage and traceability, not interview authenticity. The owner should retain the original responses and consent evidence securely and provide anonymised extracts to the supervisor if requested; do not publish names, contact details or private conversations in this repository.

Confirmed findings in this document mean findings reported within this small visitor sample, not statistically established claims about all clubs. Administrator research and prototype evaluation remain outstanding.

## Team Review

- [x] Mansur Urynbassar recorded the anonymised discussions and prepared the initial synthesis.
- [x] Alibi approved the correction revision in PR #7, including this evidence document; see the [October 24 review and agreement record](../project/team-review-2026-10-24.md).
- [x] Team agreement with the documented administrative/reporting evidence limitations was reported by Mansur on behalf of all three participants on October 24; see the [October 24 review and agreement record](../project/team-review-2026-10-24.md). This is reported agreement, not a separately observed review by Nurali.
- [x] Validated findings are explicitly separated from assumptions.

## Publication and review status

The initial version was published through PR #4. The correction revision is covered by [Alibi-stack's approval of PR #7](https://github.com/NeryBR/cyberseat-booking-system/pull/7#pullrequestreview-5637591235) (commit `d7bae8ea9931bbdb8e4caec01c243f33c8cea493`). Additional team agreement was reported by Mansur on October 24; see the [October 24 review and agreement record](../project/team-review-2026-10-24.md). This does not independently verify the original interviews.
