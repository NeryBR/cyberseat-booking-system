# Reusable accessible UI

Owner: Mansur. Reusable form fields, buttons, status labels, confirmation dialogs, loading/empty/error views and layout primitives belong here as they are implemented.

Core requirements: visible keyboard focus, meaningful labels, field-level error explanations, text in addition to colour, sensible disabled/sending states and no keyboard traps. Design core flows for narrow mobile and desktop layouts. WCAG 2.2 AA is a design target, not a conformance claim for this scaffold.

Keep booking rules and API calls out of generic UI controls. A generic error component must allow uncertain operation outcome to be described without falsely saying the operation failed.
