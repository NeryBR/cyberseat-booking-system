# Frontend verification

Owner: Mansur. Future Vitest/Testing Library tests belong here when the client exists. There are no executable component tests in this scaffold.

Verify behaviour users observe: invalid intervals, textual station statuses, preserved input after failure, conflict recovery, cancellation confirmation and unknown-response handling. Do not merely assert internal implementation details.

Browser journeys that require the real API belong under [`../../tests/e2e/`](../../tests/e2e/README.md). Record commands, runner setup and the division between mocked contract checks and actual-backend checks when introducing the first test suite.
