# Club operations

Primary owner: Nurali. Implement assigned-club working hours, maintenance intervals and approved administrative reservation operations here.

Booking and maintenance share the same station guards. Working-hours and club-state changes use the club guard before inspecting affected bookings. Reject a conflicting change rather than silently cancelling a confirmed reservation. Any permitted administrative status change needs explicit rules and an audit record.

Trace: SC-08 through SC-11, BR-09/10 and ECR-8/ECR-23. Coordinate database and overlap rules with Alibi and interface behaviour with Mansur.
