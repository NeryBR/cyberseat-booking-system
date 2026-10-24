# CyberSeat — Roles and Permissions

Version 1.0 · October 23, 2026 · Owner: Akhmetov Nurali · ECR-8

Status: design specification with GitHub approval and reported team agreement; see the [October 24 review and agreement record](../project/team-review-2026-10-24.md). This is planned behaviour, not implemented authorisation or completed tests. Sources: [scenarios](user-scenarios.md), [booking baseline](booking-and-nfr.md), [administrative specification](administrative-requirements.md). System administrator in existing documents means superadministrator here.

## Role definitions

| Role | Identity and scope |
| --- | --- |
| Guest | Unauthenticated person; public information only. |
| Registered visitor | Authenticated person; manages only reservations owned by their authenticated user ID. |
| Club administrator | Authenticated person with active assignments to specific clubs; operational authority is limited to those clubs. |
| Superadministrator | System-level authority to create clubs and grant/revoke club assignments; no automatic operational access to every club. |

Administrators may use visitor functions for their own reservations. That personal capability never expands administrative scope. A superadministrator needing operational access must also have an explicit club assignment.

## Permission matrix

Own = ownership verified by the server. Assigned = a current server-side club assignment. No = denied even when a client displays a button or supplies another ID. Permissions are Must requirements unless deferred explicitly.

| Operation | Guest | Visitor | Club administrator | Superadministrator |
| --- | --- | --- | --- | --- |
| Browse active clubs, public station details and availability | Public | Public | Public | Public |
| View published events and clearly cancelled published events | Public | Public | Public | Public |
| Create/list/view personal reservations | No | Own | Own via visitor flow | Own via visitor flow |
| Cancel personal reservation before its start | No | Own | Own via visitor flow | Own via visitor flow |
| Open operational administration | No | No | Assigned | Explicit club assignment required |
| Edit club name/address and minimum booking duration | No | No | Assigned | Explicit club assignment required |
| Create/edit/deactivate stations | No | No | Assigned | Explicit club assignment required |
| Change working schedules and maintenance intervals | No | No | Assigned | Explicit club assignment required |
| List/view club reservations and minimum service data | No | No | Assigned | Explicit club assignment required |
| Cancel club reservation before start, with reason | No | No | Assigned | Explicit club assignment required |
| Change reservation after its start | No | No | Deferred pending approved club rules | Deferred pending approved club rules |
| Create/edit/publish/cancel club events | No | No | Assigned | Explicit club assignment required |
| View reservation and scheduled-utilisation reports | No | No | Assigned | Explicit club assignment required |
| Inspect operational audit entries | No | No | Assigned | Explicit club assignment required |
| Create clubs; manage activation and IANA time zone | No | No | No | System-wide; booking safeguards apply |
| Grant/revoke administrator-to-club assignments | No | No | No | System-wide |
| Inspect club/assignment administration audit | No | No | No | Limited to these system actions |
| Grant superadministrator privileges via application | No | No | No | Outside this specification |
| Permanently delete clubs, stations, bookings or audit history | No | No | No | No |

## Server access rules and planned verification

| ID / priority | Requirement | Verifiable acceptance criterion |
| --- | --- | --- |
| RBAC-01 / Must | Authenticate and authorise every protected request; never trust a client role/owner. | Guest receives 401 for protected operation; visitor receives 403 for administrative route. Supplying another role/user ID grants no capability. |
| RBAC-02 / Must | Resolve the actual owning club of every station, block, booking, event and report. | Admin assigned only to A cannot read/mutate B by changing path, body, nested resource IDs or filters; no protected details are disclosed. |
| RBAC-03 / Must | Apply club scope to lists, details, aggregates, writes and any later exports. | Two-club fixture returns only authorised data; explicitly requesting an unauthorised club or mixed scope is rejected. |
| RBAC-04 / Must | Personal routes enforce authenticated ownership independently of admin authority. | Visitor A cannot read/cancel B's record. Return 404 for absent/foreign records as in the booking baseline. |
| RBAC-05 / Must | Revocation removes access on subsequent requests and is ordered with protected writes. | After revocation commits, next request is denied. An in-flight write either commits before revocation or observes revoked access and fails; stale session cannot restore assignment. |
| RBAC-06 / Must | Administrators cannot alter assignments, club identity/time zone or their privileges. | Direct system/assignment requests receive 403. Station/event updates cannot reparent a resource to another club. |
| RBAC-07 / Must | Default deny; separate system and operational capabilities. | Unassigned superadministrator can manage assignments but cannot read club reservation reports. Grant/revoke explicitly enables/removes operational access. |
| RBAC-08 / Must | Minimise reservation service data. | Show booking ID, station, interval, status, user reference/display name and relevant cancellation reason; exclude credentials and unrelated profile/contact data. Reports contain aggregates. |
| RBAC-09 / Must | Audit protected changes and failures safely. | Records contain actor/action/target/club/time/result/reason/correlation ID without credentials; operational audit queries obey club scope. |

An authenticated user lacking an administrative capability receives 403. For an administrator requesting an absent/out-of-scope individual resource, consistently use 404 without revealing existence. Invalid input uses 422 and conflicting valid changes use 409. Authorisation precedes disclosure of protected validation/conflict details.

## Review required before task closure

- [x] Team agreement with the proposed assignment and transaction/revocation design is recorded from Mansur's October 24 confirmation on behalf of the team. See the [October 24 review and agreement record](../project/team-review-2026-10-24.md); no separate execution of a technical review by Alibi is asserted.
- [x] Mansur's approval of the role/access specification is recorded in PR #5. See the [October 24 review and agreement record](../project/team-review-2026-10-24.md); this is design acceptance, not a live-interface test.
- [x] Named reviewer, reviewed commit and approval outcome are recorded in [NeryBR's approval of PR #5](https://github.com/NeryBR/cyberseat-booking-system/pull/5#pullrequestreview-5637447311) (commit `834f87e1a78a5ebc1b5c29097b856427dd43f993`).

The approval and reported agreement above are recorded; external task-evidence actions remain separate. See the [full acceptance checklist](administrative-requirements.md#october-deliverable-acceptance).
