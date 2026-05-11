<div align="center">

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        ✦  A A R O G Y A I D   A D V I S O R  ✦          ║
║                                                           ║
║     AI-powered health insurance recommendation engine     ║
║          built for patients, not spreadsheets             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Groq](https://img.shields.io/badge/LLM-Groq_Llama_3.3-FF6B35?style=flat-square)](https://groq.com)
[![ChromaDB](https://img.shields.io/badge/Vector_Store-ChromaDB-FF6B6B?style=flat-square)](https://trychroma.com)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)

<br/>

> *"Most Indians don't choose the wrong insurance because they're careless.*
> *They choose wrong because no one explained it to them clearly."*

<br/>

</div>

---

## ✦ What this actually does

A 42-year-old with Diabetes living in Nagpur opens PolicyBazaar. She sees 47 plans. No one tells her that 31 of them won't cover her condition for 3 years. She picks the cheapest one. Two years later, her claim gets rejected.

**This project exists to prevent that.**

AarogyaID Advisor takes a patient's health and financial profile — 6 fields, nothing more — and returns a grounded, personalised insurance recommendation pulled directly from real policy documents. No hallucination. No generic advice. No dead ends.

---

## ✦ Architecture

```
  Patient fills form                    Admin uploads PDFs
  (6 fields only)                       (any insurer, any plan)
        │                                       │
        ▼                                       ▼
  ┌─────────────┐                    ┌──────────────────┐
  │  React UI   │                    │  PyMuPDF Parser  │
  │  Vite + CSS │                    │  Chunk → Embed   │
  └──────┬──────┘                    └────────┬─────────┘
         │  POST /recommend                   │
         ▼                                    ▼
  ┌─────────────────────────────────────────────────────┐
  │                   FastAPI Backend                   │
  │                                                     │
  │   Profile → 4 targeted RAG queries → Groq LLM      │
  │                                                     │
  │   ┌──────────────────┐    ┌────────────────────┐   │
  │   │   ChromaDB       │    │  Llama 3.3 70B     │   │
  │   │  (local vector   │───▶│  (Groq inference)  │   │
  │   │    store)        │    │  grounded output   │   │
  │   └──────────────────┘    └────────────────────┘   │
  └─────────────────────────────────────────────────────┘
         │
         ▼
  Three-section output
  ├── Peer Comparison Table     (3 policies, all columns from PDFs)
  ├── Coverage Detail Table     (inclusions, exclusions, sub-limits)
  └── Why This Policy           (150-250 words, profile-referenced)
         │
         ▼
  Persistent chat explainer
  (session memory, no re-asking, source-grounded)
```

---

## ✦ AI Framework Choice — Why Not LangChain Agents

The brief mentioned Google ADK. I evaluated both ADK and LangChain agents before choosing **direct Groq API with multi-query RAG**.

| | LangChain Agent | Google ADK | This approach |
|---|---|---|---|
| Tool calling reliability with Llama | ❌ Frequent parsing failures | ✅ Good | ✅ Bypassed entirely |
| Latency | ~8-12s | ~6-10s | ~3-5s |
| Hallucination control | Prompt-dependent | Prompt-dependent | Context-injection |
| Debuggability | Complex chain traces | Complex | Simple Python |

**The core insight:** For a RAG-first system where grounding is the primary constraint, injecting retrieved chunks directly into the context window is more reliable than tool-calling agents — because it removes the failure mode of the model deciding *not* to call the retrieval tool.

The agent calls 4 targeted queries per request (premium, waiting periods, co-pay, inclusions) and deduplicates results before injection. This gives broader document coverage than a single similarity search.

---

## ✦ Recommendation Logic

Plain English, before any code:

```
1. RETRIEVE  →  4 parallel RAG queries based on user profile
               (premium+age, condition+waiting, city+copay, inclusions)

2. GROUND    →  All policy data must come from retrieved chunks.
               If not in documents → say so. Never invent.

3. FILTER    →  Agent considers user's conditions against waiting periods
               (Diabetes → flag 36-month plans, prefer 24-month)
               (Cardiac → only Care Supreme has 24-month wait)
               (Asthma  → Niva Bupa has 12-month, best in market)

4. SCORE     →  Suitability score from documents, not generated
               (each PDF contains pre-computed suitability by profile)

5. EXPLAIN   →  Why This Policy references ≥3 profile fields by name
               Warm tone. Define jargon. No dead ends.

6. GUARDRAIL →  Medical advice → decline + redirect
               Unknown condition → "not found in uploaded policies"
```

---

## ✦ Document Intelligence

**Chunking strategy:** 80-word chunks with 15-word overlap.

Why 80 words? Insurance policy PDFs have dense, clause-level information. Larger chunks (150+ words) dilute retrieval — a chunk about premiums gets mixed with exclusions. Smaller chunks (40 words) lose context. 80 words preserves one complete clause per chunk.

**Extraction:** PyMuPDF over pdfplumber — handles text-layer PDFs reliably, extracts ~4000-4700 chars per policy document.

**Embedding:** `all-MiniLM-L6-v2` via SentenceTransformers — runs locally, no API key, ~80ms per query.

**Deletion:** ChromaDB `where` filter by `policy_name` metadata — immediate removal, no orphan chunks.

---

## ✦ Policies Indexed (5 real plans)

| Plan | Insurer | Best For | PED Wait |
|------|---------|----------|----------|
| Family Health Optima | Star Health | Tier-2, income 3-8L | 24 months |
| Optima Restore | HDFC Ergo | Metro, zero co-pay | 36 months |
| ReAssure 2.0 | Niva Bupa | Asthma, OPD, young users | 12 months (Asthma) |
| Care Supreme | Care Health | Cardiac patients | 24 months ← only plan |
| Activ One Max | Aditya Birla | Diabetes OPD from Day-1 | Day-1 OPD |

---

## ✦ Quick Start

**Prerequisites:** Python 3.11+, Node 18+, Groq API key (free at console.groq.com)

```bash
# 1. Clone
git clone https://github.com/yourusername/aarogyaid-policy-advisor
cd aarogyaid-policy-advisor

# 2. Backend
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt

# 3. Environment
cp .env.example .env
# Add your GROQ_API_KEY to .env

# 4. Start backend
uvicorn main:app --reload --port 8000

# 5. Frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

Open `http://localhost:5173` — upload a policy PDF via Admin panel, then submit a profile.

---

## ✦ Environment Variables

```bash
# .env.example
GROQ_API_KEY=your_groq_api_key_here      # Get free at console.groq.com
ADMIN_USERNAME=admin                      # Admin panel login
ADMIN_PASSWORD=your_secure_password       # Change before deploying
CHROMA_DB_PATH=./chroma_db               # Vector store location
```

---

## ✦ Project Structure

```
aarogyaid-policy-advisor/
│
├── backend/
│   ├── main.py          — FastAPI app, all endpoints
│   ├── agent.py         — Groq LLM + multi-query RAG orchestration
│   ├── rag.py           — ChromaDB setup, retrieve, delete
│   ├── pdf_parser.py    — PyMuPDF extraction + chunking
│   ├── auth.py          — HTTP Basic auth for admin routes
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ui/          — Base UI components (Button, Input, etc.)
│       │   ├── shared/      — Shared components (Navbar, Markdown)
│       │   └── features/    — Feature-specific logic (Chat, ProfileForm)
│       ├── pages/           — Individual pages (Home, GetStarted, Result)
│       ├── layouts/         — MainLayout for consistent structure
│       ├── services/        — api.js for centralized backend communication
│       └── App.jsx          — Root component with routing setup
│
├── sample_policies/     — 5 PDF policy documents for testing
│   ├── star_health_family_optima.pdf
│   ├── hdfc_ergo_optima_restore.pdf
│   ├── niva_bupa_reassure.pdf
│   ├── care_supreme.pdf
│   └── aditya_birla_activ_one.pdf
│
├── tests/
│   └── test_recommendation.py
│
├── PRD.md               — Product requirements document
├── README.md
└── .env.example
```

---

## ✦ API Endpoints

```
POST /recommend          — Generate recommendation from profile
POST /chat               — Continue conversation (session memory)

POST   /admin/upload     — Upload + index policy PDF  [auth required]
GET    /admin/policies   — List indexed policies       [auth required]
DELETE /admin/policy/{name} — Remove from vector store [auth required]
```

---

## ✦ Grounding Test

Upload a policy covering Condition X. Ask about it. The agent cites the source document.

Ask about Condition Y — not in any uploaded document. The agent says:
> *"I could not find information about this in the uploaded policies."*

It does not invent an answer. This was the hardest constraint to enforce and the most important one to get right.

---

## ✦ Known Limitations

- Session memory is in-process — restarting the server clears chat history
- Premium estimates are from sample PDFs, not real-time insurer quotes
- Tier-3 city hospital network data is approximated from policy documents
- Single-user prototype — no database persistence for user profiles

---

## ✦ What I Would Build Next

If given 3 more days:

1. **Feedback loop** — thumbs up/down on recommendations feeds a fine-tuning dataset. The central product question we cannot answer from a prototype alone is: does our recommendation logic actually match what users decide?

2. **Real-time premium API** — connect to insurer APIs for live quotes instead of PDF-extracted estimates

3. **Multi-language support** — Hindi and Telugu for Tier-2/3 users who have lower English literacy

---

## ✦ Built With

| Layer | Choice | Why |
|-------|--------|-----|
| LLM | Groq Llama 3.3 70B | Free, fast (3-5s), reliable structured output |
| Vector Store | ChromaDB | Local, persistent, immediate deletion support |
| Embeddings | all-MiniLM-L6-v2 | No API key, 80ms local inference |
| PDF Extraction | PyMuPDF | Best text-layer extraction, handles dense layouts |
| Backend | FastAPI | Async, auto-docs, clean Pydantic validation |
| Frontend | React + Vite | Fast HMR, component state for multi-step UX |

---

<div align="center">

```
Built to show AarogyaID's mission in code —
putting patients at the heart of every experience.
```



</div>