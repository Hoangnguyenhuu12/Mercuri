# MERCURI // Unified Fashion OS & AI Operations Suite

> **Unified Omnichannel Fashion Operating System (MercuriOS) with Autonomous Operations AI Copilot (Mercurix).**  
> High-performance, minimalist, zero-icon technical typography, and end-to-end automation for fashion retail chains, fulfillment hubs, and garment production.

---

![MercuriOS Overview & Mercurix Operations Assistant](assets/mercurios-overview.png)

---

## [01] Architecture Overview

Mercuri decouples presentation from autonomous AI reasoning across two dedicated suites:

```
f:/Mercuri/
├── Mercurix/    --> [AI BRAIN & AGENTIC CORE] ReAct loop, PageContext awareness & Fail-Closed Action Gate
│   └── src/     --> Modular runtime (context-engine.js, action-catalog.js, brain-core.js, index.js)
└── Mercurios/   --> [HOST SYSTEM & UI HARNESS] 420px Messenger chat drawer, CSS, reactive state & dev server
```

---

## [02] Key Capabilities

### 1. MercuriOS — Fashion Operating System
* **Executive Dashboard [01]**: Real-time gross revenue, fulfillment velocity, safe stock metrics, and live dispatch queues.
* **Catalog & Design [SKU, CAT, COL, MAT]**: Style matrix (size × color), seasonal collections (Spring/Summer/Fall/Winter/Capsule), and raw material inventory.
* **Sales & Omnichannel Orders [ORD, CRM, MSG]**: Unified multi-channel ingestion across Stores (POS), Website, Shopee, TikTok Shop, Facebook, and Lazada.
* **Inventory & Fulfillment [WHS, STR]**: Safe-stock threshold alerts across 9 retail outlets and 2 central hubs (Central Hub HCM [WH-01], Ecom Hub [WH-02]).
* **Production MES [MFG, VND]**: Real-time batch manufacturing tracking (Cutting, Sewing, QC, Packaging) and vendor lead-time monitoring.
* **High-Contrast Dark Mode**: Technical Velvet Charcoal palette with crisp readability, designed for long operational shifts.

### 2. Mercurix — Fashion Operations AI Assistant
* **Floating Messenger Mini Chat**: Lightweight bottom-right widget (`MX` launcher, `Ctrl + Space`), completely non-modal with zero background dimming.
* **Flat Context Awareness (`PageContext`)**: Real-time detection of active view, current hub, and operational counts without DOM scraping.
* **Fail-Closed Action Gate**: Strictly whitelisted tool execution (`ui.navigate`, `ui.open_form`, `ops.filter_table`, `ops.filter_dropdown`, `ops.query_data`, `ui.set_theme`, `ui.trigger_action`, `ops.delete_record`).
* **Human-in-the-Loop (HITL)**: All mutating operations (e.g. order deletion, stock dispatch) stage parameters and require explicit human confirmation prior to execution.
* **Contextual Clarification**: Eliminates rigid boilerplate templates; dynamically analyzes user intent to ask focused clarifying questions when commands lack required arguments.

---

## [03] Getting Started

### Prerequisites
* Node.js (v18 or higher)
* Modern web browser (Chrome, Edge, Firefox, Safari)

### Quick Launch
1. Open terminal and navigate to `Mercurios/`:
   ```bash
   cd Mercurios
   ```
2. Start the local server:
   ```bash
   node server.js
   ```
3. Open your browser and access:
   ```
   http://localhost:5173/index.html
   ```

---

## [04] Design Principles

* **Zero-Icon Standard**: 100% typography-driven interface using `Plus Jakarta Sans` and `JetBrains Mono`. Technical bracketed tags (`[01]`, `[SKU]`, `[ORD]`, `[PAID]`, `[DELIVERING]`) replace ambiguous graphic icons.
* **Fail-Closed Safety**: Any command or target view outside the authorized Action Catalog is safely rejected.
* **Ephemeral Session State**: Chat memory and pending confirmations live strictly in memory and reset cleanly upon page refresh (`F5`).

---

© 2026 Mercuri OS. All rights reserved.
