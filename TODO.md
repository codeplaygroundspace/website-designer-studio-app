# Click-First Website Design Studio TODO

## Feature Summary

Build a client-facing website design studio where users can create simple visual website mockups without editing code. Users manage pages, click curated image options to add sections to the active page, arrange those sections with simple controls, and export the active page as a PNG for review.

Core decisions:

- Use `shadcn/ui` for the app interface foundation.
- Make section adding click-first, not drag-first.
- Use a simple page list for add, rename, duplicate, and delete actions.
- Use local curated sample assets for v1.
- Export only the active page as a PNG.
- Autosave work locally in the browser.

## Setup And Dependencies

- [x] Install and configure `shadcn/ui`.
- [x] Add `lucide-react` for icons.
- [x] Add `html-to-image` for PNG export.
- [x] Update app metadata to `Website Design Studio`.
- [x] Replace the starter Next.js screen with the studio dashboard shell.

## Page Management

- [x] Create a default `Home` page on first load.
- [x] Add a page list in the sidebar.
- [x] Add an `Add Page` action that creates a blank page and makes it active.
- [x] Add page rename support.
- [x] Add page duplicate support, including duplicated sections.
- [x] Add page delete support.
- [x] Disable deleting the final remaining page.

## Section Library And Click-To-Add

- [x] Create local sample image assets under `public/studio-assets/`.
- [x] Define asset metadata in a TypeScript config.
- [x] Add section categories such as `Pages`, `Sections`, `Navigations`, `Media`, `Forms`, and `Utility`.
- [x] Add search for filtering available assets.
- [x] Show image thumbnails in the library panel.
- [x] Add a clicked thumbnail to the active page.
- [x] Show an empty state when no matching assets are found.

## Canvas Controls

- [x] Render the active page as a desktop website preview canvas.
- [x] Stack added section images vertically.
- [x] Add controls for each placed section: move up, move down, duplicate, and remove.
- [x] Disable move up on the first section.
- [x] Disable move down on the last section.
- [x] Show a clear empty canvas state when the active page has no sections.

## Autosave And Export

- [x] Autosave pages, active page, and selected sections to `localStorage`.
- [x] Restore saved work after a browser refresh.
- [x] Add a reset or clear-project action with confirmation.
- [x] Export only the active page canvas as a PNG.
- [x] Use `html-to-image` with `pixelRatio: 2`.
- [x] Show an inline error if export fails.

## Testing And Manual QA

- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [ ] Verify adding, renaming, duplicating, switching, and deleting pages.
- [ ] Verify the final page cannot be deleted.
- [ ] Verify clicking thumbnails adds sections to the active page.
- [ ] Verify moving, duplicating, and removing sections.
- [ ] Verify search and category filtering.
- [ ] Verify refresh restores saved work.
- [ ] Verify PNG export contains only the active page preview.
- [ ] Verify the dashboard remains usable on smaller screens without text overlap.

Note: terminal verification confirms the dev server responds with the new app on `http://localhost:3000`. Hands-on browser QA is still pending.
