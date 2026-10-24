# Application composition

The future client entry point, route composition, global providers, shared layout and application-level error boundary belong here. Keep booking/admin business rules in their features and domain decisions on the server.

Coordinate visitor and administrative route boundaries with `src/pages/`. Route guards improve navigation but never replace API authorisation. Introduce global state only for genuinely shared concerns; do not keep a second permanent source of truth for server availability.

Owner: Mansur. Entry files and router selection are introduced and verified in ECR-21.
