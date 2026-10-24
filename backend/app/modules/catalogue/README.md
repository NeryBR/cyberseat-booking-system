# Clubs and stations

Primary owner: Nurali. Own club identity, location, station type/specifications, active state and IANA club time zone. Expose catalogue reads for the frontend and booking service.

This module does not turn a displayed free station into a confirmed booking. Route any station-status or club-configuration mutation through the shared coordinator and preserve confirmed future bookings. Define deletion/retention policy before adding destructive endpoints.

Trace: SC-01/02/08, BR-01/02/14. Alibi coordinates shared schema changes in ECR-12.
