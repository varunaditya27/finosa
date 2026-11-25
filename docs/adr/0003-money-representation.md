<div align="center">

# 0003. Money representation

Status: accepted

</div>

## Context

Decimal fractions such as 0.1 cannot be stored exactly as floating-point numbers, so sums drift by tiny amounts. A ledger must reconcile exactly.

## Decision

Store every amount as a whole number of paise (one hundredth of a rupee): `BIGINT` in PostgreSQL, `bigint` in TypeScript, text in JSON (JSON numbers are floating point and `bigint` does not serialize). The currency code is stored on each record, and v0.1 supports INR only. CSV amounts are read as text and converted without floating-point steps. Database rules such as `CHECK (amount_minor > 0)` are added by hand to the generated migration.

## Consequences

- Sums and comparisons are exact.
- Amounts are converted to rupees only for display.
- The ML service receives amounts as integers in paise and never computes ledger figures.
