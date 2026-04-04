# Pinstripe Lab Dashboard 🏟️

A public Yankees pitching analytics dashboard powered by AI-generated insights.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PINSTRIPE LAB                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │ Raspberry   │     │  Supabase   │     │   Vercel    │       │
│  │    Pi 5     │────▶│   Cloud     │◀────│  Frontend   │       │
│  │             │     │             │     │             │       │
│  │ • MLB API   │     │ • Postgres  │     │ • Next.js   │       │
│  │ • Detection │     │ • Storage   │     │ • React     │       │
│  │ • AI Gen    │     │ • Auth      │     │ • Tailwind  │       │
│  │ • Graphics  │     │             │     │             │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

- **Raspberry Pi 5**: Live ingestion engine that detects pitcher exits, generates AI summaries, renders graphics, and syncs to cloud
- **Supabase**: Cloud database (Postgres) and storage for graphics
- **Vercel**: Hosts the Next.js dashboard frontend

---

## Quick Start

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration files in order:
   ```
   supabase/migrations/001_create_tables.sql
   supabase/migrations/002_seed_data.sql  (optional, for demo data)
   ```
3. Go to **Storage** → **New Bucket**:
   - Name: `outing-graphics`
   - Public: **Yes** (for MVP)
4. Copy your project credentials from **Settings** → **API**:
   - Project URL
   - `anon` public key (for frontend)
   - `service_role` key (for Pi backend)

### 2. Pi Setup

Add these environment variables to your Pi's `.env` file:

```env
# Supabase Cloud Sync
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=outing-graphics
```

The sync is already integrated into the pipeline. When a pitcher exit is detected:
1. Graphic is uploaded to Supabase Storage
2. Outing record is upserted to the `outings` table
3. Local SQLite still prevents duplicates

**Test the sync manually:**
```bash
cd ~/yankees_ai_graphics
source venv/bin/activate
python -m app.supabase_sync
```

### 3. Dashboard Local Development

```bash
cd dashboard
npm install
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Run locally:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

1. Push the `dashboard/` folder to a GitHub repo
2. Import to [vercel.com](https://vercel.com)
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

---

## Environment Variables Summary

### Raspberry Pi (`.env`)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (has write access) |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name (default: `outing-graphics`) |

### Vercel / Next.js (`.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key (read-only access) |

---

## Project Structure

```
dashboard/
├── app/
│   ├── globals.css        # Tailwind + custom styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── Header.tsx         # Site header
│   ├── LatestOutingCard.tsx  # Hero card for latest outing
│   ├── QuickStats.tsx     # Stats strip
│   ├── TrendChart.tsx     # Recharts line chart
│   ├── OutingsTable.tsx   # Recent outings table
│   └── FilterTabs.tsx     # Role filter (all/starters/bullpen)
├── lib/
│   ├── supabase.ts        # Supabase client
│   └── queries.ts         # Data access layer
├── types/
│   └── index.ts           # TypeScript types
├── supabase/
│   └── migrations/        # SQL migration files
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## Features

### Dashboard Homepage
- **Latest Outing Hero**: Pitcher name, stats, AI headline/takeaway
- **Quick Stats Strip**: Recent averages for K, ER, IP
- **Trend Chart**: Rolling performance visualization
- **Outings Table**: Sortable list of recent outings
- **Role Filter**: Filter by starters or bullpen

### Design
- Yankees navy background (#0C2340)
- Gold accent highlights (#C4A747)
- Pinstripe pattern on cards
- Mobile-first responsive layout

---

## Data Flow

1. **Pi detects pitcher exit** → generates AI summary + graphic
2. **Pi syncs to Supabase** → uploads graphic, upserts outing record
3. **Dashboard fetches from Supabase** → displays latest data
4. **Auto-revalidation** → page refreshes every 60 seconds

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Supabase not configured" on Pi | Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env` |
| Dashboard shows mock data | Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Graphics not loading | Ensure storage bucket is public and named `outing-graphics` |
| RLS errors on insert | Use service role key on Pi (not anon key) |

---

## Development

### Adding new features

1. Update Supabase schema if needed (add migration file)
2. Update `types/index.ts` with new types
3. Update `lib/queries.ts` with new data fetching
4. Build components in `components/`
5. Update `app/page.tsx` to use new components

### Testing sync without live game

```python
# On Pi, run a manual test
python -c "
from datetime import datetime
from app.models import PitcherOuting, AISummary
from app.supabase_sync import sync_outing_to_cloud

outing = PitcherOuting(
    game_id='TEST001', pitcher_id=543037, pitcher_name='Gerrit Cole',
    pitcher_hand='R', jersey_number='45', innings_pitched=7.0,
    hits=4, earned_runs=1, runs=1, walks=1, strikeouts=10,
    pitch_count=98, strikes_thrown=68, home_runs=0, hit_by_pitch=0,
    opponent_team='Test Team', game_date='$(date +%Y-%m-%d)',
    inning_exited=8, exit_timestamp=datetime.now()
)

summary = AISummary(
    headline='Test Headline',
    takeaway='Test takeaway text.',
    strength='Test strength.',
    concern='Test concern.',
    full_caption='Test caption',
    model_used='test'
)

sync_outing_to_cloud(outing, summary, None)
"
```

---

## License

MIT
