# Flockia - AI-powered citizen science for urban birds.

Flockia is an app that enables citizens to report urban birds sightings. It ensures that every submission is verifiable, traceable, and scientifically valuable.

This project was inspired by the urban bird monitoring initiative from [INBIOSUR (CONICET-UNS)](https://inbiosur.conicet.gov.ar/proyectopalomas/), and it serves as an independent, unofficial tool to facilitate similar data collection efforts.


---

## ✨ Key Features

- **📷 Camera-Only Reporting**: Enforces the use of the device's camera for submissions, ensuring the time and location of the report are authentic.
- **🤖 AI-Powered Analysis**: Leverages Google's Gemini model via **Genkit** to automatically count the number of birds in a photo and provide a descriptive summary of the scene.
- **📈 Real-time Data Visualization**: Features a live-updating dashboard with a report table, an interactive map with heatmaps (`react-leaflet`), and a user leaderboard.
- **🔐 Secure Authentication**: Implements a complete authentication flow with Firebase, including mandatory email verification for all users.
- **🔍 High-Integrity Data Provenance**:
  - **Cryptographic Hashing**: Each submitted photo has its SHA-256 hash stored to verify its integrity and prevent tampering.
  - **AI Model Versioning**: The exact version of the AI model used for analysis is recorded with every report, ensuring scientific reproducibility.
- **👤 User Profiles & Aliases**: Users have profiles with avatars and are assigned a unique, privacy-preserving alias (e.g., "Audaz Halcón") for public-facing leaderboards.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **AI Framework**: [Genkit](https://firebase.google.com/docs/genkit)
- **AI Model**: [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Cloud Storage)
- **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- A Firebase project.

### 2. Environment Setup

This project requires a set of environment variables to connect to Firebase and other services.

1.  Create a `.env` file in the root of the project.
2.  Copy the contents of `.env.example` (if it exists) or add the following variables:

```env
# Firebase Public Config (find these in your Firebase project settings)
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="1:..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-..."

# Genkit/Gemini Config
# Create this API key in Google AI Studio
# https://aistudio.google.com/app/apikey
GEMINI_API_KEY="AIza..."
```

### 3. Installation

Install the project dependencies using npm:

```bash
npm install
```

### 4. Running the Development Server

The application requires two separate processes to run concurrently: the Next.js web server and the Genkit AI development server.

1.  **Start the Next.js server:**
    ```bash
    npm run dev
    ```
    This will start the web application, typically on `http://localhost:9002`.

2.  **In a separate terminal, start the Genkit server:**
    ```bash
    npm run genkit:watch
    ```
    This starts the Genkit process that exposes your AI flows. It will watch for changes and restart automatically.

Once both servers are running, you can access the application in your browser.
