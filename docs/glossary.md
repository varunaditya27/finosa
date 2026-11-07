<div align="center">

# Glossary

Plain-language definitions of terms used across these docs. Money terms are defined precisely in [04 Domain Model](04-domain-model.md).

</div>

| Term | Meaning |
|---|---|
| **Minor units** | The smallest coin of a currency stored as a whole number. ₹100.10 is stored as 10,010 paise. Avoids rounding errors that decimals cause. |
| **Ledger** | The list of all recorded money movements. Balances are calculated from it. |
| **Void** | Marking a transaction as cancelled while keeping it on record. It no longer counts in balances or totals. |
| **Paise** | One hundredth of a rupee. FinOSA stores amounts as whole paise, so ₹125.50 is 12550. |
| **Transfer** | Money moved between two of your own accounts. It is not income or spending. |
| **Idempotency key** | A unique value the client sends with a request. If the same key arrives again, the server returns the first result instead of repeating the work. |
| **Idempotent** | Safe to repeat: running it again leaves the result unchanged. |
| **Event** | A record that something already happened, such as "transaction recorded". |
| **Command** | A request to do something, such as "record this transaction". It can fail. |
| **Producer / consumer** | The part that emits an event / a part that reacts to it. |
| **Event-driven design (EDA)** | Building a system so parts communicate by emitting and reacting to events. |
| **Message broker** | A separate server (for example RabbitMQ or Kafka) that delivers events between programs. |
| **Transactional outbox** | The event is saved in an "outbox" table in the same database write as the data it describes. A separate relay later reads the table and publishes the event. This avoids "data saved, event lost" (and the reverse), but a relay crash can still cause a repeat, so consumers must tolerate duplicates. |
| **At-least-once delivery** | An event may arrive more than once but is not lost. Consumers must tolerate repeats. |
| **Eventual consistency** | A derived view may briefly lag behind the latest write, then catches up. |
| **Projection** | A summary, such as monthly totals, rebuilt from the original records. |
| **Modular monolith** | One deployable program split internally into clearly separated modules. |
| **ORM** | Object-relational mapper: a library that lets code read and write database rows as TypeScript objects instead of hand-written SQL. FinOSA plans to use Prisma. |
| **Migration** | A versioned script that changes the database's structure, so every environment can be brought to the same state. |
| **Dead-letter** | Another name for quarantine: parking an event that keeps failing so it can be inspected instead of retried forever. |
| **Zod** | A library that checks incoming data (for example JSON from the app) against a described shape when the program runs. |
| **Composition root** | The single place where an application's parts are created and connected to each other. |
| **ADR** | Architecture decision record: a short file describing one design decision and why it was made. Replaced decisions are kept and marked as superseded. |
| **CSV** | A plain text table where values are separated by commas. |

## Sources

- Transactional outbox: [microservices.io](https://microservices.io/patterns/data/transactional-outbox)
- Idempotency keys: [Stripe API docs](https://docs.stripe.com/api/idempotent_requests)
- ADRs: [adr.github.io](https://adr.github.io)
