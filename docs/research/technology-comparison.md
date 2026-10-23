# CyberSeat - Technology Comparison and Decision Record

Version 1.1 | October 23, 2026 | Owner: Aibekuly Alibi | [ECR-6](https://nerybr.youtrack.cloud/issue/ECR-6)

Status: proposed decisions, team agreement confirmed by Alibi on October 23, 2026. No technology benchmark or implementation is claimed; team agreement is recorded from Alibi's report. The baseline matches the current README.

## 1. Evaluation basis

Priorities are reservation integrity (BR-04/09), explicit authorisation (NFR-02), reproducible testing (NFR-01/08), a browser-based interface and manageable integration for a three-person diploma team. Ratings below are qualitative engineering judgements, not measurements. Team expertise has not been independently measured and is not used to invent numerical scores. All candidates can support a correct design; none makes the reservation transaction correct automatically.

## 2. Server platform: FastAPI, Django and NestJS

| Criterion | FastAPI / Python | Django / Python | NestJS / TypeScript |
|---|---|---|---|
| API contract and validation | Type-based request/response models and OpenAPI integration | Structured web framework; an API layer can be added, with serializer and contract choices to make | Controllers, DTO validation, modules and OpenAPI integration available |
| Administrative foundation | Custom admin screens, authorisation and session integration required | Built-in admin, authentication and ORM reduce common administrative setup | Guards and modules support access policies; persistence and admin UI still chosen separately |
| Booking consistency | SQLAlchemy/driver transaction and PostgreSQL constraints required | ORM transactions available; domain rules and appropriate constraints still required | ORM/driver transactions required; JavaScript execution does not solve cross-worker races |
| Team integration | Clear typed HTTP contract with React; two languages across client/server | Strong fit if conventional data management dominates | Shared TypeScript language across client/server; language familiarity remains to be confirmed |
| Main tradeoff | Lean API construction, but more security/admin composition work | More integrated conventions; custom booking workflow still needs application-specific design | More module/DTO setup and a different backend toolchain from the current baseline |

**Proposed decision D1:** retain FastAPI because a separately developed React client and explicit reservation API are central to the current design. Use request validation and generated API documentation to reduce integration ambiguity. Do not infer a latency advantage from vendor feature descriptions. Django is a credible fallback if the team prefers its integrated administrative foundation. NestJS becomes preferable if confirmed backend TypeScript expertise outweighs switching cost. Revisit D1 before implementation if Nurali cannot support the proposed security/admin composition.

Primary sources: [FastAPI features](https://fastapi.tiangolo.com/features/), [Django transactions](https://docs.djangoproject.com/en/5.2/topics/db/transactions/), [Django admin](https://docs.djangoproject.com/en/5.2/ref/contrib/admin/), [NestJS documentation](https://docs.nestjs.com/). Consulted October 23, 2026; versioned pages are reference editions, not claims of the newest available release.

## 3. Storage: PostgreSQL, MySQL and MongoDB

| Criterion | PostgreSQL | MySQL / InnoDB | MongoDB |
|---|---|---|---|
| Time-interval model | Native timestamp ranges and overlap operators | Start/end columns with explicit overlap predicates | Start/end fields and application-defined predicates |
| Declarative no-overlap rule | GiST exclusion constraint can combine station equality and range overlap | Scalar unique keys do not express arbitrary interval overlap; use an explicit transactional locking design | Unique indexes likewise do not express arbitrary interval overlap; schema and transaction protocol must prevent conflicts |
| Transactions and coordination | Row locks and serialisable isolation; range constraint complements the application protocol | InnoDB transactions and locking support a correct solution when consistently applied | Single-document atomicity and multi-document transactions supported; deployment and data modelling choices matter |
| Relationships/reporting | Foreign keys and SQL fit clubs, stations, owners, assignments and utilisation queries | Relational model also fits the domain well | Flexible documents, but related booking/schedule/reporting records require explicit consistency design |
| Main tradeoff | PostgreSQL-specific range features and operational setup | More custom interval-integrity logic to demonstrate | Less direct fit for this relational scheduling invariant; not excluded because of a false lack-of-transactions claim |

**Proposed decision D2:** PostgreSQL. Its interval constraint makes the central invariant visible and independently enforceable. `tstzrange` values use `[)` bounds; `btree_gist` may be needed for station equality in the exclusion index. A partial constraint applies only to `CONFIRMED` reservations. This covers booking-versus-booking overlap, not maintenance in another table or working-hours containment. Those rules require the shared guards described in the [architecture](../diagrams/architecture.md). MySQL and MongoDB remain viable with an alternative proven protocol; no unsupported performance ranking is asserted.

Primary sources: [PostgreSQL 18 range types](https://www.postgresql.org/docs/18/rangetypes.html), [PostgreSQL 18 locking](https://www.postgresql.org/docs/18/explicit-locking.html), [MySQL 8.4 InnoDB locking](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html), [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/). Consulted October 23, 2026.

## 4. Component interaction: REST, GraphQL and gRPC

| Criterion | REST over HTTP with JSON | GraphQL | gRPC |
|---|---|---|---|
| Browser integration | Direct fetch/client calls with explicit endpoints | Browser clients can request shaped data through a typed schema | Browser use needs a compatible web integration; native gRPC targets service RPC |
| Contract | OpenAPI documents operations, bodies and status codes | Schema plus query/mutation validation | Protocol Buffers and generated service/client contracts |
| Core workflow fit | Catalogue reads and create/cancel commands are straightforward | Flexible catalogue composition, but per-field authorisation and query limits need attention | Strong typed service interaction; little current need for internal service RPC in a monolith |
| Failure/retry semantics | Explicit HTTP statuses and application operation key | Domain errors and retry identity still application responsibilities | Deadlines and status model help RPC; retries still need business-level deduplication |
| Complexity for this scope | One browser API and generated documentation | Additional resolver/query design without an established need | Additional browser transport/tooling without planned independent backend services |

**Proposed decision D3:** REST with a versioned `/api/v1` contract and OpenAPI. Use 409 for a valid request conflicting with current state, 422 for validation and 401 for missing/expired authentication. Foreign own-reservation IDs return 404. POST creation is made replay-safe by the application protocol, not by the HTTP method itself. Availability refresh is sufficient for the core scope; WebSockets or server push can be reconsidered if user evidence establishes a real need.

Sources: [HTTP semantics, RFC 9110](https://httpwg.org/specs/rfc9110.html), [GraphQL specification, October 2021 reference edition](https://spec.graphql.org/October2021/), [gRPC introduction](https://grpc.io/docs/what-is-grpc/introduction/). Consulted October 23, 2026. These sources describe mechanisms; the suitability judgement is this project's decision.

## 5. Client and deployment alignment

**D4, existing baseline:** React, TypeScript and Vite for visitor/admin interfaces. React's component model and TypeScript's static checks fit reuse across catalogue, forms and admin views, but do not validate incoming data or authorise requests. Vue with TypeScript is a credible component-based alternative; server-rendered templates reduce a separate client build but fit less directly with the existing interface ownership and API plan. Keeping the documented baseline avoids a speculative redesign. Sources: [React documentation](https://react.dev/learn), [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [Vue guide](https://vuejs.org/guide/introduction.html).

React/TypeScript appears in the current README and ECR-1 interface baseline. **Alibi confirmed on October 23, 2026 that his teammates agree with the prepared materials**, including this comparison. The agreement is recorded from Alibi's report rather than a separate GitHub review. Before implementation, request review of forms, error handling, API models and accessibility behaviour.

**D5, provisional tooling:** SQLAlchemy with Alembic migrations, Pytest for real-DB integration tests, Playwright for browser scenarios and k6 for load generation, consistent with the README. Pin compatible versions only after the first reproducible environment is validated. Docker Compose will describe the local client/API/database environment. It is sufficient for a demo, but does not establish production availability, backups or disaster recovery.

## 6. Cross-cutting decisions and reconsideration triggers

| Decision | Requirement served | Cost / risk | Revisit when |
|---|---|---|---|
| Modular monolith with one transactional database | BR-04/09, NFR-08 | Coupled deployment and shared schema | Independently deployable teams or measured scale requirements appear |
| Club guard then station guard for state-changing transactions | BR-09/10 | Contention; every writer must comply | NFR-04 benchmark fails or administrative batch writes become common |
| PostgreSQL overlap constraint as defence in depth | BR-04/05 | Database-specific migration | A different DB becomes mandatory and equivalent safety is demonstrated |
| Durable owner + operation-key deduplication | BR-06/11 | Storage and reconciliation contract | Retention/deletion policy is introduced |
| REST/OpenAPI | BR-03/07/08, NFR-08 | Some view-specific request composition | Measured over-fetching or integration requirements justify GraphQL or push |

The first implementation spike must prove migration support, concurrent creation, maintenance coordination, cancellation, and replay after response loss on actual PostgreSQL. Framework validation and an in-memory SQLite test cannot substitute for that evidence. Authentication/session choice, deployment host, exact versions and measured resource requirements remain open implementation decisions. Reviewer requested: Mansur for D4/API interaction; Nurali for D1 and administrative transaction use. Team agreement confirmed through Alibi's report on October 23, 2026.
