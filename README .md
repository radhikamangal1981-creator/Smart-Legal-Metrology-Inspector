# ⚖️ Smart Legal Metrology Inspector

**AI-powered multimodal package compliance inspector for the Legal Metrology (Packaged Commodities) Rules, 2011**
Built for **SIH Problem Statement SIH26034** — Smart India Hackathon

---

## Introduction

An app that uses multimodal AI (Google Gemini) to inspect photos of packaged commodities against India's Legal Metrology labelling rules. Upload a package image and get back extracted declarations, per-rule PASS/FAIL verdicts, and a compliance score in seconds.

## Our Vision

Replace slow, manual, paper-based legal metrology inspections with a fast, consistent, and auditable digital process — making compliance checks as easy as taking a photo, for inspectors and brand owners alike.

## The Problem

- Manual inspection of every mandatory declaration is slow and inconsistent across officers.
- Small but legally significant violations (wrong units, missing "inclusive of all taxes", missing PIN code) are easy to miss.
- Thousands of SKUs enter the market daily — far more than inspectors can manually check.
- Paper-based checks leave no structured, reusable evidence for enforcement action.
- Rules are scattered across the Legal Metrology Act, LMPC Rules 2011, and FSSAI regulations.

## Our Solution

The app extracts every statutory declaration from a package image, locates it visually with bounding boxes, and evaluates it against each applicable rule — returning a status, severity, legal reference, and remedial action per check, plus an overall compliance score and suggested action. Preloaded real-world sample packages let the full workflow be explored even without a live API key.

## Features

- 📸 Image upload / camera capture for package inspection
- 🗂️ Category-aware rule sets (Food, Cosmetics, FMCG, Electronics, Imported Goods)
- 🧠 Gemini-powered extraction of all statutory declarations with confidence scores
- 🖼️ Interactive bounding-box overlay linking fields to evidence in the image
- ✅ Rule-by-rule compliance engine (status, severity, legal reference, penal provision)
- 🎚️ Configurable rules with instant local re-evaluation (no re-scan needed)
- 📐 Layout & readability analysis (PDP area, font legibility, contrast, lighting)
- 🌐 Language detection for Hindi/English compliance
- 📊 Overall compliance score & suggested action (Approve / Notice / Confiscate / Physical Inspection)
- 📝 Exportable single inspection report + cumulative batch report/registry
- 🧪 Preloaded benchmark packages usable without an API key

## Platform Process Flow

```
Upload/Capture Image → /api/analyze (Express) → Gemini Multimodal Analysis
   → Parse & Normalize Result → Rule Evaluation Engine
   → Interactive Review UI (overlay, declarations, compliance table, layout panel)
   → Inspection Report / Batch Report
```

## Tech Stack

**Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Lucide React, Motion
**Backend:** Express, Google Gen AI SDK (`@google/genai`), dotenv
**Tooling:** TypeScript, tsx, esbuild
**AI Model:** Gemini multimodal model with a Legal Metrology-specific system prompt

## Project Structure

```
├── server.ts                     # Express server + /api/analyze, /api/health
├── metadata.json / package.json / vite.config.ts / tsconfig.json
└── src/
    ├── App.tsx                   # Root component & state orchestration
    ├── server/geminiService.ts   # Gemini prompt & multimodal analysis call
    ├── data/                     # Default rules & sample packages
    ├── types/inspection.ts       # Shared TypeScript types
    ├── utils/                    # Rule re-evaluation & field extraction helpers
    └── components/               # Header, ImageUploader, CanvasOverlay,
                                   # ExtractedDetailsPanel, ComplianceAnalysis,
                                   # LayoutReadabilityPanel, RuleConfig,
                                   # InspectionReportModal, BatchReportModal
```

## Getting Started

```bash
# Clone & install
git clone https://github.com/radhikamangal1981-creator/Smart-Legal-Metrology-Inspector.git
cd Smart-Legal-Metrology-Inspector
npm install

# Configure (optional — sample packages work without it)
echo "GEMINI_API_KEY=your_key_here" > .env

# Run
npm run dev        # dev server → http://localhost:3000
npm run build       # production build
npm start           # run production build
```

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build frontend + bundle server |
| `npm start` | Run production bundle |
| `npm run lint` | Type-check project |

## Challenges and Strategy

- **Grounding the model in law** → Encoded specific LMPC/FSSAI rules and violation patterns directly into the system prompt.
- **Consistent structured output** → Enforced strict JSON schema with low temperature + defensive fallbacks.
- **Trustworthy AI results** → Every extracted field ships with a bounding box, confidence score, and raw text evidence.
- **Category-specific rule applicability** → Rules tagged by category; toggleable via a config modal with instant local re-evaluation.
- **Usability without API access** → Precomputed real-world benchmark packages ship with the app for full offline exploration.
- **Communicating severity clearly** → Each check carries a severity level and legal reference, mapped to a clear suggested action.

---

*Smart Legal Metrology Inspector — a prototype for SIH Problem Statement SIH26034, supporting automated verification under the Legal Metrology (Packaged Commodities) Rules, 2011.*
