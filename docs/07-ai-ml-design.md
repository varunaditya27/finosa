<div align="center">

# AI and ML Design

Status: decisions recorded; nothing is implemented. AI work starts after the backend foundation (roadmap M1 to M4) and the worker (M6) exist.

</div>

## 1. Rules

- A model suggests or explains. It never creates a balance, total or any other ledger fact. All figures come from tested code.
- A suggestion is stored apart from a fact, with its source, and the user can correct it. Corrections keep history.
- No transaction text goes to an outside service unless the data is made up or the user has agreed (see section 8).
- The design is for learning: start with plain methods, measure them, and add a model only when it beats the plain one.

## 2. Planned features

| Feature | Method now | Method later | Roadmap |
|---|---|---|---|
| Category suggestion | Fixed rules, then a small learned model (scikit-learn) | A small language model (SLM) behind the same interface | M7 |
| Repeating-payment detection | Group by cleaned shop name, check for a steady gap and similar amounts | A learned scorer on top of the rules, trained on confirmations and dismissals | M7 |
| Spending forecast | A forecasting model from the start, compared against a plain same-period average | Model tuning with more history | After M7 |
| Plain-language questions | A language model that calls tested code and explains the result | | M10 |

More AI features can be added later. Each needs an entry here first.

## 3. Where the code runs

| Part | Language | Role |
|---|---|---|
| API (`node:http`) | TypeScript | Saves transactions and emits `transaction.recorded.v1`. Never waits for the ML service. |
| Worker (M6) | TypeScript | Reacts to the event, calls the ML service, stores the suggestion. |
| ML service (`ml/` at the repo root) | Python, FastAPI, managed by `uv` | Runs models and returns suggestions. Holds no financial data of its own. |

The ML service is a separate program because the best ML tools are written in Python. A suggestion can arrive a few seconds after saving, and saving always works when the ML service is down. FastAPI is below version 1.0, and its [version policy](https://fastapi.tiangolo.com/deployment/versions/) advises pinning an exact version, so `uv`'s lock file pins it.

Later, the app may add buttons for frequent transaction types. That is a separate, direct path and is not decided.

## 4. Swappable models

Each feature sits behind one narrow interface, for example `suggestCategory(transaction) -> { category, confidence, reason, model, modelVersion }`. Implementations are interchangeable: rules, the scikit-learn model, a small language model running on the server machine. The stored suggestion records which one made it, so accuracy can be compared per model and a bad model can be traced.

Running a model on the user's phone is not planned. The interface does not prevent it later.

## 5. Data

- Training and test data is generated: a script writes a few thousand made-up Indian transactions with the right category attached, with noise such as extra digits and city codes. Scores on this data flatter the model, because it learns our imagination. Say so wherever a score is quoted.
- Loading is written so another data source can replace the generator without changing the training code.
- Real data: the owner's own bank statement stays in a private folder that git ignores. A personal script converts it to the CSV template. It is used only on the owner's own machine, with a local database, no hosting and no outside AI service. This is a documented exception to the real-data rule in the roadmap, and it relies on discipline: disk encryption, no real rows in git, logs, screenshots or tests.
- Sending only computed trends, with no personal details, to a hosted model is possible later and is not decided.

## 6. Learning loop

Corrections accumulate in the database. Retraining is a script run by hand: it rebuilds the model from all examples, scores it on a held-back test set, and replaces the current model only if the new score is better. Automatic retraining on a schedule is possible later, once there is steady data and a rollback plan.

## 7. Message shapes between Node and Python

The Python service is the source of truth. FastAPI publishes an OpenAPI description (a machine-readable list of endpoints and their fields). A script turns it into TypeScript types, and the Node side checks every reply with Zod at runtime. A changed field then fails a build or a test instead of failing quietly in use.

## 8. Language-model client

One shared client in front of the language model, with two interchangeable back ends: a model run on the server machine, and the Gemini API. The model asks tested code for numbers through tool calls and only explains what comes back. Until the real-data gate in the roadmap is passed, the hosted back end sees made-up data only.

## 9. Quality measures

| Feature | Measure |
|---|---|
| Category suggestion | Share of suggestions the user accepts unchanged; accuracy on a held-back test set |
| Repeat detection | Precision and recall against labeled examples; dismissals |
| Forecast | Error against the plain same-period average on past months; the forecast always shows a range |
| Questions | An evaluation set that includes questions the system must refuse, and a check that no number is invented |

## 10. Not decided

- The small language model, its runtime, and the forecasting library.
- Whether hosted models ever see real data.
- The shape of the frequent-transaction shortcut buttons.
