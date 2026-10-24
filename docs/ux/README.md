# CyberSeat UX prototype — ECR-9

**Version:** 2.0

**Date:** October 24, 2026

**Related issue:** https://nerybr.youtrack.cloud/issue/ECR-9

## Files

- [`prototype.html`](prototype.html) — interactive prototype entry point; open this file in a modern browser.
- [`prototype.css`](prototype.css) — graphite, lime and violet visual system, responsive layouts and reduced-motion support.
- [`prototype.js`](prototype.js) — page navigation, dialogs, filters and simulated response states.
- [`prototype-model.js`](prototype-model.js) — disposable in-memory example data and booking/maintenance simulation.
- [`assets/gaming-lounge.png`](assets/gaming-lounge.png) — generated venue atmosphere art; see [asset provenance](assets/README.md).
- [`cyberseat-ux-prototype.png`](cyberseat-ux-prototype.png) — preserved **version 1.1** static screen collection. It does not show the redesigned v2 interface.
- [`tests/`](tests/README.md) — checks of the local simulation and DOM transitions, with their limitations.

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
- [x] Prototype reviewed by another team member. See the review record below.

## Publication and review status

The initial version was published through PR #4. The applicable revision has a recorded review: [NeryBR's approval of PR #9](https://github.com/NeryBR/cyberseat-booking-system/pull/9#pullrequestreview-5637860487) (commit `723579d61ac025b50f59ff64cb0086cb03698a0d`). See the [October 24 review and agreement record](../project/team-review-2026-10-24.md) for the distinction between GitHub approval, reported team agreement and outstanding execution checks.

## Revision 1.1 alignment

Screens 10-12 add the normal confirmation, pending/success, cancellation confirmation/history, pre-submission offline, uncertain response and maintenance-conflict states. Cancellation is permitted before the start time; no fee/refund policy is invented. All booking and event times identify the club zone. Each station has a textual status. A single reservation refers to one station, matching BR-03; adjacency is information, not an unapproved atomic group-booking API. Report figures are illustrative and identify the period and denominator.

The original version was a static set of screen designs. Version 2 replaces the primary HTML with a local interactive simulation, retaining the baseline scenarios described above. Future real API tests and user usability sessions are not claimed as completed.

## Revision 2.0 — interactive visual redesign

The revision keeps Mansur's scenario baseline and initial artwork/export history. Alibi prepared the redesign on October 24, 2026 at the user's request. It does not imply that Mansur reviewed or authored the new code.

- A persistent desktop sidebar and compact mobile navigation lead to Discover, My bookings, Events, Club schedule, Insights and Interface states.
- The catalogue has a photographic venue hero, club cards and working local filters for name/neighbourhood, PC/console type, date, start and duration.
- The floor plan selects exactly one station. Reserved and maintenance stations are disabled and have textual statuses. The review step shows the club, station, interval, explicit time zone, estimated price and cancellation rule.
- Simulated confirmation is pending before success. Normal, stale-selection conflict, offline-before-send, uncertain response after saving, server-failure-before-save and session-expiry paths are available through Interface states or collapsed prototype controls.
- Unknown outcomes reconcile using the same local operation. Cancellation requires confirmation, retains history and releases only that booking's interval. An example maintenance block cannot overwrite a confirmed booking.
- Events remain club-published information; no event registration, payment, external-event curation or atomic group booking is introduced.
- Reports retain illustrative values and explicit period/denominator explanations. The period summary and example-week chart are separate fixtures.
- Semantic labels, visible focus, native modal dialogs, text statuses, a skip link and reduced-motion styles support accessible review. This is not a WCAG conformance claim.

### Open and explore

Open `prototype.html` directly from this directory in a current browser. Keep its neighbouring CSS, JavaScript and `assets/` files in place. No installation or application server is required for this standalone design artifact. On GitHub, the HTML file page displays source; download the repository to run it locally.

Start with **Cyber Arena → Choose a spot → P02 → Review session → Confirm reservation → My bookings → Cancel booking**. Explore **Interface states** for recovery paths. Under **Club schedule**, blocking P04 at 18:00 conflicts with the initial demo booking; P02 is initially free.

The demo clock is fixed at **October 24, 2026, 17:00, Asia/Almaty (UTC+05:00)**. Default visits start at 18:00. Example club hours are 08:00–24:00 and the illustrative minimum is one hour; actual club configuration still requires confirmation. These fixtures do not change the requirements' general model, including overnight schedules.

All bookings, role views and responses are simulated in memory. There are no network requests, real authentication, database, payments or persistent data. Reloading resets the demo. The local model is not a security or concurrency guarantee for the future server.

### Recorded validation and review

On October 24: JavaScript syntax checks passed; 12 local-model checks and 11 DOM integration checks passed. They cover one-station selection, overlap/maintenance behaviour in the simulation, cancellation/history, stable-operation replay, uncertain-response recovery, filters, navigation and error states. Native browser dialog behaviour, responsive rendering and human usability review remain unverified by these checks. See [test instructions and limits](tests/README.md).

The browser automation environment blocked opening a local `file:` URL. That action was not bypassed. The v2 interface has not been visually inspected in a real browser in this session, and no new v2 screenshot is presented as verified evidence. The preserved PNG remains labelled v1.1.

Independent review of version 2.0 is recorded in [NeryBR's approval of PR #9](https://github.com/NeryBR/cyberseat-booking-system/pull/9#pullrequestreview-5637860487) (commit `723579d61ac025b50f59ff64cb0086cb03698a0d`). It was submitted after merge. This design approval does not establish real-browser visual validation or participant usability results; those limitations above remain in force.

## Scope note from the personal contribution statement

The September 30 contribution statement includes both club tournaments and major external esports events. The current approved scenarios and event model define club-published informational events. External-event curation, organiser verification and a model that does not require club ownership need a separate team/supervisor scope decision. This revision keeps the approved club-event baseline; it neither claims the broader calendar is complete nor introduces registration or payments. The personal statement itself is not published because it contains unnecessary personal information.
