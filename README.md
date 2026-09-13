# ⚖️ Smart Legal Metrology Inspector

**AI-powered multimodal package compliance inspector for the Legal Metrology (Packaged Commodities) Rules, 2011**
Built for **SIH Problem Statement SIH26034** — Smart India Hackathon

---

## 📖 Introduction

An app that uses multimodal AI (Google Gemini) to inspect photos of packaged commodities against India's Legal Metrology labelling rules. Upload a package image and get back extracted declarations, per-rule PASS/FAIL verdicts, and a compliance score in seconds.

## 🎯 Our Vision

Replace slow, manual, paper-based legal metrology inspections with a fast, consistent, and auditable digital process — making compliance checks as easy as taking a photo, for inspectors and brand owners alike.

## ❗ The Problem

- Manual inspection of every mandatory declaration is slow and inconsistent across officers.
- Small but legally significant violations (wrong units, missing "inclusive of all taxes", missing PIN code) are easy to miss.
- Thousands of SKUs enter the market daily — far more than inspectors can manually check.
- Paper-based checks leave no structured, reusable evidence for enforcement action.
- Rules are scattered across the Legal Metrology Act, LMPC Rules 2011, and FSSAI regulations.

## 💡 Our Solution

Smart Legal Metrology Inspector uses a vision-and-language AI model, grounded with a detailed legal system prompt encoding the Legal Metrology Act 2009, the LMPC Rules 2011, and FSSAI packaging regulations, to:

1. **Read the package like an inspector would** — extracting every statutory declaration directly from the image (manufacturer/packer details, net quantity, MRP, dates, consumer care info, country of origin, batch number, certifications, and more).
2. **Locate the evidence visually** — returning bounding boxes over the exact regions of the image where each declaration was found, so a human reviewer can instantly verify the AI's reading.
3. **Evaluate each rule explicitly** — running each active rule against the extracted data and returning a `PASS` / `FAIL` / `NEEDS_REVIEW` verdict with severity, legal reference, plain-language explanation, remedial action, and applicable penal provision.
4. **Assess layout and readability** — scoring Principal Display Panel (PDP) prominence, font legibility, contrast, background clutter, and lighting quality, since a technically-present declaration that isn't legible is still a violation.
5. **Detect language compliance** — identifying which languages/scripts appear on the pack to verify the Hindi/English dual-declaration requirement.
6. **Produce an auditable report** — generating an overall compliance score, status, and officer-ready inspection report (plus a batch/cumulative report across multiple inspections) that can be exported or acted upon.

Where a live AI key isn't available, the app ships with a set of **precomputed, real-world benchmark packages** so every feature can be explored end-to-end without any setup.

## ✨ Features

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

## 🔄 Platform Process Flow

```
┌──────────────────┐
│  1. Capture/Upload │  User uploads a package photo or picks a
│     Package Image  │  benchmark sample, and selects a category
└─────────┬─────────┘
          │
          ▼
┌──────────────────────────┐
│ 2. Send to /api/analyze   │  Image + category + active rule set
│    (Express backend)      │  sent as base64 to the server
└─────────┬─────────────────┘
          │
          ▼
┌───────────────────────────────────┐
│ 3. Gemini Multimodal Analysis      │  Legal-metrology system prompt +
│    (src/server/geminiService.ts)   │  image analyzed by Gemini model
└─────────┬───────────────────────────┘
          │  Structured JSON response
          ▼
┌───────────────────────────────────┐
│ 4. Parse & Normalize Result        │  Extracted declarations, bounding
│    (InspectionAuditResult)         │  boxes, languages, layout, checks
└─────────┬───────────────────────────┘
          │
          ▼
┌───────────────────────────────────┐
│ 5. Rule Evaluation Engine          │  Each active rule compared against
│    (src/utils/evaluation.ts)       │  extracted data → PASS/FAIL/REVIEW
└─────────┬───────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────┐
│ 6. Interactive Review UI                    │
│    • Visual bounding-box overlay            │
│    • Extracted declarations panel           │
│    • Compliance analysis table              │
│    • Layout & readability panel             │
└─────────┬───────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────┐
│ 7. Reporting                       │  Single inspection report or
│    (Report / Batch Report Modals)  │  cumulative batch/registry report
└───────────────────────────────────┘
```

## 🛠️ Tech Stack

**Frontend**
- [React 19](https://react.dev/) with TypeScript
- [Vite 6](https://vitejs.dev/) — build tool and dev server
- [Tailwind CSS 4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [Lucide React](https://lucide.dev/) — icon library
- [Motion](https://motion.dev/) — animations

**Backend**
- [Express](https://expressjs.com/) — API server (`server.ts`)
- [Google Gen AI SDK](https://www.npmjs.com/package/@google/genai) (`@google/genai`) — Gemini multimodal inference
- [dotenv](https://www.npmjs.com/package/dotenv) — environment configuration

**Tooling**
- TypeScript
- `tsx` — TypeScript execution for the dev server
- `esbuild` — production server bundling
- Autoprefixer

**AI Model**
- Gemini multimodal model (image + text understanding) grounded with a Legal Metrology-specific system prompt

## 📁 Project Structure

```
Smart-Legal-Metrology-Inspector/
├── index.html                          # App entry HTML
├── metadata.json                       # App metadata & capabilities (camera permission, Gemini API)
├── package.json                        # Dependencies & scripts
├── server.ts                           # Express server + /api/analyze & /api/health endpoints
├── tsconfig.json                       # TypeScript configuration
├── vite.config.ts                      # Vite build configuration
└── src/
    ├── main.tsx                        # React app bootstrap
    ├── App.tsx                         # Root component & app state/orchestration
    ├── index.css                       # Global styles (Tailwind)
    ├── server/
    │   └── geminiService.ts            # Gemini prompt construction & multimodal analysis call
    ├── data/
    │   ├── defaultRules.ts             # Default mandatory rule definitions (LMPC/FSSAI)
    │   └── samplePackages.ts           # Preloaded real-world benchmark packages & results
    ├── types/
    │   └── inspection.ts               # Shared TypeScript types (InspectionAuditResult, etc.)
    ├── utils/
    │   ├── evaluation.ts                # Re-evaluates an audit when active rules change
    │   └── fieldExtractor.ts            # Helpers for working with extracted declarations
    └── components/
        ├── Header.tsx                   # Top navigation & action bar
        ├── ImageUploader.tsx             # Upload/camera capture & category selection
        ├── InspectorCanvasOverlay.tsx    # Interactive bounding-box image overlay
        ├── ExtractedDetailsPanel.tsx     # Structured statutory declarations view
        ├── InspectionOverviewBar.tsx     # Compliance score & status summary bar
        ├── ComplianceAnalysisSection.tsx # Rule-by-rule compliance breakdown
        ├── ComplianceTable.tsx           # Tabular rendering of compliance checks
        ├── LayoutReadabilityPanel.tsx    # PDP, legibility, contrast & language analysis
        ├── RuleConfigurationModal.tsx    # Enable/disable rules per category
        ├── InspectionReportModal.tsx     # Single inspection certificate/notice report
        └── BatchReportModal.tsx          # Cumulative batch report & inspection registry
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A [Gemini API key](https://ai.google.dev/) (optional — the app is fully explorable with preloaded sample packages even without one)

### Installation

```bash
# Clone the repository
git clone https://github.com/radhikamangal1981-creator/Smart-Legal-Metrology-Inspector.git
cd Smart-Legal-Metrology-Inspector

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the project root and add your Gemini API key to enable live AI-powered inspection of uploaded images:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> Without a key configured, live image uploads will show a clear notice, but all preloaded benchmark packages remain fully interactive.

### Running the App

```bash
# Start the development server (Vite + Express, with hot reload)
npm run dev
```

The app will be available at **http://localhost:3000**.

### Building for Production

```bash
# Build the frontend and bundle the server
npm run build

# Run the production build
npm start
```

### Other Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server (`tsx server.ts`) |
| `npm run build` | Build frontend (Vite) and bundle server (esbuild) |
| `npm start` | Run the production server bundle |
| `npm run preview` | Preview the production Vite build |
| `npm run lint` | Type-check the project (`tsc --noEmit`) |
| `npm run clean` | Remove build output |

## 🧩 Challenges and Strategy

- **Grounding the model in law** → Encoded specific LMPC/FSSAI rules and violation patterns directly into the system prompt.
- **Consistent structured output** → Enforced strict JSON schema with low temperature + defensive fallbacks.
- **Trustworthy AI results** → Every extracted field ships with a bounding box, confidence score, and raw text evidence.
- **Category-specific rule applicability** → Rules tagged by category; toggleable via a config modal with instant local re-evaluation.
- **Usability without API access** → Precomputed real-world benchmark packages ship with the app for full offline exploration.
- **Communicating severity clearly** → Each check carries a severity level and legal reference, mapped to a clear suggested action.

---

*Smart Legal Metrology Inspector — a prototype built for SIH Problem Statement SIH26034, supporting automated verification under the Legal Metrology (Packaged Commodities) Rules, 2011 and Section 36 of the Legal Metrology Act, 2009.*
