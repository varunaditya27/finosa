<div align="center">

# Development and Learning Roadmap

Status: draft plan. Progress is measured by verified capabilities and understanding, not by dates.

</div>

## 1. Strategy

Build one reliable vertical slice before widening scope:

React Native input, Node.js API, validated command, PostgreSQL transaction, correct dashboard read.

Then add event-based reactions, first in process for learning, then durable. Introduce an external broker and Kubernetes only after the simpler design's limits are visible.

**Releases:** v0.1 is milestones M0 to M6. M7 and later are later releases. Real login is a separate milestone, not yet numbered, that must finish before any real financial data or online hosting.

## 2. Milestones

### M0. Repository and product foundation

**Deliverables**
- GitHub repository, README, `.gitignore`, MIT licence, contributor workflow.
- The design docs in `docs/`, and ADRs as decisions are made.
- npm workspaces monorepo, strict TypeScript defaults, formatting, test runner, basic GitHub Actions.
- Synthetic-only sample data and a `.env.example` without secrets.

**Learn:** monorepo vs multi-repo, dependency isolation, reproducible builds, ADRs.

**Exit:** a fresh clone installs and tests; docs are navigable; no credentials committed.

### M1. Backend HTTP foundation

**Deliverables**
- Minimal Node.js + TypeScript server on plain `node:http` with Zod validation.
- Health endpoint, request validation, structured errors, correlation IDs, tests.
- Clear separation of route handler, application service, domain logic and repository.

**Learn:** Node runtime and event loop basics, async I/O, TypeScript types vs runtime checks, request lifecycle, error propagation.

**Exit:** tests cover valid and invalid requests; shutdown closes resources cleanly.

### M2. PostgreSQL and financial invariants

**Deliverables**
- Reproducible local PostgreSQL, migrations, seeded synthetic fixtures.
- Account and income/expense models using positive whole-paise amounts (`BIGINT`, INR only).
- Correction of a wrong amount, date or account by void and replace.
- Transaction listing, balances and monthly summaries.
- Integration tests for ownership, dates, amounts and consistency.

**Learn:** ACID transactions, constraints, indexing, migrations, isolation, basic idempotency.

**Exit:** summaries reconcile with the ledger; repeated commands cannot silently double-post.

### M3. Mobile-to-backend vertical slice

**Deliverables**
- React Native + Expo app (if chosen): account list, transaction entry, history, monthly overview.
- One built-in test user, local only. Real login is a separate milestone before any hosted or real-user exposure.
- Loading, error and empty states; secure API configuration.

**Learn:** client/server contracts, mobile state, network failure and retries, device security basics.

**Exit:** an end-to-end test records one transaction and displays it accurately.

### M4. Import and data integrity

**Deliverables**
- The FinOSA CSV template (date, description, amount, direction, optional reference; at most 1,000 rows and 1 MB) with preview, validation and user confirmation.
- Duplicate review, import-batch tracking, safe commit, reconciliation report.
- Transfers as two atomically linked transactions, added once the basic slice works.

**Learn:** parsing vs normalization, idempotency keys, transaction boundaries, partial failure.

**Exit:** importing the same file twice never silently doubles totals; legitimate look-alike expenses can be kept on purpose.

### M5. EDA fundamentals (in process)

**Deliverables**
- Event contract for `transaction.recorded.v1` and a local subscriber.
- Tests for publisher/consumer flow and failure modes.
- One small derived reaction, such as cache invalidation or an audit metric.

**Learn:** commands vs events, producer and consumer, coupling, process-local delivery limits.

**Exit:** can explain exactly which crashes lose an in-memory event, and why that is not enough for financial workflows.

### M6. Durable EDA and worker

**Deliverables**
- Transactional outbox written atomically with domain facts.
- Background worker, retry policy, idempotent consumer, processed-event tracking.
- Rebuildable projection, backlog metrics, failure-injection tests.

**Learn:** the dual-write problem, at-least-once delivery, retries, idempotency, eventual consistency, ordering and replay.

**Exit:** crash, retry and replay drills pass without corrupting financial totals.

### M7. First useful intelligence

**Deliverables**
- A rule-based categorization suggestion or recurring-transaction detector.
- Human review and correction, with confidence and justification recorded.
- Tests on synthetic labeled examples and a basic quality measure.

**Learn:** separating probabilistic inference from deterministic financial computation, event-triggered processing, measuring quality.

**Exit:** suggestions are visibly distinct from facts; false positives can be corrected safely.

### M8. Messaging comparison

**Deliverables**
- Choose RabbitMQ or Kafka using a written evaluation matrix.
- A broker adapter behind the existing publisher/consumer contract.
- Tests for retries, ordering, duplicate delivery, broker outage and worker scaling.

**Learn:** broker topology, acknowledgements, consumer groups and queues, backpressure, delivery semantics.

**Exit:** the broker adds measurable or educational value; failure behavior is documented.

### M9. Containers, Kubernetes, operations

**Deliverables**
- Container images for API and worker; a Docker Compose stack.
- Local Kubernetes manifests (Helm later), health and readiness checks, a rehearsed rolling deploy.
- Logs, metrics, resource limits, graceful shutdown, a database secrets strategy.

**Learn:** pods, deployments, services, config and secrets, scaling, persistent dependencies, rollout and rollback.

**Exit:** deploy, and recover from a worker restart, with no lost committed data and no silently duplicated processing.

### M10. Agentic financial assistance (later)

**Deliverables**
- Read-only natural-language questions grounded in validated tool outputs.
- Explicit provenance, boundaries, an evaluation set and tests for made-up answers.
- Rule-based affordability checks with labeled assumptions, if pursued.

**Learn:** tool boundaries, agent orchestration, retrieval from structured data, evaluation, safe action design.

**Exit:** no fabricated balances; the model cannot start payments or change financial truth without an explicit approved workflow.

## 3. GitHub workflow

**Labels:** `type:feature`, `type:bug`, `type:docs`, `type:test`, `area:api`, `area:mobile`, `area:data`, `area:events`, `area:infra`, `priority:p0`, `priority:p1`, `good-first-issue`.

**Branching and review**
- Protect `main` once CI exists. Use short-lived branches and pull requests, even when working alone.
- Each PR states why, what changed, how it was tested, and any data or migration impact.
- Keep commits small. Never commit secrets or real financial data.

**CI (once code exists):** install, typecheck, lint, unit tests, database integration tests, build. Add secret scanning and dependency updates when the workflow settles.

## 4. Definition of done for a feature

- Behavior and edge cases are written down.
- Validation and authorization are considered.
- Money math, duplicates and race conditions are tested where relevant.
- Structured errors and observability are in place.
- Docs and ADRs are updated if a design choice changed.
- A manual check or integration test demonstrates the full flow.

## 5. Learning checkpoints

Answer from first principles before moving on:

| Milestone | Question |
|---|---|
| M1 | What happens between an HTTP request reaching Node and the response leaving? |
| M2 | Why is a database transaction different from a transaction record? |
| M3 | Why must the server distrust values sent by the mobile app? |
| M4 | Why can identical descriptions and amounts be two real expenses? |
| M5 | Why can an event listener succeed and still lose work? |
| M6 | Why does the outbox still need idempotent consumers? |
| M8 | What changes when consumers run on different machines? |
| M9 | What does Kubernetes restart, and what does it not make durable? |
| M10 | Which financial outputs must never be computed by a generative model? |

## 6. Scope gates

- **AI:** blocked until v0.1 records and reports are correct.
- **Microservices:** blocked until independent scaling or deployment is needed.
- **Kafka and Kubernetes:** optional learning milestones after a reliable local worker.
- **Real financial data:** blocked until authentication, privacy, retention and a basic threat model exist.
- **Docs:** update them as decisions are made. Do not invent implementation detail to fill pages.

## 7. Next actions

1. Write ADRs 0001 (modular monolith), 0002 (HTTP layer) and 0003 (money representation) from the decisions already made.
2. Scaffold the workspace and API only. Prove one health endpoint before adding other infrastructure.
3. Implement the account and transaction model with tests before any AI layer.
