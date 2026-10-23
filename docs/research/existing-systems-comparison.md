# Existing Systems Comparison for CyberSeat

**Version:** 1.0  
**Date:** October 23, 2026  
**Related issue:** [ECR-5](https://nerybr.youtrack.cloud/issue/ECR-5)  
**Scope:** systems that support gaming-club or esports-venue operations and station booking

## Purpose and method

This comparison evaluates three directly relevant systems against the same nine criteria. Three systems are sufficient because all three are specialised products for gaming or esports venues, expose visitor booking functions, and provide venue-management functions. General-purpose appointment products were excluded because they do not model gaming stations, venue maps, device state, or gaming-centre operations.

The analysis uses publicly available official product pages and official support documentation accessed on October 23, 2026. A capability is marked **Confirmed** only when an official source explicitly describes it. **Not confirmed** means that the reviewed public sources do not establish the capability; it does not mean that the product lacks it.

## Systems

1. **SENET** — cloud software for managing gaming centres, with a player mobile application and web portal.
2. **ggLeap** — esports-venue management software with a player web portal and integrated booking.
3. **LANGAME** — gaming-club software and a consumer application/aggregator for finding clubs and booking stations.

## Comparison matrix

| Criterion | SENET | ggLeap | LANGAME |
|---|---|---|---|
| 1. Visitor self-service booking | **Confirmed.** Players can book PCs and consoles through the SENET ID portal or mobile app. | **Confirmed.** Players can reserve PCs online through the player web portal; the portal can be linked or embedded. | **Confirmed.** Visitors can book gaming-club stations through the website or mobile application. |
| 2. Specific station selection | **Confirmed.** The booking module and venue map expose PCs/consoles and booking state. | **Confirmed.** The system supports selecting one or several devices during booking. | **Confirmed.** The application opens a club map and allows selection of a specific PC. |
| 3. Group booking / adjacent stations | **Confirmed.** Official SENET documentation states that group booking of multiple PCs or consoles is supported. Adjacency rules are not confirmed. | **Confirmed.** Customers can book multiple PCs; explicit automatic adjacency rules are not confirmed. | **Confirmed.** Users can reserve several stations for themselves and friends. Automatic adjacency rules are not confirmed. |
| 4. Mobile visitor access | **Confirmed.** SENET ID is available as a mobile app and web portal. | **Confirmed for web.** A player web portal is documented. A dedicated mobile application for booking was not confirmed in the reviewed sources. | **Confirmed.** The consumer mobile app supports club search and booking. |
| 5. Admin booking calendar and resource state | **Confirmed.** Admin map, booking list/timeline, device status, pricing, cancellation, reminders, and reports are documented. | **Confirmed.** Web Admin provides agenda/grid views, calendar scheduling, device selection, locking rules, and booking management. | **Partially confirmed.** Management software and online booking are documented, but the reviewed public pages do not describe the administrator calendar in enough detail. |
| 6. Cancellation and modification by visitors | **Confirmed for cancellation/status.** Official material describes booking cancellation and Active/Cancelled/Expired states; detailed visitor-side modification rules depend on venue settings. | **Partially confirmed.** Admin booking editing and booking settings are documented; a visitor self-service cancellation flow was not confirmed in the reviewed sources. | **Limited.** The official FAQ says a booking cannot be rescheduled in the app and the visitor must contact the club; cancellation rules are venue-dependent. |
| 7. Events and tournaments | **Not confirmed as a visitor calendar** in the reviewed SENET booking sources. | **Confirmed.** Event Builder, competitions, challenges, quests, and event-related bookings are documented. | **Confirmed at platform level.** The application and portal include gaming and esports content; a club-specific event-management workflow was not confirmed. |
| 8. Reporting and analytics | **Confirmed.** Real-time reports, analytics, booking reports, activity logs, and device/session information are documented. | **Confirmed.** Venue management, web administration, integrations, and booking administration are documented; exact report coverage depends on configuration. | **Partially confirmed.** Business control and management are advertised, but the reviewed public visitor pages do not specify report structure. |
| 9. Multi-venue discovery and comparison | **Confirmed for connected venues.** A SENET ID account can connect to venues and switch between them; the sources do not establish a broad public aggregator with comparable station specifications. | **Confirmed for an operator's branches.** Visitors can check availability at multiple locations belonging to a venue organisation. A cross-provider aggregator is not confirmed. | **Confirmed.** LANGAME operates a catalogue/aggregator with club pages, prices, equipment information, reviews, maps, and online booking. |

## Findings

### Common capabilities

All three systems confirm the market need for advance gaming-station booking. Each connects booking to a venue-specific station or device model rather than treating a booking as a generic appointment. Each also connects the visitor experience with operational software used by the club.

### Relevant strengths

- **SENET** provides the strongest publicly documented integration between visitor booking, device state, venue operations, payments, and reporting.
- **ggLeap** provides detailed booking controls for employees and customers, including multiple-device bookings, resource-lock behaviour, web embedding, payments, and competition features.
- **LANGAME** provides the clearest consumer discovery experience: users can find multiple clubs, compare club information, open a venue map, and reserve particular stations or several stations for a group.

### Limitations identified from public evidence

- Public product descriptions do not consistently document conflict-handling behaviour when availability changes between selection and confirmation.
- None of the reviewed sources clearly confirms automatic selection of adjacent stations using a formal adjacency rule.
- Visitor-side cancellation and rescheduling rules vary by system and venue; LANGAME explicitly directs users to club administrators for rescheduling.
- Cross-product comparisons of exact prices, regional payment support, data portability, and API limits would require quotations, trial accounts, or vendor confirmation and are therefore outside this evidence set.

## Why CyberSeat is still justified

CyberSeat is not intended to reproduce every venue-management function of mature commercial platforms. Its academic and practical focus is a transparent reservation workflow for local esports centres, with the following design priorities derived from the user discussions and comparison:

1. show station specifications, prices, location, and real-time availability before confirmation;
2. support individual and group selection, including visibly adjacent stations;
3. revalidate availability immediately before confirmation and explain conflicts;
4. allow visitors to view and cancel their own reservations with explicit rules;
5. expose loading, empty, validation, server-error, and connection-loss states;
6. combine a visitor event calendar with club-level administrative scheduling and reports;
7. enforce role-based access and consistent booking rules in one documented system;
8. evaluate the proposed workflow against measurable usability and correctness criteria.

The project therefore has a distinct evaluation target: whether a focused, clearly documented prototype and later implementation can reduce the communication delays and uncertainty reported by the interviewed visitors while preserving reliable administrative control.

## Sources

1. SENET, *Gaming Centers — Venue Management Software*. https://senet.cloud/gaming-centers
2. ENESTECH Software, *SENET Changelog* (booking timeline, booking cancellation, statuses, SENET ID, group booking, admin booking and reports). https://enestech.zendesk.com/hc/en-gb/articles/26052144991516-Changelog-Last-updated-Oct-14-2026
3. SENET, *Mobile App*. https://new-stage.senet.cloud/mobile-app
4. ggCircuit, *ggLeap — Esports Venue Management Software*. https://www.ggcircuit.com/ggleap
5. ggCircuit Knowledge Base, *ggLeap Booking System*. https://helpdesk.ggcircuit.com/en/article/ggleap-booking-system-18m36ss/
6. ggCircuit, *Introducing the New Esports Booking System*. https://blog.ggcircuit.com/2023/05/02/ggcircuit-introduces-its-new-esports-booking-system/
7. LANGAME, *Computer Club Software*. https://langame.ru/en/software
8. LANGAME, *Gaming Clubs and Online Booking*. https://langame.ru/
9. LANGAME, *Booking Application*. https://langame.ru/app

## Review checklist

- [x] Three directly relevant systems compared.
- [x] Nine common criteria applied consistently.
- [x] Claims tied to official sources.
- [x] Unknown capabilities described as not confirmed rather than absent.
- [x] Need for CyberSeat explained using comparison and user evidence.
- [ ] Comparison reviewed by another team member.
- [ ] GitHub branch, commit, and Pull Request created.
- [ ] Result, commit, and Pull Request links added to ECR-5.
