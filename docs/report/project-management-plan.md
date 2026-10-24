# CyberSeat — Project Management Plan

Version 1.0 · October 24, 2026 · Coordinator: Akhmetov Nurali · University item 10: Project management and risks

Status: proposed plan approved by Mansur in PR #10, with subsequent team agreement reported by Mansur. See the [October 24 review and agreement record](../project/team-review-2026-10-24.md). This document records responsibilities, delivery gates and dependencies; it does not establish that a milestone, review, submission or application test has been completed. Read with the [risk register](risk-register.md).

## 1. Sources and deadline boundary

Sources inspected: current [README](../../README.md), [contribution rules](../../CONTRIBUTING.md), [project proposal](project-proposal.md), [documentation map](../README.md) and the task description supplied by Nurali. The repository inspected on October 24 includes analysis/design documents, an interactive local UX simulation and an implementation scaffold; it does not claim a runnable integrated backend/frontend or final evaluation results.

The YouTrack board required sign-in during preparation, so live issue status, exact issue identifier for this management task and task-specific assignees were not independently verified. ECR links below are work references documented in the repository, not assertions that those cards are Done. Attach the final management-task ID to the branch/PR/task evidence once verified; do not invent it.

| Date/control | Meaning |
| --- | --- |
| October 21, 2026 at 20:00 | Historical internal target for this management task, supplied in its description. It is not a university deadline or evidence of completion. |
| October 24, 2026 BEFORE 18:00 | Mandatory submission of the October package in the university-specified time zone. Sending at 18:00 does not satisfy a before-18:00 deadline. |
| Post-submission development | Separate gated work; dates require later team/supervisor scheduling. No later university deadlines are invented here. |

Before setting the final controls, the package coordinator must confirm the deadline time zone and submission channel from the university notice. Do not infer that zone from GitHub timestamps or a local computer clock. Retain the authoritative notice/channel reference with submission evidence.

## 2. Responsibilities and handoffs

These assignments follow the README/proposal ownership. Coordinating this plan does not transfer the others' implementation work to Nurali or record their agreement. Reviewers shown are proposed; record who actually reviews each result.

| Workstream | Primary owner | October contribution | Later implementation / handoff |
| --- | --- | --- | --- |
| Shared data and booking | Aibekuly Alibi | Proposal; literature; technology comparison; booking/NFR specification; system context and component architecture. Review common data/transaction decisions with Nurali. | ECR-12 detailed model, migrations, booking create/cancel, overlap prevention, integration and load checks; agree API with Mansur. |
| Administration and reporting | Akhmetov Nurali | Role/access matrix; administrative specification; verification plan coordination; project stages/risks; supervisor-feedback record coordination. | ECR-23 roles, assigned-club administration, schedules, blocks, events, reports and audit; coordinate all booking-affecting writes with Alibi. |
| Visitor/admin interfaces and evidence | Mansur Urynbassar | User evidence; existing-system comparison; scenarios; use cases; UX prototype and responsive states. | ECR-21 screens, shared API integration, event/calendar UI, browser/responsive checks and user-task evaluation. |
| Cross-component contract | Alibi and Nurali, with Mansur accepting the client boundary | Agree identifiers, ownership, interval/status semantics, safe errors and scope; log open decisions. | Schema/API/configuration changes are announced and versioned before dependants use them. |
| Package coordination | Nurali (proposed coordinator), all owners supply their sections | Assemble an index/checklist; identify missing evidence/review; confirm university channel/time zone; coordinate ECR-17 access/final-tag checks. | Each owner remains accountable for correctness of their material. An available teammate is nominated as submission backup before package freeze. |

Each person commits from their own account. Another participant reviews the affected area. Agreement conveyed by Nurali must be labelled as reported agreement; no fabricated commits, reviews, respondent records or supervisor approval.

## 3. October materials versus subsequent development

| Work package | Reference / location | Dependency and October exit condition |
| --- | --- | --- |
| Problem, objectives and bounded proposal | ECR-2; [proposal](project-proposal.md) | Align team scope and evidence limitations with README. Do not claim validated local demand without real evidence. |
| User needs and alternatives | ECR-3/4/5/6; [research](../research/) | Trace needs to real evidence or explicitly mark assumptions; cited comparisons support requirements/technology decisions. Respondent access is R-01. |
| Scenarios and requirements | ECR-1/7/8; [requirements](../requirements/) | Four roles, own-record/assigned-club boundaries, intervals, booking protection and report formulas are consistent and checkable. |
| Architecture and interaction design | ECR-9/10/11; [diagrams](../diagrams/) and [UX](../ux/) | Editable sources/readable exports and prototype flows match requirements. Browser-memory simulation is clearly distinguished from a live service. |
| Verification/evaluation plan | ECR-13; [testing](../testing/) | Assign future integration/concurrency, access/report and UX checks; specify conditions, fixtures, thresholds and baselines; no final-result claims. |
| Management and risks | This task; this plan and [risk register](risk-register.md) | Three owners, gates, dependencies, risk treatment and review/evidence procedure are explicit. |
| Repository and configuration | ECR-14; [repository guides](../project/) | README/module ownership/configuration boundaries are documented. Scaffold presence is not runtime implementation. |
| Feedback and final package | ECR-16 feedback; ECR-17 access/final-tag checks | Record actual supervisor feedback if received, otherwise pending. Verify complete-package access, exact version and submission receipt; do not infer approval from a merge. |

This is a coordination map derived from the task and repository, not a replacement for the university's complete official submission checklist. The coordinator checks all official items, including any presentation/report requirements, before release. No implementation requirement is added merely to make the October package appear more complete.

**Outside the mandatory October implementation scope:** runnable API/frontend, detailed ER/migrations where assigned to later work, production hosting, completed integration/concurrency/load studies and final UX results. Existing scaffold or prototype work may accompany the design package but cannot replace mandatory analysis/design documents. Online payment, loyalty, hardware control, automatic tournament registration and multi-station group booking remain excluded/deferred as in the proposal.

## 4. Milestones and acceptance gates

The following October 24 checkpoints are proposed internal controls in the confirmed university time zone, not additional official deadlines or statements that work was completed. If a proposed checkpoint has already passed when this plan is accepted, execute its gate immediately and replan the remaining buffer without moving the mandatory deadline.

| Gate | Proposed checkpoint / ordering | Owner and prerequisite | Evidence needed to pass |
| --- | --- | --- | --- |
| G0 — Authority and ownership | First action, before scheduling release | Nurali; university notice and available team | Confirm time zone/channel, official checklist, package coordinator and named backup. |
| G1 — Content/dependency freeze | October 24, 15:00 | All section owners; G0 and completed mandatory drafts | One versioned package index; consistent roles/statuses/API assumptions; each missing item has an owner and disposition. Scope additions require explicit impact review. |
| G2 — Cross-review | October 24, 16:00 | Relevant teammate per section; G1 | Actual reviewer, reviewed commit and outcome recorded. Resolve blocking inconsistency, unsupported evidence or unreadable artifacts. Outstanding supervisor feedback stays pending. |
| G3 — Package and access check | October 24, 16:30 | Nurali coordinates; ECR-17 owner/backup confirmed at G0; G2 | Verify links and viewer/download access from the intended recipient perspective, readable exports, current index and exact commit. Confirm all official items, not only Alibi's dossier. |
| G4 — Send with buffer | Target October 24, 17:00; receipt check by 17:30 | Nominated submitter; G3 | Upload/send through the university channel; retain receipt/time and exact artifact/version identifiers. If upload fails, trigger R-05 immediately. |
| G5 — Mandatory cutoff | October 24 BEFORE 18:00 | Submitter and backup | Submission accepted/received before cutoff according to the university's channel. A PR merge or local upload attempt alone is insufficient evidence. |
| G6 — Post-submission baseline | After confirmed submission | All three; G5 | Record the submitted version, feedback and remaining backlog. ECR-17 manages the final tag; do not move an existing submission tag. |

No gate is marked passed by creation of this document. A critical missing mandatory item is escalated to the team immediately; submit the best complete approved package within the rules and disclose unresolved evidence rather than fabricating it. A deadline extension is not assumed without explicit university confirmation.

### Subsequent development gates (proposed sequence, dates to be agreed)

| Stage | Dependency | Lead / contributors | Exit condition |
| --- | --- | --- | --- |
| D1 — Foundation | Submitted design baseline; resolve model/auth/config questions | Alibi for data; Nurali for access; Mansur for client contract | Agreed ER/API contracts, migrations/seed, authentication/catalogue and verified setup commands on synthetic data. |
| D2 — Core MVP | D1; shared booking/admin transaction protocol | Alibi booking; Nurali administration; Mansur client | Find/create/view/cancel flow integrates; overlap, maintenance, schedule and assigned-club checks pass defined integration/race cases. |
| D3 — Diploma features | Stable D2 and versioned report/event contracts | Nurali reports/events/audit; Mansur UI; Alibi data support | Event calendar, station layout and specified report/audit features integrated; historical report capacity retained. |
| D4 — Final evaluation and correction | Implemented required flows plus executable ECR-13 plan | Owners execute their suites; all review limitations | Reproducible actual correctness/load/UX evidence, resolved critical defects, documented limitations and demonstrable system. |

## 5. Dependency register

| ID | Upstream -> dependent work | Handoff contract / blocker response | Owner |
| --- | --- | --- | --- |
| DEP-01 | User/client evidence -> proposal, scope, requirements and UX | Mansur supplies dated real evidence or a clearly labelled assumption; lack of respondents triggers R-01, not invented interviews. | Mansur |
| DEP-02 | Scenarios + booking/role rules -> architecture and UX | Agree four roles, one-station intervals, cancellation, informational events, errors and uncertain outcomes; inconsistent documents block G2. | Alibi + Nurali; Mansur confirms UX |
| DEP-03 | Shared data/transaction model -> booking and admin writes | Stable IDs, UTC/club-zone rules, shared locking/revalidation, operation identity and history. Schema/API changes require joint review. | Alibi; Nurali reviews |
| DEP-04 | Versioned API contract -> frontend/backend integration | Agree request/response/error examples and role scope before client integration; keep mocks tied to contract revision. Contract drift triggers R-03. | Alibi + Nurali; Mansur accepts |
| DEP-05 | Historical schedules/activity + booking statuses -> reports | Agree snapshot and station-minute definitions, preserve effective history and use independent control fixtures. Missing history blocks a valid utilisation claim. | Nurali; Alibi supports data |
| DEP-06 | Requirements + architecture + UX -> evaluation plan -> future results | ECR-13 maps requirements to checks. Execution waits for runnable build, migrations/seed and documented environment; planned checks are not results. | Nurali coordinates; all execute owned checks |
| DEP-07 | All mandatory materials + teammate review -> package -> access/receipt | Index points to the exact release version; ECR-17 access/tag gate follows complete-package verification. No status is inferred merely from file presence. | Nurali coordinates; submitter/backup named at G0 |
| DEP-08 | Actual supervisor feedback -> revised scope/plan | ECR-16 records date/source/decision and action owner; unreceived feedback remains pending. Revisit dependencies after material changes. | Nurali coordinates; all owners respond |

The October critical chain is mandatory drafts -> consistency/review -> package/access verification -> accepted submission. The implementation chain is agreed data/API/auth contracts -> integrated booking/admin/UI -> reports/features -> executed evaluation. These chains must not be conflated.

## 6. Change, risk and status control

Use one reviewable branch/PR per outcome, following CONTRIBUTING. Record the verified task ID in branch/commit/PR and YouTrack when known. A proposed scope change records reason, requirement impact, owner, effort, dependency impact and effect on G1–G5; all affected owners agree before implementation. Freeze nonessential additions after G1. Preserve the original baseline and decision history.

At each handoff, owners report artifact/commit, next step, blocker and needed decision. On October 24 review the [risk register](risk-register.md) at G0–G4 and immediately when a trigger fires. After submission, review it weekly and when requirements/contracts change; this is a proposed team cadence, not a scheduled automation. A material booking-integrity, access or submission risk is escalated immediately to all three participants and, where needed, through the university's established supervisor/channel process.

Done means the stated acceptance evidence exists, blocking review comments are resolved and the task contains result/commit/PR plus the actual reviewer. PR merge is version-control evidence; it is not proof of respondent participation, supervisor approval, successful tests or university receipt.

## 7. Acceptance and closure record

| Task criterion | Evidence in this plan |
| --- | --- |
| Responsibilities of all three | Section 2; README/proposal ownership and handoffs |
| Milestones and dependencies | G0–G6, D1–D4 and DEP-01–08 |
| Required five risks with owners and mitigation | R-01–05 in risk-register.md; additional R-06–08 protect access/report/evidence consistency |
| Development after first submission separated | Section 3 and separate D-stage gates |
| Result, commit/PR and reviewer | Attach both files and the final reviewed PR/commit to the actual management task; PR #10 reviewer approval recorded |

- [ ] Verify and attach the exact YouTrack task identifier; live board status was unavailable during preparation.
- [x] A named teammate approved the plan/risk register against the recorded commit: [NeryBR's approval of PR #10](https://github.com/NeryBR/cyberseat-booking-system/pull/10#pullrequestreview-5637783155) (commit `84602e21fe42c5f31bf91b70fdd96aa992271288`). Outstanding release decisions and any new blocking comments remain separate.
- [ ] Confirm the university time zone/channel and name the submitter/backup in the release record.
- [ ] Attach file links, commit/PR and real review evidence to the task.
- [ ] Mark the task Done only after its acceptance criteria are met; do not claim the full project has been submitted merely because this task is closed.
