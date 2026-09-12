# ⚖️ Smart Legal Metrology Inspector

**AI-powered multimodal package compliance inspector for the Legal Metrology (Packaged Commodities) Rules, 2011**
Built for **SIH Problem Statement SIH26034** — Smart India Hackathon

---

## 📖 Introduction

The **Smart Legal Metrology Inspector** is a web application that uses multimodal AI (Google Gemini) to automatically inspect images of packaged commodities and check them against India's statutory labelling requirements. An inspector — or a manufacturer doing a pre-market self-check — simply uploads or captures a photo of a product's packaging, and the system extracts every mandatory declaration, maps it to the exact rule it must satisfy, and returns a structured, evidence-backed compliance report in seconds.

It is designed as a working prototype for enforcement officers under the Department of Consumer Affairs, Government of India, but is equally usable by brand owners and packaging QA teams who want to catch violations before a product ever reaches a shelf.

## 🎯 Our Vision

To replace slow, manual, paper-based legal metrology inspections with a fast, consistent, and auditable digital process — so that every packaged product sold in India, regardless of category or manufacturer size, can be checked for consumer-protection compliance in the time it takes to snap a photo. We want to make regulatory compliance verification as accessible as taking a picture, while giving enforcement officers a defensible, evidence-linked audit trail for every decision they make.

## ❗ The Problem

Legal Metrology inspectors are responsible for verifying that every packaged commodity sold in India — food, cosmetics, electronics, general FMCG, and imported goods — carries a specific, legally mandated set of declarations (manufacturer details, net quantity, MRP, dates, consumer care information, and more). Today this is largely a manual process:

- **Slow and inconsistent**: Physical inspection of every declaration on every package is time-consuming, and outcomes vary between inspectors.
- **Error-prone**: Small but legally significant violations (a missing "inclusive of all taxes", a non-standard unit like "gms" instead of "g", an absent PIN code) are easy to miss by eye.
- **Hard to scale**: With thousands of SKUs entering the market, the number of trained inspectors cannot keep pace with the volume of packages that need checking.
- **Poor audit trails**: Paper-based or informal digital checks rarely leave behind structured, reusable evidence that can support a legal notice or penalty.
- **Fragmented rule references**: Rules are spread across the Legal Metrology Act 2009, the LMPC Rules 2011 (as amended), and FSSAI regulations, making it hard for any single officer to check everything correctly and consistently.

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

- 📸 **Image-based inspection** — upload a photo or use a device camera to scan a package.
- 🗂️ **Category-aware rule sets** — rules automatically adapt to product category (Food & Beverage, Cosmetics, General FMCG, Electronics, Imported Goods).
- 🧠 **Multimodal AI extraction** — Gemini-powered extraction of all statutory declarations with per-field confidence scores and raw text evidence.
- 🖼️ **Interactive visual overlay** — clickable bounding boxes on the package image link every extracted field back to exactly where it appears.
- ✅ **Rule-by-rule compliance engine** — each check reports status, severity (Critical/Major/Minor/Info), legal reference, findings, remedial action, and penal provision.
- 🎚️ **Configurable rule sets** — inspectors can enable/disable specific mandatory rules per category and instantly re-evaluate an existing audit against the new configuration, without re-running AI analysis.
- 📐 **Layout & readability analysis** — PDP area percentage, font legibility score, contrast rating, background interference, and lighting quality assessment.
- 🌐 **Language detection** — identifies declared languages/scripts and checks Hindi/English compliance under Rule 9.
- 📊 **Compliance score & suggested action** — an overall score and one of `APPROVE`, `ISSUE_NOTICE`, `CONFISCATE_SAMPLE`, or `PHYSICAL_INSPECTION_REQUIRED`.
- 📝 **Official inspection report** — a formatted, printable/exportable inspection certificate/notice for a single scan.
- 📚 **Batch report & registry** — a cumulative view across all inspections performed in a session, with the ability to jump back into any past result.
- 🧪 **Preloaded real-world benchmark packages** — explore the full workflow instantly using precomputed sample results, even without an API key configured.
- ⚡ **Graceful fallback handling** — clear, actionable messaging when the AI backend or API key isn't configured, with sample packages remaining fully usable.

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

**1. Grounding a general-purpose model in a specific legal framework**
*Challenge*: Off-the-shelf multimodal models don't inherently know India's Legal Metrology Act, the LMPC Rules 2011, or FSSAI packaging regulations.
*Strategy*: A detailed system prompt was engineered that explicitly encodes each relevant rule (Rule 6(1)(a), 6(1)(b), 6(1)(c), 6(1)(e), 6(11), 6(1)(d), 6(1)(g), 6(10), Rule 9, Rules 6–8) along with the specific patterns that constitute violations (e.g., non-standard units, missing "inclusive of all taxes" language), so extraction and evaluation are both legally grounded rather than generic.

**2. Producing consistent, structured output from a generative model**
*Challenge*: Free-form model responses are hard to render reliably in a UI or use for rule evaluation.
*Strategy*: The model is constrained to return a strict JSON schema (extracted declarations, bounding boxes, detected languages, layout analysis, and per-rule checks), with `responseMimeType: application/json` and a low temperature to maximize consistency, plus defensive fallbacks in `geminiService.ts` for any missing fields.

**3. Letting inspectors verify AI output rather than blindly trust it**
*Challenge*: An inspection tool that reports "FAIL" without evidence is not usable for real enforcement decisions.
*Strategy*: Every extracted field is paired with a bounding box, confidence score, and raw text snippet, and the UI links each compliance check back to the exact region of the image it depends on via the interactive canvas overlay.

**4. Supporting different product categories with different rule applicability**
*Challenge*: Not every rule applies to every category (e.g., Unit Sale Price doesn't apply the same way to Electronics, veg/non-veg logo only applies to Food & Beverage).
*Strategy*: Rules are defined with an `applicableCategories` field, and the Rule Configuration Modal lets an inspector toggle rules on/off per category, with a lightweight local re-evaluation engine (`evaluation.ts`) that recomputes compliance without needing to re-call the AI.

**5. Making the tool usable without depending on API availability**
*Challenge*: API keys, quotas, or network access shouldn't block a demo or evaluation of the tool.
*Strategy*: A curated set of real-world benchmark packages with precomputed results ships with the app, so the full UI — canvas overlay, declarations panel, compliance table, layout analysis, and reports — can be explored end-to-end offline or without a configured key.

**6. Communicating regulatory severity clearly**
*Challenge*: Not all violations carry equal legal weight.
*Strategy*: Every check carries a `CRITICAL` / `MAJOR` / `MINOR` / `INFO` severity alongside its legal reference and penal provision, and the overall result maps to an actionable outcome (`APPROVE`, `ISSUE_NOTICE`, `CONFISCATE_SAMPLE`, `PHYSICAL_INSPECTION_REQUIRED`) so a reviewing officer gets a clear next step, not just a score.

---

*Smart Legal Metrology Inspector — a prototype built for SIH Problem Statement SIH26034, supporting automated verification under the Legal Metrology (Packaged Commodities) Rules, 2011 and Section 36 of the Legal Metrology Act, 2009.*
