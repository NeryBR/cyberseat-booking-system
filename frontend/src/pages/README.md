# Screen composition

Owner: Mansur. Future route-level pages compose domain features and shared UI.

| Screen group | Scenario basis | Required states |
|---|---|---|
| Catalogue and club details | SC-01 | Loading, filter results, no results, retryable failure |
| Interval and station selection | SC-02 | Invalid interval, club zone, free/occupied/unavailable text statuses |
| Confirmation and own reservations | SC-03 through SC-05 | Sending, confirmed result, conflict, uncertain response, cancellation |
| Event calendar | SC-06/13 | Published/cancelled event information and empty period |
| Assigned-club administration | SC-07 through SC-12 | Access denied, schedule/maintenance conflict and defined reports |
| Club/assignment management | SC-14 | System-admin-only operations and explicit save errors |

Paths and visual details must be agreed with the UX prototype before route files are added. Preserve selected parameters across authentication where appropriate, then revalidate against the server.
