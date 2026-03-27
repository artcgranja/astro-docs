---
title: Concepts
description: Core ideas and design philosophy behind anchor.
---

# Concepts

Understanding the **why** behind anchor helps you use the library
effectively and extend it with confidence. These pages cover the foundational
ideas, the system architecture, and the contracts that make everything
pluggable.

-   **Context Engineering**

---

    The philosophy of treating context as a first-class engineering problem --
    why "just stuff it in the prompt" doesn't scale.

    [Read more](context-engineering.md)

-   **Architecture**

---

    The 6-stage pipeline that transforms a raw query into a fully assembled,
    token-budgeted context window.

    [Read more](architecture.md)

-   **Protocols**

---

    PEP 544 structural subtyping for every extension point -- bring your own
    retriever, memory, formatter, or store without inheriting a base class.

    [Read more](protocols.md)

-   **Token Budgets**

---

    Per-source allocation, overflow tracking, and priority-based eviction to
    keep your context window within model limits.

    [Read more](token-budgets.md)
