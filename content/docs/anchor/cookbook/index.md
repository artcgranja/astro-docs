---
title: Cookbook
description: Practical recipes and patterns for building with anchor
---

# Cookbook

Ready-to-use recipes that go beyond the basics. Each recipe is a self-contained
guide with working code you can copy into your project.

---

<div class="grid cards" markdown>

-   **Chatbot with Memory**

---

    Build a conversational chatbot with sliding-window memory, automatic eviction,
    and persistent facts.

    [Chatbot with Memory](chatbot-with-memory.md)

-   **RAG Pipeline**

---

    Complete Retrieval-Augmented Generation with dense retrieval, hybrid search,
    reranking, and provider-formatted output.

    [RAG Pipeline](rag-pipeline.md)

-   **Document Ingestion**

---

    Ingest raw text and files, chunk with different strategies, enrich metadata,
    and index the results into a retriever.

    [Document Ingestion](document-ingestion.md)

-   **Custom Retriever**

---

    Implement the `Retriever` protocol to create your own retriever and integrate
    it with `ContextPipeline` and `HybridRetriever`.

    [Custom Retriever](custom-retriever.md)

-   **Evaluation Workflow**

---

    Evaluate retrieval quality with standard metrics and compare configurations
    using A/B testing with statistical significance.

    [Evaluation Workflow](evaluation-workflow.md)

-   **Agent with Tools**

---

    Build an agent with custom tools, skills, and memory using the `@tool`
    decorator and `SkillRegistry`.

    [Agent with Tools](agent-with-tools.md)

-   **Production Patterns**

---

    Battle-tested patterns for deploying anchor in production: error handling,
    observability, performance tuning, and testing strategies.

    [Production Patterns](production-patterns.md)

</div>
