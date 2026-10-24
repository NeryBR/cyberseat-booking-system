# CyberSeat diagrams

## Use Case Diagram — ECR-11

- Editable source: `use-case-diagram.puml`
- Readable export: `use-case-diagram.svg`
- Related issue: https://nerybr.youtrack.cloud/issue/ECR-11

The diagram covers the four roles defined in the requirements: Guest, Registered Visitor, Club Administrator, and System Administrator. It includes browsing, availability, booking, cancellation, events, assigned-club administration, resource and schedule management, reporting, club management, and administrator assignment.

The `<<include>>` relationships identify required sub-behaviour of reservation creation. Independent administrator goals have direct actor associations; they are not compulsory substeps of a generic management operation. The `<<extend>>` relationship shows the exceptional conflict flow when a selected station becomes unavailable before confirmation.

Access boundaries are stated explicitly: visitors access only their own reservations, and club administrators manage only assigned clubs.

## Review checklist

- [x] All planned roles are shown.
- [x] Booking, cancellation, events, and resource-management scenarios are shown.
- [x] Relationships are aligned with the role/access matrix described in the requirements.
- [x] Editable source is included.
- [x] Readable SVG export is included.
- [x] Mansur checked alignment with the interface scenarios.
- [ ] Another team member reviewed the diagram.

## Publication and review status

The initial deliverable was merged through [PR #4](https://github.com/NeryBR/cyberseat-booking-system/pull/4). Its feature branch was deleted. Use the current repository files or immutable commit links, not deleted-branch URLs. PR #4 has no submitted GitHub reviews. The correction revision requires a recorded review by another team member before it is treated as an independently reviewed submission. Automated/documentation checks do not replace that review.

## Reproduce the export

Use PlantUML with its bundled Smetana layout engine (selected in the source):

```sh
java -jar plantuml.jar -charset UTF-8 -tsvg docs/diagrams/use-case-diagram.puml
```

The SVG is generated from the `.puml` file. Do not manually redraw connectors in the export. Check that the conditional extension goes from Resolve booking conflict to Create reservation and that all six independent club-administrator goals remain connected to the actor.
