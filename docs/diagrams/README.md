# CyberSeat diagrams

## Use Case Diagram — ECR-11

- Editable source: `use-case-diagram.puml`
- Readable export: `use-case-diagram.svg`
- Related issue: https://nerybr.youtrack.cloud/issue/ECR-11

The diagram covers the four roles defined in the requirements: Guest, Registered Visitor, Club Administrator, and System Administrator. It includes browsing, availability, booking, cancellation, events, assigned-club administration, resource and schedule management, reporting, club management, and administrator assignment.

The `<<include>>` relationships identify mandatory steps of reservation creation and club management. The `<<extend>>` relationship shows the exceptional conflict flow when a selected station becomes unavailable before confirmation.

Access boundaries are stated explicitly: visitors access only their own reservations, and club administrators manage only assigned clubs.

## Review checklist

- [x] All planned roles are shown.
- [x] Booking, cancellation, events, and resource-management scenarios are shown.
- [x] Relationships are aligned with the role/access matrix described in the requirements.
- [x] Editable source is included.
- [x] Readable SVG export is included.
- [x] Mansur checked alignment with the interface scenarios.
- [ ] Another team member reviewed the diagram.
- [ ] GitHub branch, commit, and Pull Request created.
- [ ] Result, commit, and Pull Request links added to ECR-11.
