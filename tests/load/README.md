# Load and contention workloads

Owner: Alibi; evaluation coordination: Nurali. Future k6 scripts belong here. Preserve the [NFR measurement conditions](../../docs/requirements/booking-and-nfr.md) or document an agreed revision before comparing results.

Separate ordinary browsing/booking traffic from deliberate contention on one station. Record seed size, request mix, virtual users, achieved throughput, warmup/duration, host resources, API/database versions, commit and raw result location. Expected 409 domain conflicts are not unexpected server failures.

Check final database invariants as well as latency/error metrics. No measured performance result or executable load script is included in this scaffold.
