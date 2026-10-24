# Identity and access

Primary owner: Nurali. Future authentication/session integration, reservation-owner checks and assigned-club policies belong here.

Every protected operation must check the actor and requested object. Visitors may access only their own bookings; administrators operate only on assigned clubs. Coordinate assignment revocation with the transaction guards used by the affected writes. Choose and document the final authentication mechanism in the implementation; it is not provided by this scaffold.

Trace: SC-07/14, BR-07/08 and NFR-02. Full administrative permissions remain ECR-8.
