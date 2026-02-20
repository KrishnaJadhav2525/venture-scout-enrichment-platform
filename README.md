# 🔍 VCScout — VC Intelligence Platform

A lightweight VC analyst sourcing tool for discovering, enriching, and tracking startups. Browse companies, filter by investment thesis, enrich profiles with live AI-powered data from company websites, and save companies to curated lists.

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-orange?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel)

---

## ✨ Features

- **🏢 Company Discovery** — Browse 20+ startups with search, 4 filter dropdowns (Industry, Stage, Location, Headcount), sortable table, and pagination
- **⚡ Live AI Enrichment** — One-click website scraping via Jina AI + structured extraction via Groq (Llama 3.3 70B) — completely free
- **📝 Analyst Notes** — Auto-saving notes per company, persisted in localStorage
- **📋 Curated Lists** — Save companies to custom lists, export as CSV or JSON
- **🔖 Saved Searches** — Bookmark any search + filter combo and re-run later
- **🔗 Shareable URLs** — All filters and search state synced to URL params

---

## 🛠️ Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Framework | Next.js 14 (App Router) | Free |
| Styling | Tailwind CSS | Free |
| AI Extraction | Groq API (Llama 3.3 70B) | Free |
| Web Scraping | Jina AI Reader (`r.jina.ai`) | Free |
| Persistence | localStorage | Free |
| Deployment | Vercel | Free |

**Total cost: ₹0**

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A free Groq API key from [console.groq.com/keys](https://console.groq.com/keys)

### Setup

```bash
git clone https://github.com/your-username/venture-scout-enrichment-platform.git
cd venture-scout-enrichment-platform
npm install
cp .env.example .env.local
```

Add your Groq API key to `.env.local`:

```env
GROQ_API_KEY=gsk_your_api_key_here
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔑 Environment Variables

| Variable | Description | Where to get it |
|---|---|---|
| `GROQ_API_KEY` | Groq API key for AI extraction | [console.groq.com/keys](https://console.groq.com/keys) (free) |

---

## 📁 Project Structure

```
app/
├── layout.tsx                 # Root layout with sidebar + topbar
├── page.tsx                   # Redirects to /companies
├── companies/
│   ├── page.tsx               # Company list with search, filters, table
│   └── [id]/page.tsx          # Company profile + enrichment
├── lists/page.tsx             # Manage saved lists, export
├── saved/page.tsx             # Saved searches, re-run
└── api/enrich/route.ts        # POST handler (Jina + Groq, server-side)

components/
├── Sidebar.tsx                # Dark nav sidebar with mobile toggle
├── Topbar.tsx                 # Global search bar
├── CompanyTable.tsx           # Sortable company table
├── FilterBar.tsx              # Filter dropdowns + active chips
├── EnrichmentCard.tsx         # AI enrichment results display
├── SignalsTimeline.tsx        # Vertical signal timeline
├── NoteEditor.tsx             # Auto-saving analyst notes
├── SaveToListModal.tsx        # Save company to list modal
└── ExportButton.tsx           # CSV/JSON export

lib/
├── gemini.ts                  # Groq API helper + JSON extraction
├── localStorage.ts            # Typed localStorage CRUD helpers
└── types.ts                   # TypeScript interfaces

data/
└── companies.json             # 20 mock startups with real websites
```

---

## 🏗️ Architecture

```
Browser → /companies (search + filter) → /companies/[id] (profile)
                                              ↓
                                        "Enrich" button
                                              ↓
                                    POST /api/enrich (server-side)
                                              ↓
                                    Jina AI Reader (scrape website)
                                              ↓
                                    Groq API (extract structured data)
                                              ↓
                                    Results cached in localStorage
```

> **Security:** The Groq API key lives exclusively in the server-side API route (`/api/enrich`). It never reaches the client bundle.

---

## 📄 Pages

| Route | Description |
|---|---|
| `/companies` | Browse, search, and filter startups with sortable table |
| `/companies/[id]` | Company profile with enrichment, notes, and signals |
| `/lists` | Create and manage curated company lists with export |
| `/saved` | Re-run saved search + filter combinations |

---

## 🚢 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. In **Settings → Environment Variables**, add `GROQ_API_KEY`
4. Click **Deploy**

---

## 📜 License

MIT
