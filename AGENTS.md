# Instructions

Ask the user questions during a task when you need clarification, want to validate assumptions, or need the user's input on a decision.

- Presents 1-4 questions with predefined options (2-4 choices each)
- Allow user to provide "Other" option
- Supports single or multi questions
- Goal is to help gather preferences, clarify ambiguous instructions, or get decisions on implementation choices
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Example usage:
If the user asked to "add authentication to the app", you might use it like this:

Question: "Which authentication method should we use?"
Options:
a. JWT tokens - Stateless, good for APIs
b. Session cookies - Traditional, server-side sessions
c. OAuth/SSO - Third-party provider integration

User would then pick an option (or provide a custom answer), and you'd proceed with that approach.

Use it when:

- Multiple valid approaches exist and user preference matters
- Requirements are unclear or ambiguous
- Implementation choices have trade-offs usser should decide on
- You need specific information only the user can provide (e.g., API keys location, preferred libraries)

It's a way to check in with the user rather than making assumptions that might lead to rework.

## Project

Next.js 16.2.6
Tailwind CSS 4.3.0

## App structure

- `/` — Therapist intake form (`src/components/therapist-form/therapist-form-page.tsx`)
- Studio dashboard at `src/components/studio/studio-dashboard.tsx`
- Shared UI primitives in `src/components/ui/`

## Intake form notes

- All 8 sections live in one file: `therapist-form-page.tsx`
- Section completion is tracked via `FormValues` state and `isSectionComplete()` — required fields are defined in the `sections` array's `requiredFields` property
- Sidebar scroll-spy uses a scroll listener + `getBoundingClientRect` (not IntersectionObserver)
- Section 7 (FAQ) has no required fields and is always considered complete (pre-seeded content)