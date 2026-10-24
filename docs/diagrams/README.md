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
- [x] Another team member reviewed the diagram. See the review record below.

## Publication and review status

The initial version was published through PR #4. The applicable revision has a recorded review: [Alibi-stack's approval of PR #7](https://github.com/NeryBR/cyberseat-booking-system/pull/7#pullrequestreview-5637591235) (commit `d7bae8ea9931bbdb8e4caec01c243f33c8cea493`). See the [October 24 review and agreement record](../project/team-review-2026-10-24.md) for the distinction between GitHub approval, reported team agreement and outstanding execution checks.

## Reproduce the export

Use PlantUML with its bundled Smetana layout engine (selected in the source):

```sh
java -jar plantuml.jar -charset UTF-8 -tsvg docs/diagrams/use-case-diagram.puml
```

The SVG is generated from the `.puml` file. Do not manually redraw connectors in the export. Check that the conditional extension goes from Resolve booking conflict to Create reservation and that all six independent club-administrator goals remain connected to the actor.
