# CyberSeat — User and Administrator Scenarios

Version 1.1 · October 23, 2026 · [ECR-1](https://nerybr.youtrack.cloud/issue/ECR-1)

Document owner: Mansur Urynbassar. Status: revised design baseline with Alibi's approval in PR #7; see the [October 24 review and agreement record](../project/team-review-2026-10-24.md). The previous version reported team agreement on October 23, 2026; this statement does not constitute a recorded GitHub review.

## Purpose and Scope

This document defines the expected behavior of the proposed CyberSeat system and provides a basis for the functional requirements, use-case model, UX mockups, and subsequent system evaluation. It is part of the first submission due by **6:00 PM on October 24, 2026**. This deadline applies to the project documentation and design materials; it does not require every described feature to be implemented by that date.

The document is based on the CyberSeat README and the project justifications prepared by the three team members. Visitor needs are supported by the three discussions documented in [user-needs evidence](../research/user-needs-evidence.md). Administrative needs remain assumptions pending administrator research. Prototype evaluation remains a future activity. Online payment, a loyalty programme, and hardware management are outside the mandatory scope.

## Roles and General Rules

| Role | Access scope |
|---|---|
| Guest | Browse clubs, gaming-station specifications, availability, and published events |
| Registered visitor | Create, view, and cancel only their own reservations; view the event calendar |
| Club administrator | Manage stations, schedules, reservations, events, and reports for assigned clubs |
| System administrator | Manage clubs and administrator assignments |

Dates and times shall be displayed in the selected club's time zone, which shall be clearly identified in the interface. Availability depends on the club's working schedule, active reservations, and unavailable intervals. A station shown as available may become unavailable before confirmation; therefore, the server shall perform the final availability check. A missing server response shall not be interpreted as either a successful or a failed reservation. Cancelled reservations shall remain in the history.

The following scenarios define team-approved behavior for the proposed system. They are design and acceptance criteria, not claims that the application has already been implemented or tested.

## SC-01. Browse Clubs and Gaming Stations

**Actor:** Guest or registered visitor  
**Preconditions:** The catalogue is available.  
**Trigger:** The user opens the club catalogue.

1. The user browses the available clubs and applies station-related filters.
2. The user selects a club and opens its details page.
3. The user reviews the address, equipment, working hours, and gaming-station layout.

**Expected result:** A club is selected for an availability search; no reservation is created.

**Alternative and error flows:** An empty catalogue or no matching results shall be explained and accompanied by an option to change the filters. A loading failure shall display an error message and a retry action.

**Acceptance criteria:** Applied filters remain visible; an empty result is distinguishable from a loading error; the selected club is clearly identified. At the design stage, the floor layout may be represented by a mockup.

## SC-02. Select a Date, Time, and Available Station

**Actor:** Guest or registered visitor  
**Preconditions:** A club has been selected.  
**Trigger:** The user starts selecting a visit interval.

1. The user enters a date, start time, and end time.
2. The system validates the interval and requests current availability.
3. The system displays available, occupied, and unavailable stations together with their specifications.
4. The user selects an available station and proceeds to confirmation.

**Expected result:** The club, station, and time interval are selected, but availability is not yet guaranteed.

**Alternative and error flows:** Missing values, an end time earlier than the start time, and invalid times shall be identified next to the relevant fields. If the interval is outside working hours, the system shall request another interval. If no station is available, the user may change the time or club. Availability data from a previous interval shall not be used after the interval changes.

**Acceptance criteria:** Every station status is communicated through both text and colour; the time zone is visible; a blocked station cannot be selected as available; a loading state is distinguishable from an empty result.

## SC-03. Confirm a Reservation

**Actor:** Registered visitor  
**Preconditions:** The user is authenticated and has selected a club, station, and interval. A guest must sign in before confirmation.  
**Trigger:** The user opens the reservation confirmation screen.

1. The user reviews the club, station, date, start time, end time, and time zone.
2. The user selects **Confirm reservation**.
3. The server rechecks access rights, working hours, unavailable intervals, and overlaps with active reservations.
4. If the reservation is saved, the system displays its identifier and details.
5. The user opens the new reservation in the personal account.

**Expected result:** Exactly one confirmed reservation belongs to the current user and occupies the selected interval.

**Alternative and error flows:** If the station becomes unavailable before confirmation, the system shall not create a conflicting reservation and shall offer another station or time. An expired session shall require the user to sign in again. If the connection is lost after submission, the interface shall display an uncertain outcome and request an updated reservation list; it shall not claim success without server confirmation.

**Acceptance criteria:** Concurrent overlapping requests for the same station shall result in no more than one active reservation. Client-side validation shall not replace the server-side check. Repeated submission shall be disabled while a request is pending, and the API shall prevent duplicate reservations when a request is retried after a connection failure.

## SC-04. View Personal Reservations

**Actor:** Registered visitor  
**Preconditions:** The user is authenticated.  
**Trigger:** The user opens the personal account.

1. The user opens active reservations or reservation history.
2. The user selects a record and reviews the club, station, interval, and status.
3. If permitted, the user proceeds to reservation cancellation.

**Expected result:** The user receives current information about their own reservations.

**Alternative and error flows:** If no records exist, the interface shall show an empty state. A loading error shall not be presented as an empty list. A request for another user's reservation shall be rejected without disclosing its data.

**Acceptance criteria:** Other users' reservations are absent from the list and inaccessible by identifier; cancelled records remain in history; dates and statuses remain readable on mobile screens.

## SC-05. Cancel a Personal Reservation

**Actor:** Registered visitor  
**Preconditions:** The user owns an active reservation and its start time has not passed.  
**Trigger:** The user selects the cancellation action.

1. The user reviews the selected reservation.
2. The user confirms the cancellation.
3. The server verifies ownership and the current reservation status and records the cancellation.
4. The interface displays the updated status, while the record remains in history.

**Expected result:** The cancelled reservation no longer occupies the interval. The station becomes available unless another restriction applies.

**Alternative and error flows:** Closing the confirmation dialog shall make no change. An already cancelled reservation shall display its current status. After a connection failure, the client shall request the latest status before repeating an action. A user shall not be able to cancel another user's reservation.

**Acceptance criteria:** Cancellation does not delete the history record; availability changes only after server confirmation. Once the reserved interval has started, the status may be changed only by an authorised club administrator in accordance with club rules, with the action recorded in the audit log.

## SC-06. View the Event Calendar

**Actor:** Guest or registered visitor  
**Preconditions:** The event calendar is available.  
**Trigger:** The user opens the events section.

1. The user selects a period and, where supported by the interface, a club.
2. The user browses events and opens a selected event.
3. The user reviews its title, description, location, date, time, and time zone.

**Expected result:** The user receives current event information. Tournament registration and payment are outside this scenario.

**Alternative and error flows:** A period with no events shall be distinguished from a loading error. A cancelled event shall be retained with a clear cancelled status rather than displayed as active. Updated details shall be shown when the event is reopened.

**Acceptance criteria:** The calendar and event details display consistent dates; the user can return to the previously selected period; published club events are available to guests and registered visitors.

## SC-07. Access the Club Administration Area

**Actor:** Club administrator  
**Preconditions:** The user is authenticated and assigned to at least one club.  
**Trigger:** The user opens the administration area.

1. The system verifies the administrative role.
2. The system displays the clubs assigned to the administrator.
3. The administrator selects a club and opens its management sections.

**Expected result:** Management functions are available only within the administrator's authorised scope.

**Alternative and error flows:** A visitor shall not receive administrative data. A direct request for an unassigned club shall be rejected. After an assignment is revoked, the next operation shall require a new authorisation check.

**Acceptance criteria:** Access restrictions are enforced by the server, including direct requests using resource identifiers; the interface clearly identifies the currently selected club.

## SC-08. Manage Gaming Stations

**Actor:** Club administrator  
**Preconditions:** An assigned club is open in the administration area.  
**Trigger:** The administrator opens the gaming-station section.

1. The administrator creates a station or selects an existing station.
2. The administrator enters or edits its label and specifications.
3. The administrator reviews the data and saves the changes.
4. The system updates the station representation.

**Expected result:** The club catalogue contains current station information.

**Alternative and error flows:** Required fields and duplicate labels shall be validated. A saving failure shall not be presented as success. A station with existing reservations may be deactivated, but its reservations and history shall not be silently deleted.

**Acceptance criteria:** An administrator cannot edit a station belonging to an unassigned club; saved specifications match the information shown to visitors; existing reservations remain linked to the station.

## SC-09. Update the Working Schedule

**Actor:** Club administrator  
**Preconditions:** The administrator has access to the selected club's schedule.  
**Trigger:** The administrator edits the working intervals.

1. The administrator defines working intervals and verifies the club's time zone.
2. The system validates the data and identifies affected active reservations.
3. If no conflict exists, the system saves the schedule.
4. Subsequent availability searches use the updated schedule.

**Expected result:** New reservations comply with the current working schedule.

**Alternative and error flows:** Invalid intervals shall not be saved. If a change conflicts with an active reservation, the system shall reject the change and identify the conflict. An existing confirmed reservation shall never be cancelled silently.

**Acceptance criteria:** A conflict shall not leave a partially updated schedule; saved changes are applied by the server-side reservation check.

## SC-10. Block a Station for Maintenance

**Actor:** Club administrator  
**Preconditions:** A station belonging to an assigned club has been selected.  
**Trigger:** The administrator creates an unavailable interval.

1. The administrator enters the start, end, and reason for the block.
2. The server validates the interval and checks active reservations.
3. If the interval is valid and conflict-free, the server saves the block.
4. Visitors see the station as unavailable during the specified interval.

**Expected result:** A conflicting reservation cannot be created during the maintenance interval.

**Alternative and error flows:** If an active reservation conflicts with the proposed block, the system shall reject the block and preserve the reservation. Concurrent reservation and blocking requests shall not both receive contradictory confirmations. Removing a block shall not remove other availability restrictions.

**Acceptance criteria:** The unavailable interval is enforced by the server for direct reservation requests, not only by the floor-layout interface; failed operations are clearly reported.

## SC-11. View Club Reservations

**Actor:** Club administrator  
**Preconditions:** The administrator has access to the selected club.  
**Trigger:** The administrator opens the schedule or reservation section.

1. The administrator selects a date or period and, if necessary, a station.
2. The administrator reviews reservations and their statuses.
3. The administrator opens a record to verify its interval and station.

**Expected result:** The administrator can assess the workload of the assigned club.

**Alternative and error flows:** No reservations shall be distinguished from a loading failure. Data from unassigned clubs shall be inaccessible. Only personal data required to service a reservation shall be displayed.

**Acceptance criteria:** Cancelled reservations shall not appear as occupied intervals; the server shall enforce the selected-club scope. Administrative changes to a visitor's reservation shall follow club rules and be recorded in the audit log.

## SC-12. View a Club Report

**Actor:** Club administrator  
**Preconditions:** The administrator has access to reports for the selected club.  
**Trigger:** The administrator selects a report.

1. The administrator selects a club and reporting period in the club's time zone.
2. The administrator requests reservation and utilisation indicators.
3. The system displays the results, reporting period, and calculation definitions.

**Expected result:** The administrator receives approved indicators for the selected period.

**Alternative and error flows:** An invalid period shall require correction. A lack of data shall be explained. A calculation error shall not be represented as a valid zero value.

**Acceptance criteria:** Calculations shall be compared with a controlled data set. Cancelled reservations shall be reported separately and excluded from occupied intervals. The utilisation denominator shall be the station time available within the club's working schedule after approved unavailable intervals are excluded. Financial reporting is outside scope unless a pricing model is approved separately.

## SC-13. Manage Club Events

**Actor:** Club administrator  
**Preconditions:** The administrator has access to events for the selected club.  
**Trigger:** The administrator creates or edits an event.

1. The administrator enters the title, description, location, date, and time.
2. The administrator reviews the data and saves the event.
3. The administrator verifies its appearance in the calendar.
4. When an event changes or is cancelled, the administrator updates its published record.

**Expected result:** Visitors receive current event information.

**Alternative and error flows:** Required fields and time intervals shall be validated. An administrator shall not modify an event belonging to an unassigned club. A saving failure shall not be presented as a published update.

**Acceptance criteria:** The calendar and event details show the saved information; a cancelled event remains in history with a cancelled status; creating an event does not automatically block gaming stations.

## SC-14. Manage Clubs and Administrator Assignments

**Actor:** System administrator  
**Preconditions:** The user has system-administrator privileges.  
**Trigger:** The user opens club management.

1. The system administrator creates or opens a club and reviews its primary details, including its time zone.
2. The system administrator selects a user for assignment to a specific club.
3. The system administrator saves a new assignment or revokes an existing assignment.
4. The system displays the updated assignment list.

**Expected result:** Administrative permissions are associated with specific clubs.

**Alternative and error flows:** A club administrator shall not grant themselves additional privileges. Validation and saving errors shall be clearly displayed. Updating club information shall not damage reservation history.

**Acceptance criteria:** An assignment grants access only to the specified club; revocation applies to subsequent requests. Club deletion and bulk permission changes require separate requirements and are outside this scenario.

## Common Interface States

| State | Expected behavior |
|---|---|
| Loading | Display progress and do not present it as an empty result |
| No results | Explain the state and offer changes to filters or the selected period |
| Invalid input | Display a message next to the relevant field and preserve other valid values |
| Expired session | Request sign-in and do not expose protected data |
| Insufficient permissions | Reject the action without disclosing another user's or club's data |
| Server error | Clearly state that the operation failed and provide a safe retry action |
| No connection before submission | Do not show the operation as saved; preserve entered data where possible |
| No response after submission | Display an uncertain outcome and verify the result before allowing a retry |
| Availability conflict | Refresh availability and offer another station or time |

The UX mockups shall cover desktop and mobile layouts, use clear labels, and communicate statuses through more than colour alone. Validation of these states in a working application belongs to later implementation and evaluation stages.

## Traceability to ECR-1 and Subsequent Deliverables

| ECR-1 acceptance criterion | Coverage | UX mockup basis |
|---|---|---|
| Club, station, date, and time selection | SC-01–SC-02 | Catalogue, club details, interval and station selection |
| Reservation creation and conflict handling | SC-03 | Confirmation, success, conflict, and uncertain-response states |
| Personal reservation viewing and cancellation | SC-04–SC-05 | Personal account, reservation details, cancellation confirmation |
| Event calendar | SC-06 | Calendar and event details |
| Administrative operations | SC-07–SC-14 | Club selection, stations, schedules, blocks, reports, and events |
| Loading, errors, and connection loss | All scenarios and the common-state table | Relevant states for each principal screen |
| Team review of reservation and administrative behavior | Team Review Results below | Completed on October 23, 2026 |

SC-01–SC-05 form the principal visitor flow for the first UX mockup sequence. SC-07, SC-10, and SC-11 form the principal administrative flow. This document provides input for the requirements specification, use-case model, and prototype; it does not replace those separate deliverables.

## Agreed Team Decisions

| Topic | Approved decision |
|---|---|
| Interval boundaries | Reservations use the half-open interval `[start, end)`, so one reservation may end when the next begins. Minimum duration shall be configurable by the club. |
| Cancellation | A visitor may cancel their own reservation before its start time. Once the interval has started, status changes require an authorised club administrator and an audit-log entry. |
| Lost response during creation | The client shall request the current reservation list after reconnection. The API and database shall prevent duplicate reservations during retries. |
| Schedule or maintenance conflict | A proposed change that conflicts with an active reservation shall be rejected; the confirmed reservation shall be preserved. |
| Administrator actions on visitor reservations | Administrators may view reservations for assigned clubs. Any permitted status change shall follow club rules and be recorded in the audit log. |
| Reports | Indicators shall use an explicitly selected period in the club's time zone. Cancelled reservations shall be shown separately and excluded from occupied intervals. |
| Events | Administrators manage events for assigned clubs. Cancelled events remain in history with a clear status. |
| Authentication and personal data | Authentication is required to create and manage reservations. Administrators see only the personal data required to service a reservation. |

## Review history and current revision

- [x] Mansur Urynbassar reviewed the scenarios for consistency with the planned user and administrator interfaces.
- [x] Aibekuly Alibi reviewed SC-02–SC-05 and SC-09–SC-10, including reservation and conflict-prevention rules.
- [x] Akhmetov Nurali reviewed SC-07–SC-14, including access control, schedules, events, and reporting.
- [x] The team reviewed and approved the decisions concerning error handling, connection loss, and availability conflicts.
- [x] The document satisfies the expected result and acceptance criteria of ECR-1.
- [x] The document was published on GitHub through a dedicated branch and Pull Request.
- [x] Links to the document, commit, and Pull Request were added to ECR-1.

The checked entries above preserve the previous document's report of team agreement. Review of the correction revision is separately established by [Alibi-stack's approval of PR #7](https://github.com/NeryBR/cyberseat-booking-system/pull/7#pullrequestreview-5637591235) (commit `d7bae8ea9931bbdb8e4caec01c243f33c8cea493`). See the [October 24 review and agreement record](../project/team-review-2026-10-24.md); historical reported agreement and submitted GitHub review remain distinct. This document remains an input to the separate requirements, UML and UX deliverables.
