# Quorumly

A when2meet alternative — create events, share a link, and let participants drag to select their available time slots. Find the best meeting time for everyone. Better UI, no ads, fully free and open source.

## Features

- **Create an event** — Set an event name, pick dates, choose a time range, and get a shareable link.
- **Availability grid** — Participants click and drag across a grid to mark their available slots. The grid shows who else is available at each time using GitHub-style heatmap colors (darker = more people).
- **Upsert responses** — Submitting with the same name updates your existing availability rather than creating a duplicate.
- **Hover to compare** — Hover any slot to highlight which people are available at that time.
- **Read-only browsing** — Before adding your own availability, the grid is read-only so you can browse others' schedules.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Neon |
| ORM | Drizzle |
| Forms | TanStack Form + Zod |
| UI | Tailwind CSS, shadcn/ui |
| Calendar | react-day-picker |

## How AI was used

- **UI design** — The UI was manually designed in Figma, then quickly integrated into code with the help of AI.
- **Availability grid** — The drag-to-select time slot grid on the `/m/[slug]` page was implemented primarily with AI assistance.
- **Enhancements & bug fixes** — AI (CodeRabbit suggestions and general prompting) was used for incremental improvements, edge case handling, and fixing issues found during development.

## Getting Started

**Prerequisites:** Node.js, pnpm, a Neon PostgreSQL database.

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your DATABASE_URL (Neon connection string)

# 3. Push the database schema
npx drizzle-kit push

# 4. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `npx drizzle-kit push` | Push schema to the database |
| `npx drizzle-kit generate` | Generate a new migration |

## Project Structure

```
src/
├── actions/          # Server actions (create meeting, save responses)
├── app/
│   ├── page.tsx      # Home page (create event form)
│   └── m/[slug]/     # Individual meeting page
├── components/
│   ├── home/         # Home page form components
│   ├── meeting/      # Meeting page components (grid, layout)
│   └── ui/           # Shared UI components (shadcn)
├── db/
│   ├── index.ts      # Database client
│   └── schema.ts     # Drizzle schema (meetings, meeting_dates, responses)
└── lib/
    ├── schemas/      # Zod validation schemas
    └── utils/        # Helpers (timezone, etc.)
```
