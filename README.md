# Website Designer Studio App

A Next.js app for generating therapist websites. Therapists fill in an intake form and receive a first draft of their site.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Structure

```
src/
  app/               # Next.js App Router pages
  components/
    therapist-form/  # Multi-section intake form
    studio/          # Studio dashboard
    ui/              # Shared UI primitives (Button, Input, Textarea…)
  lib/               # Utilities (cn, etc.)
```

## Intake Form

The therapist intake form (`/`) has 8 sections:

| # | Section | Required fields |
|---|---------|-----------------|
| 1 | The basics | Name, title, accreditation, fees, work mode |
| 2 | Who you help | Client description, struggles, trigger moment |
| 3 | How you work | Approach, working style, first session |
| 4 | Your story | Why you do this, training, years practising |
| 5 | Issues you work with | Issues selected, top specialisms |
| 6 | Practical details | Headshot, domain, primary CTA |
| 7 | Common questions | Pre-seeded — always complete |
| 8 | Tone & voice | Tone selection |

Sidebar navigation tracks the active section via scroll-spy (section top crossing viewport midpoint). Completion is tracked per-section from required fields; the progress bar and sidebar indicators update in real time.
