# Modelr: Web-Based System Modeling Application
## Product & Technical Architecture Specification

---

## 1. Executive Summary & Vision

**Modelr** is a next-generation, web-based systems modeling tool designed to help organizations, engineers, and strategists map out complex systems, understand causal behavior, and analyze structural costs alongside emergent capabilities.

While traditional tools focus either purely on static structural mapping (e.g., architecture diagrams) or dynamic qualitative loops (e.g., Causal Loop Diagrams / Loopy), **Modelr** bridges both worlds by introducing two fundamental relationship types (**Formal** vs. **Functional**) and dynamic **Lenses** to view systems from tailored perspectives.

---

## 2. Theoretical Domain Model

### 2.1 Relationship Dichotomy: Form vs. Function

```
                         ┌─────────────────────────────────┐
                         │           SYSTEM NODE           │
                         └─────────────────────────────────┘
                                  │               │
            ┌─────────────────────┘               └─────────────────────┐
            ▼                                                           ▼
┌───────────────────────┐                                   ┌───────────────────────┐
│  FORMAL RELATIONSHIP  │                                   │ FUNCTIONAL RELATIONSH │
├───────────────────────┤                                   ├───────────────────────┤
│ • Static & Tangible   │                                   │ • Fleeting & Temporal │
│ • Defines what it IS  │                                   │ • Defines what it DOES│
│ • Drives COST         │                                   │ • Drives EMERGENCE    │
└───────────────────────┘                                   └───────────────────────┘
```

1. **Formal Relationships (`Form`)**:
   - **Definition**: Represents physical, structural, or permanent compositional connections.
   - **Key Attributes**: Static, tangible, structural hierarchy, dependency trees.
   - **Primary Metric**: **Cost** (capital expenditure, maintenance, footprint, operational weight).
   - **Examples**: "Server A physically hosts Database B", "Department X employs Role Y", "Vehicle contains Engine".

2. **Functional Relationships (`Function`)**:
   - **Definition**: Represents dynamic interactions, influence, data/resource flows, and causal links over time.
   - **Key Attributes**: Fleeting, temporal, dynamic rate, link polarity ($+$ / $-$ or $S$ / $O$).
   - **Primary Metric**: **Emergence** (systemic behavior, throughput, feedback loops, unintended side-effects).
   - **Examples**: "Increased Server Load increases Database Latency ($+$)", "Higher Training reduces Error Rate ($-$)"

---

### 2.2 Causal Loop Diagram (CLD) Rules & Engine

Modelr embeds native syntax checks and feedback loop detection based on System Dynamics best practices:

1. **Variable Rules & Guidance**:
   - **Noun Phrase Standard**: Variables must be nouns or noun phrases (e.g., "Customer Trust", not "Trusting customers").
   - **Sense of Direction**: Variable names must have a clear direction of change (e.g., "Delivery Velocity" rather than "Delivery").
   - **Positive Formulation Guardrail**: Avoid negative prefixes (`non-`, `un-`, `dis-`). The UI recommends positive phrasing (e.g., "Employee Satisfaction" instead of "Dissatisfaction").

2. **Link Polarity & Dynamics**:
   - **Same / Positive ($+$ or $S$)**: An increase in source variable causes an increase in target variable (or decrease causes decrease).
   - **Opposite / Negative ($-$ or $O$)**: An increase in source variable causes a decrease in target variable (or vice versa).
   - **Time Delays ($\parallel$)**: Optional delay flag indicating latent causal impact.

3. **Automated Feedback Loop Analysis**:
   - **Reinforcing Loop ($R$)**: A cycle with an **even number** of negative links (or all positive links). Drives compounding growth or compounding collapse.
   - **Balancing Loop ($B$)**: A cycle with an **odd number** of negative links. Counteracts change, pushing the system toward a target state or equilibrium.

---

### 2.3 The Lenses Framework

Lenses allow users to filter, style, and compute metrics over the same graph to gain distinct analytical perspectives.

| Lens Name | Primary Focus | Display Rules | Key Metrics Computed |
| :--- | :--- | :--- | :--- |
| **Formal Lens** | Physical/Structural Form | Highlights Formal edges; collapses dynamic feedback noise. | Total Structural Cost, Single Points of Failure, Dependency Depth. |
| **Functional Lens** | System Dynamics & Causal Loops | Highlights Functional edges ($+$/$-$), highlights feedback loops ($R$/$B$). | System Feedback Density, High-Leverage Variables, Dominant Loops. |
| **Cost Heatmap** | Financial & Resource Burden | Color-codes nodes/edges by direct & inherited costs along formal paths. | Cost Hotspots, Cost per Functional Outcome ratio. |
| **Emergence Map** | Behavioral Complexity | Animates live signal pulses along causal paths. | Dynamic Stability index, Oscillation risks, Emergent Bottlenecks. |
| **Custom Filter** | Tag & Domain Lenses | User-defined predicate queries (e.g. `tag:security AND risk:high`). | Domain-specific sub-graph metrics. |

---

## 3. UI/UX Design & User Experience

Inspired by the simple interactive joy of **Loopy** and the deep, analytical flexibility of **Kumu**, Modelr uses a dual-mode canvas:

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  MODELR  [File] [Edit] [View]   |   Lens: [ Functional (CLD) ▼ ]  [▶ Play Mode]│
├───────────────┬────────────────────────────────────────────────┬───────────────┤
│ TOOLBAR       │ CANVAS                                         │ INSPECTOR     │
│ ◯ Add Variable│                                                │ Selection:    │
│ → Formal Edge │        (+)                             (+)     │ Customer Trust│
│ ⤳ Functional  │  ┌────────────┐               ┌─────────────┐  │ ───────────── │
│ ↺ Add Loop R/B│  │ Marketing  │──────────────>│ Brand Awareness│ Type: Variable│
│ 🔍 Lenses      │  └────────────┘               └─────────────┘  │ Cost: $12k/mo │
│               │        ▲                             │         │ Emergence: High│
│               │        │             (R1)            │         │ ───────────── │
│               │        │     Reinforcing Growth      │         │ Links:        │
│               │        │                             ▼         │  + Revenue    │
│               │  ┌────────────┐               ┌─────────────┐  │  - Churn      │
│               │  │ Revenue    │<──────────────│ Sales Vol.  │  │ ───────────── │
│               │  └────────────┘      (+)      └─────────────┘  │ Syntax Checks:│
│               │                                                │  ✓ Noun phrase│
└───────────────┴────────────────────────────────────────────────┴───────────────┘
```

1. **Design Mode (Authoring)**:
   - Drag-and-drop or click-to-add node creation.
   - Intuitive edge creation with visual indicators for Formal (solid, structural lines) vs. Functional (curved, directional arrows with $+$/$-$ badges).
   - Real-time syntax and quality checker highlighting non-standard variable names or unlinked loops.

2. **Simulation / Play Mode (Loopy-inspired)**:
   - Interactive controls to "bump" a variable up or down.
   - Visual signal propagation: animated dots/pulses travel along functional edges showing how changes cascade through reinforcing ($R$) and balancing ($B$) loops over time.
   - Speed controls, pause, and graph step visualization.

3. **Presentation / Storytelling Mode (Kumu-inspired)**:
   - Step-by-step walkthrough slides highlighting specific sub-graphs, loops, or lenses.
   - Markdown sidepanel for rich context, documentation, and operational metadata.

---

## 4. Technical Architecture

### 4.1 Technology Stack Recommendations

- **Frontend Application**: React / TypeScript + Tailwind CSS
- **Graph Canvas Rendering**:
  - **Option A (Recommended)**: **Cytoscape.js** for robust graph algorithms (cycle detection, layout engine) + **HTML5 Canvas overlay** for dynamic signal particle animation.
  - **Option B**: **React Flow** with custom nodes/edges for modular UI controls + custom force simulation engine.
- **State Management & Graph Engine**:
  - Zustand / Jotai for reactive UI state.
  - Graphology or custom Graph Data Structure for fast graph queries, cycle detection (Johnson's Algorithm), and pathfinding.
- **Simulation Engine**:
  - Custom WebWorker-based discrete-time signal propagation engine.
- **Persistence & Interoperability**:
  - JSON Schema definition (`.modelr` format) for easy export/import.
  - SVG/PNG exporter with high-DPI rendering.

---

### 4.2 Data Model Schema (JSON Specification)

```json
{
  "version": "1.0.0",
  "metadata": {
    "title": "SaaS Growth & Infrastructure Model",
    "description": "Systemic model mapping server costs against user acquisition loops."
  },
  "nodes": [
    {
      "id": "v1",
      "label": "Marketing Spend",
      "type": "variable",
      "metadata": {
        "cost": 50000,
        "tags": ["acquisition", "finance"]
      },
      "position": { "x": 100, "y": 200 }
    },
    {
      "id": "v2",
      "label": "User Base",
      "type": "variable",
      "metadata": {
        "cost": 0,
        "tags": ["growth"]
      },
      "position": { "x": 350, "y": 200 }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "v1",
      "target": "v2",
      "category": "functional",
      "polarity": "+",
      "delay": false,
      "label": "Drives traffic"
    }
  ],
  "loops": [
    {
      "id": "loop_r1",
      "name": "Viral Acquisition Loop",
      "type": "reinforcing",
      "cycleEdgeIds": ["e1", "e2", "e3"],
      "description": "More users lead to higher organic referrals."
    }
  ],
  "lenses": [
    {
      "id": "lens_formal",
      "name": "Cost Structure",
      "visibleCategories": ["formal"],
      "styleOverrides": {
        "nodeColorByAttribute": "metadata.cost"
      }
    }
  ]
}
```

---

## 5. Phased Implementation Roadmap

### Phase 1: MVP Core Editor (Weeks 1–4)
- [x] Basic interactive canvas (Nodes, Formal/Functional Edges).
- [x] Link Polarity editor ($+$ / $-$).
- [x] Basic syntax checker for variable names.
- [x] JSON Import / Export & local persistence.

### Phase 2: Dynamic Simulation & Loop Engine (Weeks 5–8)
- [ ] Interactive "Play / Simulate" mode with signal particle animations.
- [ ] Automated elementary cycle detection (Johnson's algorithm) to detect loops.
- [ ] Automatic classification of Reinforcing ($R$) vs. Balancing ($B$) feedback loops.
- [ ] Variable impulse triggers (bump value, observe pulse flow).

### Phase 3: Lenses Framework & Cost/Emergence Engine (Weeks 9–12)
- [ ] Lens switcher UI (Formal, Functional, Hybrid).
- [ ] Node & Edge attribute aggregation (Total Formal Cost calculator).
- [ ] Emergence / feedback density highlighting.
- [ ] Custom tag/attribute filters and display rules.

### Phase 4: Polish, Storytelling & Analytics (Weeks 13+)
- [ ] Presentation mode (slide sequence with camera bookmarks & lens transitions).
- [ ] High-resolution SVG / PNG exports.
- [ ] Comprehensive documentation panel with markdown formatting.
