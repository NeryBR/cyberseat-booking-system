# Prototype checks

These checks exercise the local ECR-9 simulation. They are separate from future application tests in `backend/tests/`, `frontend/tests/` and `tests/`.

## Model checks

From the repository root with Node.js installed:

```sh
node --check docs/ux/prototype-model.js
node --check docs/ux/prototype.js
node --test docs/ux/tests/prototype-model.test.cjs
```

Observed October 24, 2026: 12 checks passed. They cover interval boundaries, replay, cancellation, own-record filtering and maintenance conflict examples. JavaScript in-memory checks do not prove real database integrity, concurrency safety or access security.

## DOM integration checks

The optional DOM checks use jsdom. Install it in an external QA directory, not inside the application scaffold. The recorded run used jsdom 30.1.3 and Node.js 24.15.0; check your installed versions when reproducing.

```powershell
npm install --prefix C:/path/to/ux-qa jsdom@30.1.3 --no-audit --no-fund
$env:CYBERSEAT_QA_MODULES = 'C:/path/to/ux-qa/node_modules'
node --test docs/ux/tests/prototype-dom.test.cjs
```

Observed October 24: 11 checks passed. The test harness supplies DOM-only stand-ins for native dialog opening/closing and scrolling. It evaluates the actual local scripts and user-action transitions, not screenshots, layout, real modal focus trapping or browser compatibility.

Before independent acceptance, review at 360px and desktop widths in an actual browser: no page overflow, readable controls, all screens reachable, keyboard navigation, native Escape/focus return, reduced motion and all normal/recovery flows. No participant usability session or WCAG conformance result is recorded.
