# Ekatraa — AI Event Planner

> A premium, mobile-first AI-powered event planning web application built with **React + FastAPI**.

![Ekatraa AI Event Planner](frontend/public/ekatraa-logo.png)

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [UI Screens](#ui-screens)
- [Bonus Features](#bonus-features)
- [Design System](#design-system)
- [Environment & Deployment](#environment--deployment)

---

## Overview

**Ekatraa** is an AI-powered event planning assistant. Users enter their event details (type, city, guests, budget, date) and the AI engine instantly generates a complete event plan including:

- Recommended services tailored to event type and guest count
- Proportional budget distribution across categories
- A smart planning timeline with milestones
- A vendor checklist
- Curated local vendor suggestions

The app follows a clean **3-screen flow**:

```
Splash Screen  →  Event Details Form  →  AI Event Plan
```

---

## Live Demo

| Layer | URL |
|-------|-----|
| **Backend API** | https://ekatraa-api.onrender.com |
| **API Docs (Swagger)** | https://ekatraa-api.onrender.com/docs |
| **Frontend (local dev)** | http://localhost:5175 |

---

## Features

### Core
| Feature | Description |
|---------|-------------|
| 🎯 **Event Types** | Wedding, Birthday, Corporate, Engagement, Baby Shower, Housewarming |
| 🧠 **AI Rule Engine** | Dynamic service recommendations based on event type + guest scale |
| 💰 **Budget Planner** | Proportional allocation across venue, catering, decor, photography, etc. |
| 📅 **Smart Timeline** | Auto-generated milestones at 90, 60, 30, and 7 days before event |
| ✅ **Interactive Checklist** | Tap-to-check tasks with completion progress counter |
| 🏪 **Vendor Suggestions** | Verified vendor cards with ratings, category, and price range |
| 🤖 **AI Insights** | Event-specific money-saving tips and planning advice |

### Bonus Features
| Feature | Description |
|---------|-------------|
| 🌙 **Dark Mode** | Full dark theme (deep navy palette) with localStorage persistence |
| 🎚️ **Budget Optimizer** | Interactive slider to reduce venue cost and auto-redistribute savings |
| 📄 **Export to PDF** | One-click branded PDF export with all plan sections |

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.x | Runtime |
| **FastAPI** | 0.139.0 | REST API framework |
| **Uvicorn** | 0.51.0 | ASGI server |
| **Pydantic** | 2.13.4 | Request validation & data models |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.x | UI framework |
| **Vite** | 8.x | Build tool & dev server |
| **Tailwind CSS** | 4.x | Utility-first CSS |
| **jsPDF** | 4.x | PDF generation |
| **html2canvas** | 1.4.x | Canvas rendering (available) |

---

## Project Structure

```
ekatraa-assignment/
├── main.py                  # FastAPI backend — rule engine & API
├── requirements.txt         # Python dependencies
│
└── frontend/
    ├── index.html           # App shell — fonts, favicon, meta tags
    ├── vite.config.js       # Vite + Tailwind plugin config
    ├── package.json         # Node dependencies
    │
    ├── public/
    │   ├── ekatraa-logo.png # Brand logo (favicon + splash)
    │   ├── favicon.svg      # Original favicon
    │   └── icons.svg        # Icon sprite
    │
    └── src/
        ├── main.jsx         # React entry point
        ├── index.css        # Global design system (tokens, animations, components)
        └── App.jsx          # All screens, components, state & logic
```

### `App.jsx` Architecture

```
App (Root)
├── DarkModeContext          # Global dark mode state via React Context
│
├── SplashScreen             # Screen 1 — Landing page
├── LoadingScreen            # Transition — AI generating plan
├── EventDetailsScreen       # Screen 2 — Event details form
│   ├── Event Type Grid
│   ├── City / Guests / Budget / Date inputs
│   └── Additional Requirements textarea
│
└── ResultScreen             # Screen 3 — AI Event Plan
    ├── Hero Banner
    ├── Tab Navigation (Services | Budget | Timeline | Checklist | Vendors)
    ├── SectionCard × 5
    │   ├── Required Services
    │   ├── Budget Distribution + BudgetOptimizer (slider)
    │   ├── Event Timeline
    │   ├── Checklist (interactive)
    │   └── Suggested Vendors
    ├── AI Insights card
    └── Export Plan (PDF) + Plan Another Event
```

---

## Getting Started

### Prerequisites

- **Python 3.9+**
- **Node.js 18+** and **npm 9+**
- **Git**

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/smarikaprime06/ekatraa-assignment.git
cd ekatraa-assignment

# 2. Create and activate a virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Start the FastAPI server
python main.py
```

The backend will be available at **http://localhost:8000**.  
Interactive API docs at **http://localhost:8000/docs**.

---

### Frontend Setup

```bash
# In a new terminal, navigate to the frontend directory
cd ekatraa-assignment/frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will be available at **http://localhost:5175** (or next available port).

> **Note:** The frontend is currently configured to call the **deployed Render API** (`https://ekatraa-api.onrender.com`). To switch to a local backend, update the fetch URL in `frontend/src/App.jsx`:
> ```js
> // Change this line inside handleSubmit:
> const response = await fetch('http://localhost:8000/api/v1/predict-plan', { ... });
> ```

---

### Build for Production

```bash
cd frontend
npm run build
# Output will be in frontend/dist/
```

---

## API Reference

### `POST /api/v1/predict-plan`

Generates a complete AI event plan.

**Request Body**

```json
{
  "event_type": "wedding",
  "city": "Mumbai",
  "guests": 150,
  "budget": 500000,
  "event_date": "2026-12-15"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event_type` | `string` | ✅ | `wedding`, `corporate`, `birthday` (others default to `wedding`) |
| `city` | `string` | ✅ | City where the event is held |
| `guests` | `integer` | ✅ | Number of guests |
| `budget` | `float` | ✅ | Total budget in INR (₹) |
| `event_date` | `string` | ✅ | Date in `YYYY-MM-DD` format |

**Response Body**

```json
{
  "message": "Successfully planned your wedding in Mumbai!",
  "required_services": [
    "Banquet Hall", "Decoration", "Catering", "Photography",
    "Makeup", "DJ", "Invitation Cards", "Live Food Counters"
  ],
  "budget_distribution": [
    { "category": "Venue & Hall", "allocated": 175000.0, "percentage": 35 },
    { "category": "Catering",     "allocated": 150000.0, "percentage": 30 },
    { "category": "Decoration",   "allocated": 75000.0,  "percentage": 15 },
    { "category": "Photography",  "allocated": 50000.0,  "percentage": 10 },
    { "category": "Miscellaneous","allocated": 50000.0,  "percentage": 10 }
  ],
  "timeline": [
    { "task": "Book Venue & Caterer",  "date": "2026-09-16" },
    { "task": "Finalize Decor & DJ",   "date": "2026-10-16" },
    { "task": "Send Invitations",       "date": "2026-11-15" },
    { "task": "Final Headcount",        "date": "2026-12-08" }
  ]
}
```

### AI Logic Rules

| Condition | Effect |
|-----------|--------|
| `guests > 100` | Adds **Live Food Counters** to services |
| `guests > 300` | Adds **Valet Parking** + **Security & Crowd Control** |
| Unknown `event_type` | Falls back to **wedding** rules |

---

## UI Screens

### Screen 1 — Splash
- Ekatraa brand logo
- Hero heading with AI tagline
- Feature pills: AI-Powered Plan · Budget Breakdown · Smart Timeline · Vendor Match
- **Start Planning** CTA button

### Screen 2 — Event Details Form
- 6-type event selector grid with emoji cards
- Inputs: City, Guests, Budget (with per-guest live calc), Event Date, Additional Requirements
- Smart hints: guest count triggers contextual tips
- Progress indicator: Step 2 of 3

### Screen 3 — AI Event Plan
- **Hero banner** with event meta chips (city, guests, budget, date)
- **Sticky tab bar**: Services · Budget · Timeline · Checklist · Vendors
- Animated progress bars on Budget section
- Interactive checklist with completion counter
- **Budget Optimizer slider** — reduce venue, savings auto-redistributed
- Vendor cards with ratings, price range, verified badge
- AI Suggestions card
- **Export Plan as PDF** button + Plan Another Event

---

## Bonus Features

### 🌙 Dark Mode

- Toggle icon (☀️/🌙) visible on every screen (top-right corner)
- Deep navy dark palette: Background `#0F172A`, Cards `#1E293B`, Borders `#334155`
- All text, cards, inputs, and interactive elements adapt seamlessly
- Theme preference **persisted in `localStorage`** — survives page refresh
- Implemented via **React Context API** (`DarkModeContext`) — zero prop-drilling

### 🎚️ Budget Optimizer

Located inside the Budget Distribution card on the Results screen.

- Detects the **Venue/Hall** category from the API response automatically
- Drag the slider to reduce venue allocation (min 5%, max = original %)
- **Saved funds** are mathematically redistributed across all other categories proportionally
- Live **▲ / ▼ indicators** on each row
- Green **"Saving ₹X"** badge shows freed-up amount in real-time
- **Reset to original** link snaps back to API-provided values

### 📄 Export Plan as PDF

Built with **jsPDF** — no screenshot lag, instant generation.

**PDF includes:**
1. **Header band** — Ekatraa orange banner with event type + generation date
2. **Event meta row** — City · Guests · Budget · Date
3. **Required Services** — pill tags with emoji icons
4. **Budget Distribution** — bars drawn natively in PDF with amounts and percentages
5. **Event Timeline** — dot + connector layout with days-before labels
6. **Checklist** — printable checkbox items
7. **Suggested Vendors** — avatar, name, category, rating, price
8. **AI Suggestions** — bulleted tips
9. **Footer** — page numbers + branding on every page

File saved as: `Ekatraa_Wedding_Plan_2026-12-15.pdf`

---

## Design System

### Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Primary | `#A34D12` | `#C97040` | Buttons, accents, icons |
| Accent | `#F15A24` | `#F15A24` | Highlights, selected states |
| Gold | `#FDBA3B` | `#FDBA3B` | Event day, star ratings |
| Background | `#FFF9F5` | `#0F172A` | Page background |
| Card | `#FFFFFF` | `#1E293B` | Card surfaces |
| Border | `#ECECEC` | `#334155` | Dividers, input borders |
| Text | `#222222` | `#F1F5F9` | Primary text |
| Text Secondary | `#6B7280` | `#94A3B8` | Subtitles, labels |
| Success | `#16A34A` | `#4ADE80` | Checklist, verified badges |

### Typography

| Role | Font | Weights |
|------|------|---------|
| Headings | **Playfair Display** (serif) | 400, 600, 700, 800 |
| Body / UI | **Inter** (sans-serif) | 300, 400, 500, 600, 700 |

### Component Classes (CSS)

| Class | Description |
|-------|-------------|
| `.ek-card` | Standard card — white bg, 20px radius, warm shadow |
| `.ek-btn-primary` | Main CTA — orange bg, bold text, hover lift |
| `.ek-btn-outline` | Secondary — transparent with orange border |
| `.ek-btn-ghost` | Tertiary — transparent text button |
| `.ek-input` | Form input — 14px radius, warm focus ring |
| `.ek-chip` | Small label pill — orange tinted |
| `.ek-tab-bar` | Scrollable horizontal tab container |
| `.ek-tab` | Individual tab button |
| `.ek-vendor-card` | Vendor row card with hover effect |
| `.ek-bar-track` | Budget bar background track |
| `.ek-bar-fill` | Animated gradient budget bar fill |
| `.anim-fade-up` | Fade + slide up entrance animation |
| `.delay-{N}` | Animation delay utility (50ms–700ms) |

---

## Environment & Deployment

### Backend — Render

The FastAPI backend is deployed on **Render** as a web service.

- **Live URL:** `https://ekatraa-api.onrender.com`
- **Start command:** `uvicorn main:app --host 0.0.0.0 --port 8000`
- **Runtime:** Python 3.x
- **CORS:** Open (`allow_origins=["*"]`) — safe for demo, restrict for production

### Frontend — Local / Static Host

The Vite frontend can be deployed to any static host (Netlify, Vercel, GitHub Pages):

```bash
cd frontend
npm run build
# Deploy the generated `dist/` folder
```

### Environment Variables

No `.env` file is required for this project. The API URL is hardcoded in `App.jsx`. To make it configurable:

```js
// frontend/src/App.jsx
const API_URL = import.meta.env.VITE_API_URL || 'https://ekatraa-api.onrender.com';
const response = await fetch(`${API_URL}/api/v1/predict-plan`, { ... });
```

Then create `frontend/.env`:
```env
VITE_API_URL=https://ekatraa-api.onrender.com
```

---

## Author

**Smarika Behera**  
Built as part of the Ekatraa AI Event Planner assignment.

---

*Powered by Ekatraa AI · FastAPI · React · jsPDF*
