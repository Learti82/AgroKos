# 🚀 AgroKos — Beginner Setup Guide

This guide assumes you've **never run a web project before**. Follow it top to
bottom. Copy/paste the commands exactly.

> **Two modes:**
> - **Demo mode** (Parts 0–2): the app runs immediately with seeded Kosovo data. No accounts, no keys. **Start here.**
> - **Live mode** (Parts 3–6): connect real accounts (Supabase database + Clerk login + Mapbox maps). This prepares your keys. See the note in Part 7 about the code wiring still required to make them active.

---

## Part 0 — Install the tools (one time)

You need three free programs.

### 1. Node.js (runs the app)
- Go to **https://nodejs.org**
- Download the **LTS** version (the big green button, e.g. "20.x LTS")
- Open the installer, click Next/Next/Finish (default options are fine)
- **Check it worked:** open a terminal and type:
  ```bash
  node --version
  ```
  You should see something like `v20.x.x` (must be 18.17 or higher).

> **How to open a terminal:**
> - **Windows:** press the Windows key, type `cmd`, press Enter.
> - **Mac:** press `Cmd+Space`, type `Terminal`, press Enter.

### 2. Git (downloads the code)
- Go to **https://git-scm.com/downloads**, download for your OS, install with defaults.
- Check: `git --version` → should print a version number.

### 3. VS Code (edit files — optional but recommended)
- Go to **https://code.visualstudio.com**, download, install.

---

## Part 1 — Get the code onto your laptop

In your terminal, copy the project from GitHub:

```bash
git clone https://github.com/Learti82/AgroKos.git
cd AgroKos
git checkout claude/kind-bell-uEGno
```

- `git clone` downloads the project into a folder called `AgroKos`.
- `cd AgroKos` moves into that folder.
- `git checkout ...` switches to the branch that has the app.

> 💡 If `git clone` asks for a login, the repo may be private — log in to GitHub
> in your browser first, or use the green **Code → Download ZIP** button on the
> GitHub page and unzip it instead.

---

## Part 2 — Run it (Demo mode) 🎉

Still in the `AgroKos` folder, run these two commands:

```bash
npm install
npm run dev
```

- `npm install` downloads the building blocks the app needs (takes 1–2 min the first time). You'll see a progress bar — wait until it finishes.
- `npm run dev` starts the app. When you see **"Ready in … ✓ Local: http://localhost:3000"**, it's running.

Now open your web browser and go to:

```
http://localhost:3000
```

You'll see the landing page. Click **"Fillo Falas"** or **"Shiko Demo"** to enter
the dashboard with full seeded Kosovo data. 🌿

> **To stop the app:** click in the terminal and press `Ctrl + C`.
> **To start it again later:** `cd AgroKos`, then `npm run dev`.

**That's it for seeing the app.** Everything works in demo mode. The rest of this
guide is only if you want real login + a real database.

---

## Part 3 — Create the database (Supabase) 🗄️

Supabase is a free cloud PostgreSQL database.

1. Go to **https://supabase.com** → click **Start your project** → sign up (GitHub login is easiest).
2. Click **New project**.
   - **Name:** `agrokos`
   - **Database Password:** click *Generate a password* and **save it somewhere** (you'll rarely need it, but keep it).
   - **Region:** pick the closest one (e.g. *Frankfurt (eu-central-1)* for Kosovo).
   - Click **Create new project** and wait ~2 minutes while it sets up.
3. **Get your keys:** in the left sidebar go to **Project Settings (gear icon) → API**. You'll need three values:
   - **Project URL** → e.g. `https://abcdxyz.supabase.co`
   - **anon public** key (a long string)
   - **service_role** key (click *Reveal* — **keep this secret**, never share it)
4. **Create the tables:** in the left sidebar click **SQL Editor → New query**.
   - Open the file `docs/schema.sql` from the project (in VS Code), copy **all** of it.
   - Paste it into the Supabase SQL editor and click **Run**.
   - You should see "Success". This creates all tables (fields, crops, activities, etc.) and the security rules.

Keep the three values (URL, anon, service_role) handy — you'll paste them in Part 6.

---

## Part 4 — Create login (Clerk) 🔐

Clerk handles sign-up / sign-in.

1. Go to **https://clerk.com** → **Sign up** (free).
2. Click **Create application**.
   - **Name:** `AgroKos`
   - **Sign-in options:** turn on **Email** and (optional) **Google**.
   - Click **Create application**.
3. Clerk shows you your **API keys** immediately. Copy these two:
   - **Publishable key** → starts with `pk_test_...`
   - **Secret key** → starts with `sk_test_...` (**keep secret**)
4. **Set the redirect paths:** in the Clerk dashboard go to **Configure → Paths** (or "Account Portal" → Paths) and set:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/onboarding`
5. **(Later) Webhook** — to auto-create a farmer profile when someone signs up:
   - **Configure → Webhooks → Add Endpoint**
   - Endpoint URL: `https://YOUR-DEPLOYED-SITE/api/webhooks/clerk` (you set this once the site is deployed)
   - Subscribe to the `user.created` event
   - Copy the **Signing Secret** (`whsec_...`)
   - *(Skip this step while testing locally; it's only needed in production.)*

---

## Part 5 — Maps (Mapbox) 🗺️ — optional

The app already draws fields without Mapbox. A token only adds satellite imagery.

1. Go to **https://mapbox.com** → sign up (free).
2. On your account page, copy the **Default public token** (starts with `pk.eyJ...`).

---

## Part 6 — Put the keys into the project

In the `AgroKos` folder, make a copy of the example settings file:

```bash
cp .env.example .env.local
```

(On Windows, if `cp` doesn't work: `copy .env.example .env.local`)

Open `.env.local` in VS Code and fill in the values you collected. It should look
like this (replace the `...` with **your** real keys):

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...        # leave blank for now if testing locally
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdxyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Mapbox (optional)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **`.env.local` is private.** It's already in `.gitignore`, so it will **not**
> be uploaded to GitHub. Never paste your `service_role` or `secret` keys anywhere public.

After editing, **stop the app** (`Ctrl+C`) and **start it again** (`npm run dev`)
so it picks up the new settings.

---

## Part 7 — Going live (now built in ✅)

Real **Clerk login** and **Supabase per-user data** are now wired into the app.
Here's how to turn it on:

### 1. Create the database tables
Two options:
- **If your Supabase ↔ GitHub integration is active:** it applies the migration
  in `supabase/migrations/0001_init.sql` automatically when the branch is pushed.
- **Manual fallback:** open Supabase → **SQL Editor → New query**, paste the
  contents of `supabase/migrations/0001_init.sql`, click **Run**.

### 2. Make sure your keys are in `.env.local` (Parts 3–6)

### 3. Restart the app
```bash
npm run dev
```

### What you'll see when it's live
- Visiting the app sends you to a **real Clerk sign-up / sign-in** screen.
- After signing up you go through onboarding, then land on your dashboard.
- **The first time you log in, your account is automatically seeded** with the
  Kosovo demo farm (3 fields, crops, activities, etc.) so it's never empty —
  and from then on it's *your* data, saved in *your* Supabase database.
- A user menu (avatar, top-right) lets you sign out.

### The safety net 🛟
If a key is missing or wrong, or the tables aren't created yet, the app
**automatically falls back to demo mode** instead of crashing. So you can never
end up with a broken screen — worst case you see the shared demo data and a note
in the terminal. Check the terminal for `[AgroKos] Supabase read failed …` if
your data isn't showing; it usually means the migration hasn't run yet.

### How the pieces connect (under the hood)
- `src/middleware.ts` — protects `/dashboard` with Clerk when configured.
- `src/app/layout.tsx` — mounts `<ClerkProvider>` only when keys are present.
- `src/lib/supabase/server.ts` — server-only Supabase client (service-role key).
- `src/lib/data/repository.ts` — reads your data, seeds new accounts, falls back to demo.
- `src/components/DataProvider.tsx` — feeds your data to every dashboard page.
- `src/app/api/webhooks/clerk/route.ts` — creates your profile on sign-up (production).

---

## Common problems

| Problem | Fix |
|--------|-----|
| `node` / `npm` "not recognized" | Node didn't install correctly, or close & reopen the terminal. Reinstall Node LTS. |
| `npm install` fails | Check your internet; try again. Make sure you're inside the `AgroKos` folder. |
| Port 3000 already in use | Something else is running. Run `npm run dev -- -p 3001` and open `http://localhost:3001`. |
| Page is blank / errors | Stop (`Ctrl+C`) and run `npm run dev` again. Check the terminal for red error text. |
| Changed `.env.local` but nothing changed | You must stop and restart `npm run dev`. |

---

Happy farming! 🌾 — *AgroKos · Bujqësia Dixhitale*
