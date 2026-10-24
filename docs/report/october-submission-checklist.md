# October Submission Package Audit - ECR-18

Audit date: October 24, 2026. Coordinator: Akhmetov Nurali. Audited repository baseline: `23047b9566a376f6c463b5111831946cd12bf429`.

## Method and boundary
All eleven components listed in ECR-18 were inspected against the current repository. Related live October YouTrack descriptions, assignees, priorities, and stages were inspected. This is a document and package audit assisted by Codex, not three independent human reviews, supervisor approval, an application test report, or a submission receipt. Existing GitHub reviews of source deliverables do not approve the new consolidated PDF.

The original university requirements document was not provided to this work. The eleven-component structure follows the live ECR-18 acceptance criteria. The existing closure record reports an earlier inspection of the university document and distinguishes it from the separately reported deadline and submission arrangements.

## Eleven-component checklist
| Item | Component | Source | Finding |
|---|---|---|---|
| 1 | Project proposal and scope | [project-proposal.md](../report/project-proposal.md) | Present: identity, problem, objectives, bounded scope, stages, and evidence limitations. |
| 2 | Evidence of relevance and user needs | [user-needs-evidence.md](../research/user-needs-evidence.md) | Present with limitations: three owner-reported anonymised visitor discussions; exploratory sample. Original exchanges were not independently authenticated; administrator research remains outstanding. |
| 3 | Critical literature review | [literature-review.md](../research/literature-review.md) | Present: source selection, 13-source critical matrix, limitations, and engineering implications. This audit checks the supplied synthesis, not independent replication of every cited study. |
| 4 | Existing systems comparison | [existing-systems-comparison.md](../research/existing-systems-comparison.md) | Present: SENET, ggLeap, and LANGAME against nine criteria with source traceability. Unknown features remain unconfirmed rather than absent. |
| 5 | Technology comparison | [technology-comparison.md](../research/technology-comparison.md) | Present: backend, database, communication, client, and deployment trade-offs; decisions are proposed, not benchmarks. |
| 6 | Requirements specification | [booking-and-nfr.md](../requirements/booking-and-nfr.md) | Present: booking/NFR requirements, scenarios, administrative requirements, and four-role access matrix; priorities and acceptance criteria are documented. |
| 7 | System Context, Use Case, and Component Diagrams | [architecture.md](../diagrams/architecture.md) | Present: editable Mermaid/PlantUML sources and SVG exports. All three exports are embedded in the consolidated report; detailed ER design remains ECR-12 future work. |
| 8 | UX prototype | [README.md](../ux/README.md) | Present: interactive v2 local simulation and preserved v1.1 static screens. The report labels the historical screens correctly; real API integration, user studies, and v2 real-browser validation are not certified. |
| 9 | Verification and evaluation plan | [verification-and-evaluation-plan.md](../testing/verification-and-evaluation-plan.md) | Present: owners, cases, fixtures, metrics, thresholds, comparison baselines, traceability, execution gates, and limitations. Future tests remain unexecuted. |
| 10 | Project management and risks | [project-management-plan.md](../report/project-management-plan.md) | Present: three participants, October gates, later development stages, dependencies, and an owned risk register. Planned checkpoints are not treated as executed. |
| 11 | Supervisor feedback | [supervisor-feedback-record.md](../report/supervisor-feedback-record.md) | Incomplete: supervisor identity is documented, but a dated request, genuine response or properly evidenced unanswered request, and escalation are not verified. The prepared request is explicitly not sent. |


## Repository and release controls
| Control | Observation | Disposition |
|---|---|---|
| Repository | Public repository cloned successfully at 23047b9566a376f6c463b5111831946cd12bf429 | Verified technical availability; actual committee/supervisor account access is not certified |
| Individual contributions | Git history contains substantive source changes under Akhmetov Nurali, Alibi-stack, and NeryBR | Authorship metadata inspected; identity and account ownership are not independently authenticated |
| Pull Request evidence | Source approvals are recorded in the October 24 team-review record; PRs 5, 6, and 10 were directly inspected in this chat | Distinguish actual submitted reviews from comments and reported agreement |
| Review timing | The source review record notes some approvals after merge | Do not claim universal compliance with review-before-merge requirements |
| Final submission version | No pre-defense-1 tag was present in the cloned baseline | ECR-17 remains a separate unresolved release gate; no tag created or moved |
| Priorities and deadlines | Live October descriptions retain the before-18:00 cutoff; internal targets are explicitly separate | Stage, owner, and priority observations recorded below; not all issue field dates are exposed in the inspected UI |
| Deadline/channel | Existing closure record reports Mansur's confirmation of October 24 before 18:00 Astana time, UTC+5, and the Microsoft form | Reported source, not newly confirmed by the university in this work |
| Consolidated PDF | Team_3_Approbation_Report_24_October.pdf compiled from this baseline, with new audit and feedback-status records | Technical PDF verification is recorded separately; two full-PDF reviews with no issues were subsequently reported by Nurali; see the consolidated report verification record |
| YouTrack screenshot PDF | ECR-19 is Queue in the inspected live card; no final screenshot PDF was found in this repository | Separate required artifact remains unverified; this consolidated report does not substitute for it |
| Submission receipt | ECR-20 is Queue; no receipt supplied | No submission performed or claimed |
| Supervisor feedback | No dated request/response or escalation evidence supplied | ECR-16 remains Queue |
| Three-person package verification | No evidence that all three have reviewed this exact package | Pending; AI checks do not count as team-member reviews |

## Live task observations
The following observations are a point-in-time snapshot from October 24. Titles are reproduced in English for this audit. The underlying ECR-19 and ECR-20 cards are outside this editing scope.

| Issue | Assignee | Priority | Stage |
|---|---|---|---|
| [ECR-1](https://nerybr.youtrack.cloud/issue/ECR-1) | Mansur Urynbassar | Major | Done |
| [ECR-2](https://nerybr.youtrack.cloud/issue/ECR-2) | Aibekyly Alibi | Major | Done |
| [ECR-3](https://nerybr.youtrack.cloud/issue/ECR-3) | Mansur Urynbassar | Major | Done |
| [ECR-4](https://nerybr.youtrack.cloud/issue/ECR-4) | Aibekyly Alibi | Major | Done |
| [ECR-5](https://nerybr.youtrack.cloud/issue/ECR-5) | Mansur Urynbassar | Major | Done |
| [ECR-6](https://nerybr.youtrack.cloud/issue/ECR-6) | Aibekyly Alibi | Major | Done |
| [ECR-7](https://nerybr.youtrack.cloud/issue/ECR-7) | Aibekyly Alibi | Major | Done |
| [ECR-8](https://nerybr.youtrack.cloud/issue/ECR-8) | Akhmetov Nurali | Major | Done |
| [ECR-9](https://nerybr.youtrack.cloud/issue/ECR-9) | Mansur Urynbassar | Major | Done |
| [ECR-10](https://nerybr.youtrack.cloud/issue/ECR-10) | Aibekyly Alibi | Major | Done |
| [ECR-11](https://nerybr.youtrack.cloud/issue/ECR-11) | Mansur Urynbassar | Major | Done |
| [ECR-13](https://nerybr.youtrack.cloud/issue/ECR-13) | Akhmetov Nurali | Major | Done |
| [ECR-14](https://nerybr.youtrack.cloud/issue/ECR-14) | Aibekyly Alibi | Major | Ревью |
| [ECR-15](https://nerybr.youtrack.cloud/issue/ECR-15) | Akhmetov Nurali | Major | Done |
| [ECR-16](https://nerybr.youtrack.cloud/issue/ECR-16) | Akhmetov Nurali | Major | Queue |
| [ECR-17](https://nerybr.youtrack.cloud/issue/ECR-17) | Aibekyly Alibi | Major | Queue |
| [ECR-18](https://nerybr.youtrack.cloud/issue/ECR-18) | Akhmetov Nurali | Major | Queue |
| [ECR-19](https://nerybr.youtrack.cloud/issue/ECR-19) | Mansur Urynbassar | Major | Queue |
| [ECR-20](https://nerybr.youtrack.cloud/issue/ECR-20) | Mansur Urynbassar | Critical | Queue |
| [ECR-24](https://nerybr.youtrack.cloud/issue/ECR-24) | Akhmetov Nurali | Critical | Queue |


## Release decision and remaining actions
All eleven components have been inspected; item 11 is incomplete and several release controls remain unverified. ECR-18 remains Queue because complete-team package verification and dependent release evidence have not been established. Do not convert this audit into a declaration that the package is ready for submission.

1. Supply the actual supervisor request/response or unanswered-request and escalation evidence.
2. Two full-PDF reviews with no issues were subsequently reported by Nurali for Alibi and Mansur against the unchanged PDF checksum; see consolidated-report-verification.md. Verification of the entire package by all three remains pending.
3. Complete ECR-17 access and exact-version checks; preserve any established submission tag.
4. Complete the separate ECR-19 screenshot PDF and confirm form limits.
5. Submit through the authorised channel and retain the actual receipt in ECR-20.

The historical Alibi-only PDF is a dated five-deliverable dossier. It is not the complete-team consolidated report. Future implementation in ECR-12 and ECR-21-ECR-23 is not an October completion prerequisite.
