# CyberSeat UX prototype — ECR-9

**Version:** 1.1  
**Date:** October 23, 2026  
**Related issue:** https://nerybr.youtrack.cloud/issue/ECR-9

## Files

- `prototype.html` — responsive, editable prototype source.
- `cyberseat-ux-prototype.png` — full-page readable export of all screens.

## Covered scenarios

1. club catalogue and filtering;
2. date, time, and single-station selection with nearby-seat information;
3. confirmation with server-side availability revalidation and conflict recovery;
4. personal account, history, cancellation, and cancellation rules;
5. event and tournament calendar;
6. administrative schedule and unavailable intervals;
7. administrative utilisation and cancellation reports;
8. loading, empty results, validation, connection-loss, server-error, and success states;
9. a mobile catalogue and booking entry variant.

Statuses use both text and colour. The booking path is consistent with the ECR-1 scenarios and explicitly avoids claiming that a working frontend has been implemented.

## Primary prototype walkthrough

`Catalogue → filters → station selection → one station → confirmation → availability revalidation → confirmed booking or conflict recovery → personal account → cancellation`

## Review checklist

- [x] Key visitor screens included.
- [x] Personal account and cancellation included.
- [x] Event calendar included.
- [x] Administrative schedule and reports included.
- [x] Mobile variant included.
- [x] Loading, empty, validation, server, and connection states included.
- [x] Status is represented with text and colour.
- [x] Prototype is aligned with the booking scenarios.
- [ ] Prototype reviewed by another team member.

## Publication and review status

The initial deliverable was merged through [PR #4](https://github.com/NeryBR/cyberseat-booking-system/pull/4). Its feature branch was deleted. Use the current repository files or immutable commit links, not deleted-branch URLs. PR #4 has no submitted GitHub reviews. The correction revision requires a recorded review by another team member before it is treated as an independently reviewed submission. Automated/documentation checks do not replace that review.

## Revision 1.1 alignment

Screens 10-12 add the normal confirmation, pending/success, cancellation confirmation/history, pre-submission offline, uncertain response and maintenance-conflict states. Cancellation is permitted before the start time; no fee/refund policy is invented. All booking and event times identify the club zone. Each station has a textual status. A single reservation refers to one station, matching BR-03; adjacency is information, not an unapproved atomic group-booking API. Report figures are illustrative and identify the period and denominator.

The HTML is a static set of screen designs, not a working booking application. Buttons illustrate intended actions. Future API tests and user usability sessions are not claimed as completed.

## Scope note from the personal contribution statement

The September 30 contribution statement includes both club tournaments and major external esports events. The current approved scenarios and event model define club-published informational events. External-event curation, organiser verification and a model that does not require club ownership need a separate team/supervisor scope decision. This revision keeps the approved club-event baseline; it neither claims the broader calendar is complete nor introduces registration or payments. The personal statement itself is not published because it contains unnecessary personal information.
