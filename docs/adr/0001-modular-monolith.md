<div align="center">

# 0001. Modular monolith

Status: accepted

</div>

## Context

FinOSA has one developer, one mobile app and one database. Several deployable services would add network failures, versioning and operations work before there is any need for them.

## Decision

Build one deployable backend, split inside into feature modules (accounts, transactions, imports, reports). Each module owns its rules and exposes a narrow interface, so other modules do not reach into its tables. The Python ML service is the one separate program, because its tools are written in Python (see [AI and ML Design](../07-ai-ml-design.md)).

## Consequences

- One program to run, test and debug.
- Module boundaries are kept by discipline and code review, not by the network.
- A module can be moved out into its own service later if it needs to scale or deploy on its own.
