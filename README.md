# DMSetterAssistantnew (@alexneilan)
### High-Ticket DM Setter AI Assistant for Sustainable Change

A specialized pair-programming and conversation assistant for high-ticket setters using the **Alex Neilan / Sustainable Change** sales spin.

---

## ⚡ Key Features

1. **DM Scratchpad (Instant Diagnosis & 3-Variation Output)**:
   - Paste any raw conversation snippet from Instagram, Facebook Messenger, or WhatsApp.
   - **Lead Intelligence**: Automatically extracts lead name, current funnel stage, identified health obstacles, and qualification alerts.
   - **Multi-Angle Humanized Responses**:
     - **Option 1 (Direct & Momentum-Building)**: Drives the conversation assertively to the next stage or call pitch.
     - **Option 2 (Deeply Empathetic)**: Validates menopause, chronic pain, injuries, or overwhelm before bridging into the next question.
     - **Option 3 (Short & Casual FUP)**: Low-friction, natural one-liner DM.
   - **1-Click Copy** to clipboard with instant visual feedback.
   - **Why This Message**: Strategic rationale detailing the sales psychology, objection handled, and next objective.

2. **Few-Shot Learning & Gold Benchmark Bank**:
   - Every time a great reply is generated, click **"Save as Benchmark"**.
   - Gemini dynamically loads these benchmark examples as few-shot in-context learning to continuously mirror your exact phrasing and tone.

3. **Master Spin Knowledge Base**:
   - Pre-loaded with the complete Alex Neilan spin:
     - Stage 0: Initial Weight & Height (BMI check, "One stone VETT later" note)
     - Stage 1: Question 1 (Core Barriers)
     - Stage 2: Question 2 Deep Dives (Menopause, Injuries, Willpower, Stress, Time, Thyroid, Sciatica, etc.)
     - Stage 3: Previous Diets & Knowledge Gaps (Age gap, Non-personalized diets)
     - Stage 4: WHY NOW (Fan belt analogy, 5 years from now, 3 reasons)
     - Stage 5: Pain Generation & Medical History
     - Stage 6: The 1-on-1 Call Pitch (Normal, Scholarship, Medical)
     - Stage 7: Job Vetting & Disqualification (< £35k salary, Single Mum, Vett message, Scholarship downsell)
     - Stage 8: TPS Pre-Call Training Pack & Waitlist
     - Complete Objections & Rebuttals (Cost, Scam check with HCPC register, Trustpilot, etc.)
   - Includes **"Paste New Full Spin"** importer so you can paste revised scripts anytime.

4. **100% Free Cloud Hosting Architecture**:
   - **Frontend**: Vercel (Edge React SPA)
   - **Backend**: Render (Node.js + Express API)
   - **Database**: Supabase (Free PostgreSQL with automatic local JSON fallback)

---

## 🚀 Running Locally

### Step 1: Start Backend (Port 5000)
```bash
cd server
npm install
npm run dev
```
The backend will run on `http://localhost:5000`.

### Step 2: Start Frontend (Port 3000)
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## ☁️ 100% Free Cloud Deployment Guide

### 1. Database: Supabase (Free PostgreSQL)
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the Supabase Dashboard, go to **SQL Editor** -> **New Query**.
3. Copy and paste the contents of `server/schema.sql` and click **Run**.
4. Go to **Project Settings** -> **API**, and copy your `Project URL` and `anon public key`.

### 2. Backend: Render (Free Web Service)
1. Push your repository to GitHub.
2. Go to [render.com](https://render.com) and create a new **Web Service**.
3. Select your GitHub repository:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY` = your_gemini_api_key_here
   - `GEMINI_MODEL` = `gemini-2.5-flash`
   - `SUPABASE_URL` = (Your Supabase project URL)
   - `SUPABASE_KEY` = (Your Supabase anon key)
5. Click **Deploy Web Service**. Render will give you a public URL (e.g. `https://your-setter-backend.onrender.com`).

### 3. Frontend: Vercel (Free Edge React)
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your repository:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
3. In **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://your-setter-backend.onrender.com` (your Render URL from step 2)
4. Click **Deploy**. Your assistant will be live on Vercel with HTTPS!

---

## 🎯 Model Comparison & Recommendations

| Model | Speed / Latency | Reasoning & Empathy | Recommended Use Case |
|---|---|---|---|
| **`gemini-2.5-flash`** (Default) | ⚡ 1-2s | ⭐⭐⭐⭐ High | Best for fast DM pacing with live prospects |
| **`gemini-3.8-flash`** | ⚡ 1-3s | ⭐⭐⭐⭐⭐ Highest | Best for ultra-human, non-robotic tone |
| **`gemini-2.5-pro`** | ⏱️ 4-8s | ⭐⭐⭐⭐⭐ Elite | Deep analysis for tricky medical / cost objections |
