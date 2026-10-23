# CyberSeat UX prototype — ECR-9

**Version:** 1.0  
**Date:** October 23, 2026  
**Related issue:** https://nerybr.youtrack.cloud/issue/ECR-9

## Files

- `prototype.html` — responsive, editable prototype source.
- `cyberseat-ux-prototype.png` — full-page readable export of all screens.

## Covered scenarios

1. club catalogue and filtering;
2. date, time, and adjacent-station selection;
3. confirmation with server-side availability revalidation and conflict recovery;
4. personal account, history, cancellation, and cancellation rules;
5. event and tournament calendar;
6. administrative schedule and unavailable intervals;
7. administrative utilisation and cancellation reports;
8. loading, empty results, validation, connection-loss, server-error, and success states;
9. a mobile catalogue and booking entry variant.

Statuses use both text and colour. The booking path is consistent with the ECR-1 scenarios and explicitly avoids claiming that a working frontend has been implemented.

## Primary prototype walkthrough

`Catalogue → filters → station selection → adjacent seats → confirmation → availability revalidation → confirmed booking or conflict recovery → personal account → cancellation`

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
- [ ] GitHub branch, commit, and Pull Request created.
- [ ] Result, commit, and Pull Request links added to ECR-9.
