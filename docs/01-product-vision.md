<div align="center">

# Product Vision

Status: draft. This describes direction, not implemented functionality.

</div>

## 1. Vision

FinOSA (Financial Operating System Agent) helps a person turn scattered transaction records into one understandable picture of their money, and then act on it. The long-term path is: what happened, why it matters, what is likely next, and what can I safely do.

## 2. The problem

Balances sit in one app, transactions in another, subscriptions in memory, upcoming bills in a calendar, goals in someone's head. A raw transaction list does not explain any of it. The problems FinOSA targets:

1. **Fragmentation.** Several accounts, reconciled by hand.
2. **Low interpretability.** Lists with no patterns or explanation.
3. **Poor forward visibility.** Recurring bills, cash-flow surprises, uncertainty about what is affordable.
4. **Low trust in automation.** Categories and AI answers with no evidence or easy correction.
5. **Manual effort.** Repetitive imports, tagging and review.

These are hypotheses to validate, not findings about all users or competitors.

## 3. Who it is for

**First user:** one person in India who wants to understand finances from data they supply themselves. Early validation uses synthetic (made-up) data, then opt-in testing.

**Possible later users:** students starting work, salaried people managing bills and subscriptions, anyone with several accounts or payment methods. Shared accounts, small-business accounting and automatic bank connections are out of scope at first.

## 4. Principles

- **Evidence over fluent text.** Every number can be traced to records.
- **Computed, not generated.** Balances, totals, rules and affordability limits come from tested code. A language model may explain them. It never invents ledger facts.
- **Privacy by default.** Collect the minimum, keep sensitive content out of logs and events, support consent and deletion.
- **Corrections are first-class.** Users can change categories and challenge insights, and the history is kept.
- **India-aware, not India-only.** Support INR, UPI references and local statement formats while keeping currency and data models extensible.
- **Automate gradually.** Start with transparent manual workflows and add automation once its quality is measurable.
- **Learn by building.** Use Node.js, TypeScript, React Native and PostgreSQL, and adopt event-driven patterns only where they solve a concrete problem.

## 5. Pillars

| Pillar | What the user gets | First credible version |
|---|---|---|
| Consolidated view | One view across accounts | Manual accounts, entered or imported transactions |
| Financial intelligence | Meaningful categories and patterns | Visible categories, monthly summaries |
| Forward-looking awareness | Warning about upcoming obligations | Later: recurring-payment detection and forecast |
| Decision support | "Can I afford this, and why?" | Later: rule-based affordability check with visible inputs |
| Conversational interface | Plain-language questions about your data | Later: read-only assistant using verified calculations |

## 6. Target experience (not the MVP)

A user imports statements or connects a supported source, reviews the transactions found, and sees:

- what changed since the last visit;
- which obligations will reduce usable money before the next income date;
- why spending changed, with the transactions behind it;
- whether a planned purchase fits their own buffers and goals;
- corrections and actions they can approve.

The assistant must separate observed data, inference and recommendation.

## 7. Why event-driven design

One recorded transaction can trigger several independent reactions: refresh totals, suggest a category, check for recurring patterns, send a notification. Events let those happen without making the transaction write wait for each of them.

The plan is incremental: define explicit domain events first, then add durable delivery through a transactional outbox and a worker once asynchronous consumers exist. A message broker is a later decision.

## 8. What FinOSA is not

- A bank, licensed investment adviser, payment processor or custodian.
- An automated trading, lending or money-transfer system.
- A source of tax, credit or other regulated advice.
- An AI agent that can move money without the user's approval.
- A showcase for Kubernetes or Kafka.

## 9. Success signals

**MVP:**

- A user can create an account and record or import transactions accurately.
- The same file or transaction cannot silently double-count.
- An account balance can be reproduced from defined inputs and rules.
- Monthly and category totals match the underlying transactions.
- A corrected category updates every total consistently.
- A wrong amount can be corrected without losing history.
- A fresh checkout can be set up with documented commands.

**Later (targets to be set after baselines):** import completion and correction rates, duplicate rate, unresolved-transaction rate, precision and recall of recurring-payment detection, usefulness of explanations, user trust.

## 10. Decisions for v0.1

1. **Users:** v0.1 runs locally with made-up data and one built-in test user. Every record still has an owner, so real login can be added later. Real login is a separate step before any real financial data or online hosting.
2. **Getting data in:** manual entry first, then one CSV template that FinOSA defines. No bank-specific parsing.
3. **Balances:** a calculated balance: the stated opening balance plus recorded movements. It is labeled as calculated, and a check against statement balances comes later.
4. **AI:** none in v0.1 or v0.2. Rule-based category suggestions come first (roadmap M7), and a read-only assistant much later (M10).
5. **Scope of v0.1:** roadmap milestones M0 to M6, which includes in-process events and the durable outbox worker.

Still deferred, each with its own trigger: API hosting (after the login milestone), the login method (tokens or server sessions, chosen in that milestone), the message broker (M8), and the AI provider (M10).

## 11. Decision status

**Established:** the FinOSA name and personal-finance-agent vision; Node.js and TypeScript for the backend on plain `node:http` with Zod, without NestJS; npm workspaces; PostgreSQL accessed through Prisma ORM pinned to 7.x; React Native with Expo for the client; event-driven design as a learning goal.

**Deferred:** API hosting, login method, message broker, AI provider (see section 10).
