---
title: Concepts
description: Core ideas and design philosophy behind anchor.
---

# Concepts

Understanding the **why** behind anchor helps you use the library
effectively and extend it with confidence. These pages cover the foundational
ideas, the system architecture, and the contracts that make everything
pluggable.

- **[Context Engineering](context-engineering.md)** — The philosophy of treating context as a first-class engineering problem — why "just stuff it in the prompt" doesn't scale.

- **[Architecture](architecture.md)** — The 6-stage pipeline that transforms a raw query into a fully assembled, token-budgeted context window.

- **[Protocols](protocols.md)** — PEP 544 structural subtyping for every extension point — bring your own retriever, memory, formatter, or store without inheriting a base class.

- **[Token Budgets](token-budgets.md)** — Per-source allocation, overflow tracking, and priority-based eviction to keep your context window within model limits.
