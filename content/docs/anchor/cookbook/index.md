---
title: Cookbook
description: Practical recipes and patterns for building with anchor
---

# Cookbook

Ready-to-use recipes that go beyond the basics. Each recipe is a self-contained
guide with working code you can copy into your project.

---

- **[Chatbot with Memory](chatbot-with-memory.md)** — Build a conversational chatbot with sliding-window memory, automatic eviction, and persistent facts.

- **[RAG Pipeline](rag-pipeline.md)** — Complete Retrieval-Augmented Generation with dense retrieval, hybrid search, reranking, and provider-formatted output.

- **[Document Ingestion](document-ingestion.md)** — Ingest raw text and files, chunk with different strategies, enrich metadata, and index the results into a retriever.

- **[Custom Retriever](custom-retriever.md)** — Implement the `Retriever` protocol to create your own retriever and integrate it with `ContextPipeline` and `HybridRetriever`.

- **[Evaluation Workflow](evaluation-workflow.md)** — Evaluate retrieval quality with standard metrics and compare configurations using A/B testing with statistical significance.

- **[Agent with Tools](agent-with-tools.md)** — Build an agent with custom tools, skills, and memory using the `@tool` decorator and `SkillRegistry`.

- **[Production Patterns](production-patterns.md)** — Battle-tested patterns for deploying anchor in production: error handling, observability, performance tuning, and testing strategies.
