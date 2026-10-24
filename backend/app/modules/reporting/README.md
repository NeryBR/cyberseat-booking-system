# Reporting and audit

Primary owner: Nurali. Implement assigned-club indicators, explicit report definitions and audit retrieval here. Persisted audit changes for successful mutations participate in the business transaction.

Define the reporting period, club zone, included statuses and available-station-minute denominator. Exclude cancelled bookings from occupied intervals and clip intervals to the selected period. Scheduled utilisation is not measured attendance. Compare indicators with hand-calculated synthetic fixtures and use a defined snapshot for multi-query reports.

Trace: SC-12, BR-15 and NFR-10. Reporting reads must not change reservation status.
