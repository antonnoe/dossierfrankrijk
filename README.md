# DossierFrankrijk

Je persoonlijke dossier voor het leven in Frankrijk.

---

## 🚀 Snelle Start (30 minuten)

### Stap 1: Supabase Project Aanmaken (10 min)

1. Ga naar [supabase.com](https://supabase.com) en maak een gratis account
2. Klik **"New Project"**
3. Vul in:
   - **Name:** `dossierfrankrijk`
   - **Database Password:** kies een sterk wachtwoord (bewaar dit!)
   - **Region:** `West EU (Ireland)` (dichtst bij)
4. Wacht ~2 minuten tot project klaar is

### Stap 2: Database Tabellen Maken (5 min)

1. In Supabase, ga naar **SQL Editor** (linker menu)
2. Klik **"New Query"**
3. Open het bestand `supabase-schema.sql` uit deze repo
4. Kopieer de **volledige inhoud** en plak in de SQL Editor
5. Klik **"Run"** (groene knop)
6. Je zou moeten zien: "Success. No rows returned"

### Stap 3: Email Templates Aanpassen (5 min)

1. In Supabase, ga naar **Authentication** > **Email Templates**
2. Klik op **"Magic Link"**
3. Pas de template aan (optioneel):

```html
<h2>Inloggen bij DossierFrankrijk</h2>
<p>Klik op de onderstaande link om in te loggen:</p>
<p><a href="{{ .ConfirmationURL }}">Inloggen</a></p>
<p>Deze link is 15 minuten geldig en kan maar één keer gebruikt worden.</p>
<p>Heb je deze email niet aangevraagd? Dan kun je hem negeren.</p>
```

4. Klik **"Save"**

### Stap 4: API Keys Ophalen (2 min)

1. In Supabase, ga naar **Settings** (tandwiel) > **API**
2. Noteer:
   - **Project URL** → Dit wordt `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Dit wordt `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Stap 5: GitHub Repository (5 min)

1. Ga naar [github.com](https://github.com) en log in (of maak account)
2. Klik **"+"** > **"New repository"**
3. Vul in:
   - **Name:** `dossierfrankrijk`
   - **Visibility:** Private (aangeraden)
4. Klik **"Create repository"**
5. Upload alle bestanden uit deze map naar de repo:
   - Sleep de bestanden naar de GitHub pagina, of
   - Gebruik git command line (zie onder)

**Via command line:**
```bash
cd dossierfrankrijk
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/JOUW-USERNAME/dossierfrankrijk.git
git push -u origin main
```

### Stap 6: Vercel Deployment (5 min)

1. Ga naar [vercel.com](https://vercel.com) en log in met GitHub
2. Klik **"Add New..."** > **"Project"**
3. Selecteer je `dossierfrankrijk` repository
4. Bij **"Environment Variables"** voeg toe:
   - `NEXT_PUBLIC_SUPABASE_URL` = jouw Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = jouw anon key
5. Klik **"Deploy"**
6. Wacht ~2 minuten

### Stap 7: Redirect URL Instellen (2 min)

1. Kopieer je Vercel URL (bijv. `dossier-frankijk.vercel.app`)
2. In Supabase, ga naar **Authentication** > **URL Configuration**
3. Bij **"Site URL"** vul in: `https://jouw-app.vercel.app`
4. Bij **"Redirect URLs"** voeg toe: `https://jouw-app.vercel.app/auth/callback`
5. Klik **"Save"**

---

## ✅ Testen

1. Ga naar je Vercel URL
2. Vul je email in
3. Check je inbox voor de magic link
4. Klik de link → je bent ingelogd!

---

## 📁 Bestandsstructuur

```
dossierfrankrijk/
├── app/
│   ├── globals.css        # Globale styles + fonts
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage (redirect)
│   ├── login/
│   │   └── page.tsx       # Login pagina met magic link
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts   # Magic link callback handler
│   └── dashboard/
│       ├── layout.tsx     # Dashboard layout met auth check
│       └── page.tsx       # Hoofd dashboard
├── components/
│   ├── DashboardHeader.tsx
│   ├── FolderList.tsx
│   ├── QuickStats.tsx
│   └── AddItemModal.tsx
├── lib/
│   ├── supabase-client.ts # Browser Supabase client
│   └── supabase-server.ts # Server Supabase client
├── public/
│   └── (favicons etc.)
├── .env.example           # Voorbeeld environment variables
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── supabase-schema.sql    # Database schema
```

---

## 🔒 Beveiliging

### Magic Link beveiliging:
- ✅ Link verloopt na 15 minuten
- ✅ Link is eenmalig bruikbaar
- ✅ Sessie gebonden aan browser
- ✅ Sessie verloopt na 7 dagen inactiviteit

### Database beveiliging:
- ✅ Row Level Security (RLS) actief
- ✅ Gebruikers zien alleen eigen data
- ✅ Geen directe database toegang mogelijk

---

## 🎨 Aanpassingen

### Kleuren wijzigen
Bewerk `tailwind.config.ts`:
```ts
colors: {
  'ifr': {
    800: '#800000', // Verander dit
  }
}
```

### Logo/tekst wijzigen
Bewerk `app/login/page.tsx` en `components/DashboardHeader.tsx`

---

## ❓ Problemen?

### "Invalid login credentials"
- Check of je Supabase URL en key correct zijn in Vercel

### Magic link werkt niet
- Check of Redirect URL correct is ingesteld in Supabase
- Check je spam folder

### Geen data zichtbaar
- Check of database schema is uitgevoerd
- Check of RLS policies correct zijn aangemaakt

---

## 📧 Contact

Vragen? Mail naar [jouw email]
