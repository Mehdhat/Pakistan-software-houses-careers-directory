# Pakistan Software Houses Careers Directory

A beautifully curated, high-performance career directory and AI-powered resume positioning engine designed for developers in Pakistan. It matches developer profiles with top software export houses and product startups across major hubs (Lahore, Karachi, Islamabad, Hyderabad, Rawalpindi, and Remote).

---

## 🚀 Key Features

*   **Curated High-Density Directory**: Complete intelligence profiles of top-tier Pakistani software houses (including Systems Limited, NetSol, 10Pearls, Arbisoft, Devsinc, Contour, VentureDive, Afiniti, and more).
*   **Gemini CV Matching Engine**: Zero-friction, server-side secure analysis using the Google GenAI SDK. Users can upload a resume to instantly output dynamic scorecards matching individual competencies to active technical focuses.
*   **Adaptive Cover Letter Builder**: Automatically draft tailored application subjects and email bodies aligned directly with the target company's culture snippets, tech specialties, and HR inbox structure.
*   **No-Resume Interactive Mode**: A dynamic client-side form customizes coverage matrices over target engineering spheres, stack levels, and experience ranges.
*   **Intuitive Visual Filters**: Filter by major tech centers (Islamabad, Lahore, Karachi, Remote, etc.), specialty domains (Python, Java, AWS, React, Fintech, e-commerce), and engineering classes.
*   **Direct Application Dispatches**: Multi-tier redirection enables candidates to visit homepages or trigger precompiled multi-part `mailto:` applications to official HR teams in one click.

---

## 🛠️ Technological Stack

*   **Frontend SPA**: [React 18](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescript.org/).
*   **Server Framework**: [Express](https://expressjs.com/) with native API endpoints proxying secure requests.
*   **AI Integration**: Native [Google GenAI TypeScript SDK](https://github.com/googleapis/google-genai-nodejs) utilizing backend secrets.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) containing clean, responsive, high-contrast typography metrics.
*   **Transitions & Motion**: Custom spring animations and Micro-interactions powered by `motion/react`.
*   **Visual Assets**: Scalable vector indicators and icon arrays from [`lucide-react`](https://lucide.github.io/lucide-react/).

---

## 📂 Project Architecture

```
.
├── server.ts                 # Full-stack Express server with integrated Vite rendering pipeline
├── src/
│   ├── App.tsx               # Main application layout and state management center
│   ├── main.tsx              # Component mounting and initialization point
│   ├── types.ts              # Global type interfaces, filters, and CV matching matrices
│   ├── index.css             # Unified style sheet importing Tailwind and Google Fonts
│   ├── components/
│   │   ├── Header.tsx        # Hero banner with real-time statistics
│   │   ├── FilterControls.tsx# Responsive search panels and state modifiers
│   │   ├── CVMatcher.tsx     # Drag-and-drop secure file parser & AI progress status bar
│   │   ├── CompanyCard.tsx   # Interactive corporate profiles with specialty tags
│   │   └── DraftModal.tsx     # Multi-action dynamic email pre-filler and clipboard console
│   └── data/
│       └── softwareHouses.ts # Structured list of premier Pakistani tech houses
```

---

## 🔮 Installation & Local Run

### 1. Clone & Install Dependencies
First, clone the workspace repository, and install the necessary dependencies:
```bash
npm install
```

### 2. Set Up Environment Secrets
Create a `.env` file at the root of the project (reference `.env.example`):
```env
# Google Gemini API key required for resume analysis services (kept backend-side)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Initiate the Development Server
Execute the developer runtime to spin up the local hosting interface:
```bash
npm run dev
```
The server will boot up and be accessible locally at `http://localhost:3000`.

### 4. Build for Production
To obtain compiled and bundled static assets with integrated esbuild backend bundles:
```bash
npm run build
npm start
```

---

## 🤝 Community & Support

Our objective is to streamline professional connections for the local tech ecosystem. Please ensure your portfolios and CV uploads are formatted clean and in valid `.pdf` or text structures.

*Designed and engineered with care to empower Pakistan's engineering community.*
