<div align="center">

# Product Requirements

Status: draft. Release v0.1 is a working financial-data foundation with reliable event delivery (roadmap M0 to M6), not an AI adviser.

</div>

## 1. Outcome

A dependable way to enter or import personal transactions and understand spending across user-defined accounts, forming a base on which event-driven insights and AI can later be added safely.

## 2. Users and assumptions

**Primary user:** one person managing personal finances in India, starting with synthetic data and manual or CSV input. They may hold bank accounts, wallets and cash, and want clear categories and totals they can trust.

**Assumptions:** the phone is the main interface; a backend service is acceptable; no automatic bank-data access. v0.1 runs locally with one built-in test user and made-up data.

## 3. Scope by release

| Capability | v0.1 MVP | Next | Later |
|---|---|---|---|
| User-defined accounts | Yes | | |
| Manual transactions | Yes | | |
| CSV import with preview | One FinOSA template: 5 columns, 1,000 rows, 1 MB | More formats | Aggregator integrations, after evaluation |
| Duplicate detection | Yes, with review | Better cross-file matching | Bank-specific parsing |
| Category editing | Yes | Rule-based suggested categories (M7) | Personalized classification |
| Transfers between own accounts | Yes, after the basic slice works (M4) | | |
| Corrections by void and replace | Yes | | |
| Events and outbox worker | Yes (M5 and M6) | | |
| Login for real users | No (local test user) | Separate milestone before real data or hosting | |
| Dashboard | Balances, month and category totals | Trends | Predictive cash flow |
| Recurring-transaction insights | | Rule-based detection | Confidence-scored ML |
| Budget alerts | | Optional | Adaptive alerts |
| AI assistant | No | No | Read-only assistant (M10), then proposed actions with confirmation |
| Payment initiation | No | No | Out of scope until separately justified |

Guardrail: v0.1 starts with manual entry and then supports exactly one documented CSV template. Never imply that arbitrary PDF or bank statements can be parsed.

## 4. User journeys

**A. First use**
1. Open the app.
2. Create an account: name, type, currency, optional opening balance and date.
3. See an empty dashboard with a clear next step.
4. Add a synthetic or manual transaction.
5. See updated totals and history.

**B. Record a transaction**
1. Pick the account and transaction type.
2. Enter amount, currency, date, merchant or description, optional category.
3. Submit.
4. Get success or a specific validation error.
5. See the transaction exactly once in the list and in the totals.

**C. Import transactions**
1. Choose a supported file and the target account.
2. Preview normalized rows with flagged errors and duplicates.
3. Confirm which valid rows to import.
4. Review counts of imported, skipped, duplicate and failed rows.
5. Check the resulting history and totals.

**D. Correct a category**
1. Open a transaction.
2. Change its category.
3. See confirmation.
4. See category totals update consistently.

**E. Correct an amount, date or account**
1. Open a transaction and choose to correct it.
2. Enter the right value.
3. See the original marked as voided and a corrected transaction in its place.
4. See balances and totals count only the corrected one.

## 5. Functional requirements

Test cases and issues should reference these IDs.

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---|---|
| FR-01 | Create, list and edit user-owned accounts | Must | Ownership enforced; invalid currency rejected |
| FR-02 | Record income and expense transactions | Must | Correct amount and sign; stored once |
| FR-03 | List, filter and paginate transactions | Must | Filtering by account, date and category is deterministic |
| FR-04 | Categorize and recategorize transactions | Must | Totals recalculate without double counting |
| FR-05 | Calculate account balances | Must | Balance equals opening balance plus valid movements |
| FR-06 | Calculate monthly and category totals | Must | Totals reconcile to source records |
| FR-07 | Preview and confirm a supported CSV import | Should | Parse errors and likely duplicates are visible before commit |
| FR-08 | Prevent duplicate ingestion | Must (for import) | Re-importing a file does not silently add matching rows |
| FR-09 | Record audit metadata for changes | Must | Created and updated timestamps and origin are available |
| FR-10 | Health endpoint and structured errors | Must | Health check is distinct from authenticated endpoints |
| FR-11 | Publish an event after a durable transaction write | After outbox milestone | Handler receives a consistent transaction ID despite retries |
| FR-12 | Safely reprocess failed event delivery | After outbox milestone | Retries cannot repeat side effects |
| FR-13 | Correct a transaction's amount, date or account | Must | The original is voided and kept; a replacement is posted; totals use only the replacement |
| FR-14 | Record a transfer between two owned accounts | Should (M4) | Both sides are written together; combined net worth is unchanged |
| FR-15 | Delete an account and all its data | Must | All accounts, transactions, categories and import records are removed; no uploaded file remains |

FR-11 and FR-12 are part of v0.1 (milestones M5 and M6) and are architecture-learning deliverables, not prerequisites for the first usable transaction screen.

## 6. Data and financial rules

- v0.1 supports INR only, and the currency is still stored on each record. Store money as whole paise in 64-bit integers: `BIGINT` in the database, `bigint` in code, text in JSON. Floating-point numbers are never the source of financial truth.
- A transfer between the user's own accounts is not income or spending.
- An uploaded import file is deleted as soon as the import finishes. Only its checksum and row counts are kept, to recognize a repeat upload. CSV amounts are read as text and converted to paise without floating-point numbers.
- Every transaction has a stable, immutable identifier. Source references and normalized fingerprints help detect duplicates but do not prove identity.
- Notes and categories can be edited in place with the change time recorded. Changing an amount, date or account voids the original and adds a replacement. Posted transactions are never hard-deleted. Edit history must never destroy the ability to explain a total.
- Transactions carry a calendar date, not a time of day.
- v0.1 counts posted transactions only. Pending ones are excluded from balances.
- A bank's available balance is not FinOSA's derived balance. Show where each number comes from and its limits.

## 7. Non-functional requirements

**Correctness**
- Writes are atomic within their database transaction.
- Repeated requests or events must not duplicate financial effects.
- Automated tests cover amount semantics, transfers, imports and aggregate reconciliation.
- Asynchronous summaries may lag. The raw transaction history stays authoritative.

**Security and privacy**
- No real credentials, secrets or personal data in the repository.
- Protected endpoints enforce user ownership at the data-access layer.
- Secrets live in environment variables or a secrets manager.
- Minimize personal data. Redact descriptions, account identifiers and statement contents from logs.
- Encrypt traffic in hosted deployments. Deleting an account removes all of its data. A longer retention policy is written before onboarding real users.
- v0.1 uses one built-in test user and runs locally only. Real login (tokens or server sessions, chosen then) is a separate milestone before any real data or hosting.

**Performance and accessibility**
- Transaction lists are always paginated.
- The app shows loading, empty, error and retry states.
- Readable type and accessible labels.
- Latency targets come after measuring a local baseline.

## 8. API sketch

Illustrative resources, not a fixed contract:

All paths sit under a version prefix, `/api/v1`, so a later breaking change can ship as `/api/v2`.

- `GET /health`
- `GET /api/v1/accounts`, `POST /api/v1/accounts`
- `GET /api/v1/transactions`, `POST /api/v1/transactions`, `PATCH /api/v1/transactions/:id`
- `POST /api/v1/imports/preview`, `POST /api/v1/imports/commit`
- `GET /api/v1/reports/monthly`

Transfers use `POST /api/v1/transfers` (M4). `PATCH` edits notes and categories; amount, date and account corrections use a separate void-and-replace call. Define validation and error formats before implementing. Mutating endpoints should accept idempotency keys where needed.

## 9. Non-goals for v0.1

- Bank scraping, UPI app automation, or reading notifications.
- Payment initiation, investment orders, credit scoring, or guarantees.
- An AI that improvises financial numbers.
- Currency conversion, joint accounts, complex splits, or tax accounting.
- Many services or an always-on broker cluster.

## 10. Acceptance examples

- **Given** an account opened with ₹10,000, **when** a posted ₹1,200 expense is recorded, **then** the derived balance is ₹8,800.
- **Given** two owned accounts, **when** ₹500 moves between them, **then** combined net worth is unchanged and income and expense totals exclude the transfer.
- **Given** a file already imported, **when** it is imported again, **then** duplicates are flagged and no second copy is added silently.
- **Given** a transaction in Food, **when** it moves to Transport, **then** both category totals match the updated records.
- **Given** a ₹1,200 expense entered as ₹1,020, **when** it is corrected, **then** the original is voided and kept and the balance counts only the ₹1,200.
- **Given** a request for another user's transaction ID, **then** no private data is returned.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Wrong transaction signs | Domain invariants and fixture-based tests |
| Import duplicates or partial failures | Preview, source tracking, atomic commit, idempotency |
| Misleading balances | Label derived balances; record where the opening balance came from |
| Sensitive data leakage | Synthetic dev data, structured redaction, threat review |
| Derived summaries drift from source | Rebuildable summaries, lag monitoring, reconciliation tests |
| AI scope creep | Finite v0.1 release criteria |

## 12. Decisions made

- **Users:** local test user in v0.1; real login before real data or hosting.
- **Data in:** manual entry, then the FinOSA CSV template (date, description, amount, direction, optional reference; amounts never negative; at most 1,000 rows and 1 MB).
- **Balance:** opening balance plus recorded movements, labeled as calculated.
- **Corrections:** void and replace; no hard delete of posted transactions.
- **Transfers:** built after the basic slice works, as two linked records written together.
- **Dates:** calendar date only; same-day order follows entry time.
- **Money:** INR only; `BIGINT` and `bigint`; text in JSON.
- **Deletion:** deleting an account removes everything; uploaded files are not kept.
- **Release:** v0.1 is roadmap M0 to M6.

Deferred: API hosting, login method, message broker, AI provider.
