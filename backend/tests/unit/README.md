# Unit checks

Put future tests for pure interval overlap, half-open boundaries, club minimum duration, state transitions and input-normalisation rules here. Avoid database/HTTP dependencies in a test described as a unit test.

Examples to implement: adjacent intervals do not overlap, containment does overlap, invalid/non-finite intervals are rejected and cancelled history does not imply active occupancy. Database race safety must still be verified separately; unit helpers alone cannot prove BR-04 or BR-09.
