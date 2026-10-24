# Domain interactions

Owner: Mansur, with backend contract review by Alibi and Nurali.

Future feature folders can follow the interaction rather than a generic file type: `catalogue`, `booking`, `personal-reservations`, `administration` and `events`. Create each when it contains an implementation; this scaffold does not add empty screens.

- Catalogue/selection keeps filters and chosen club/time/station separate from server-confirmed occupancy.
- Booking creates one operation key per logical attempt and preserves that identity across safe retries.
- Own-reservation views do not accept a client-supplied owner as an authority.
- Administration handles rejected schedule and maintenance changes without silently cancelling another visitor's booking.
- Event interactions remain informational and do not register tournament entrants or reserve stations.

Keep feature-specific components, state and request mapping together. Reuse `shared/api/` and `shared/ui/`; avoid importing another feature's internal files as an undocumented dependency.
