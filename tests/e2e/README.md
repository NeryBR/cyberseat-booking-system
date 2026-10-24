# End-to-end journeys

Future Playwright checks should exercise catalogue -> interval/station selection -> authenticated confirmation -> own history -> cancellation against the actual integrated app.

Include a stale availability conflict, session expiry, field validation, maintenance conflict visibility and response-loss reconciliation. Test narrow and desktop layouts and keyboard operation. Use separate synthetic accounts for visitor A/B, assigned/unassigned administrators and system administration.

Do not present a mocked browser demonstration as proof of database concurrency safety. Runner/browser versions, start/reset commands and evidence paths must be documented when these checks are implemented.
