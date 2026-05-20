# Intake Form Navigation & Progress Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up live sidebar navigation (scroll-spy + click-to-jump) and per-section completion tracking (required-field logic + progress bar) in the therapist intake form.

**Architecture:** All state lives in `TherapistFormPage`. A scroll listener updates the active section ID when a section's top edge crosses the viewport midpoint. Completion is computed from a `FormValues` map against a per-section required-field list. The sidebar re-renders reactively from these two state values.

**Tech Stack:** Next.js, React hooks (`useState`, `useEffect`, `useRef`), Tailwind CSS 4.

---

## File Map

| File | What changes |
|---|---|
| `src/components/therapist-form/therapist-form-page.tsx` | All changes — state, hooks, controlled fields, sidebar logic |

No new files needed. All components are local to this file.

---

### Task 1: Extend sections metadata with required field keys

**Files:**
- Modify: `src/components/therapist-form/therapist-form-page.tsx` (the `sections` array at the top)

Remove the static `state` property from the `sections` array and add a `requiredFields` string array to each entry. These keys will be used to look up values in `FormValues` to determine completion.

- [ ] **Step 1: Replace the `sections` array**

Replace the existing `sections` array (lines 9–18) with:

```ts
const sections = [
  {
    id: "s1",
    number: 1,
    label: "The basics",
    requiredFields: ["name", "title", "accreditation", "fees", "workMode"],
  },
  {
    id: "s2",
    number: 2,
    label: "Who you help",
    requiredFields: ["whoYouHelp", "struggle1", "struggle2", "struggle3", "triggerMoment"],
  },
  {
    id: "s3",
    number: 3,
    label: "How you work",
    requiredFields: ["approach", "workingStyle", "firstSession"],
  },
  {
    id: "s4",
    number: 4,
    label: "Your story",
    requiredFields: ["whyYouDoThis", "trainingBackground", "yearsPractising"],
  },
  {
    id: "s5",
    number: 5,
    label: "Issues you work with",
    requiredFields: ["issuesSelected", "topSpecialisms"],
  },
  {
    id: "s6",
    number: 6,
    label: "Practical details",
    requiredFields: ["hasHeadshot", "domain", "primaryCta"],
  },
  {
    id: "s7",
    number: 7,
    label: "Common questions",
    requiredFields: ["faqItems"],
  },
  {
    id: "s8",
    number: 8,
    label: "Tone & voice",
    requiredFields: ["toneSelection"],
  },
];
```

- [ ] **Step 2: Confirm the file still compiles**

```bash
cd /Users/rosie/Documents/GithubRo/website-designer-studio-app && npx tsc --noEmit
```

Expected: no errors (the `state` property was only used in the sidebar JSX, which we'll fix in Task 5).

- [ ] **Step 3: Commit**

```bash
git add src/components/therapist-form/therapist-form-page.tsx
git commit -m "refactor: replace static section state with requiredFields metadata"
```

---

### Task 2: Add FormValues type and completion logic to TherapistFormPage

**Files:**
- Modify: `src/components/therapist-form/therapist-form-page.tsx`

Add the `FormValues` interface, an initial state object, `useState`, and the `isSectionComplete` helper just above the `TherapistFormPage` function. No JSX changes yet.

- [ ] **Step 1: Add FormValues type and initial state above TherapistFormPage**

Insert this block immediately above the `export function TherapistFormPage()` declaration:

```ts
interface FormValues {
  name: string;
  title: string;
  accreditation: string;
  fees: string;
  workMode: string[];
  whoYouHelp: string;
  struggle1: string;
  struggle2: string;
  struggle3: string;
  triggerMoment: string;
  approach: string;
  workingStyle: string;
  firstSession: string;
  whyYouDoThis: string;
  trainingBackground: string;
  yearsPractising: string;
  issuesSelected: string[];
  topSpecialisms: string;
  hasHeadshot: boolean;
  domain: string;
  primaryCta: string;
  faqItems: number;
  toneSelection: string;
}

const initialFormValues: FormValues = {
  name: "",
  title: "",
  accreditation: "",
  fees: "",
  workMode: [],
  whoYouHelp: "",
  struggle1: "",
  struggle2: "",
  struggle3: "",
  triggerMoment: "",
  approach: "",
  workingStyle: "",
  firstSession: "",
  whyYouDoThis: "",
  trainingBackground: "",
  yearsPractising: "",
  issuesSelected: [],
  topSpecialisms: "",
  hasHeadshot: false,
  domain: "",
  primaryCta: "",
  faqItems: 2,
  toneSelection: "",
};

function isSectionComplete(
  sectionId: string,
  values: FormValues,
): boolean {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return false;
  return section.requiredFields.every((field) => {
    const v = values[field as keyof FormValues];
    if (typeof v === "boolean") return v;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "number") return v > 0;
    return typeof v === "string" && v.trim().length > 0;
  });
}
```

- [ ] **Step 2: Add useState inside TherapistFormPage**

Inside the `TherapistFormPage` function body, before the `return`, add:

```ts
const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
  setFormValues((prev) => ({ ...prev, [key]: value }));
}
```

Also add the React import for `useState` at the top of the file — update the existing import line:

```ts
import { useState, useEffect, useRef, type ReactNode } from "react";
```

- [ ] **Step 3: Confirm the file compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/therapist-form/therapist-form-page.tsx
git commit -m "feat: add FormValues state and isSectionComplete logic"
```

---

### Task 3: Make required fields controlled

**Files:**
- Modify: `src/components/therapist-form/therapist-form-page.tsx`

Wire `formValues` and `setField` into the required fields throughout the form JSX. Also update the `CheckItem`, `ToggleGroup`, and `RadioCard` sub-components to support controlled mode.

#### 3a: Update CheckItem to support controlled mode

- [ ] **Step 1: Replace the CheckItem component**

```tsx
function CheckItem({
  children,
  checked,
  onChange,
}: {
  children: ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2.5 rounded-[10px] border border-border bg-card px-3.5 py-[11px] text-[14.5px] transition-colors hover:border-muted-foreground">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center rounded border-[1.5px] border-muted-foreground transition-colors",
          checked && "border-primary bg-primary",
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="size-2.5 fill-none stroke-white stroke-2">
            <polyline points="1,4 4,7 9,1" />
          </svg>
        )}
      </span>
      <span>{children}</span>
    </label>
  );
}
```

#### 3b: Update ToggleGroup to support controlled mode

- [ ] **Step 2: Replace the ToggleGroup component**

```tsx
function ToggleGroup({
  options,
  value,
  onChange,
  defaultIndex = 1,
}: {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  defaultIndex?: number;
}) {
  const activeValue = value ?? options[defaultIndex];
  return (
    <div className="inline-flex rounded-lg border border-border bg-muted p-[3px]">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange?.(option)}
          className={cn(
            "rounded-md px-[18px] py-[7px] text-sm text-foreground/75 transition-colors",
            option === activeValue && "bg-card font-medium text-foreground shadow-sm",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
```

#### 3c: Update RadioCard to support controlled mode

- [ ] **Step 3: Replace the RadioCard component**

```tsx
function RadioCard({
  title,
  description,
  selected,
  onSelect,
}: {
  title: string;
  description: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <label
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer items-start gap-3.5 rounded-[10px] border bg-card p-4 transition-colors hover:border-muted-foreground",
        selected ? "border-primary" : "border-border",
      )}
    >
      <input type="radio" className="sr-only" readOnly checked={selected ?? false} />
      <span
        className={cn(
          "mt-[3px] size-4 shrink-0 rounded-full border-[1.5px] transition-colors",
          selected ? "border-primary bg-primary" : "border-muted-foreground",
        )}
      />
      <span>
        <span className="mb-0.5 block text-[15px] font-medium text-foreground">
          {title}
        </span>
        <span className="block text-[13.5px] leading-normal text-foreground/75">
          {description}
        </span>
      </span>
    </label>
  );
}
```

#### 3d: Wire controlled props into Section 1 fields

- [ ] **Step 4: Update Section 1 (The basics) required fields**

Find the Section s1 JSX and update the required fields. The optional fields (insurance checkboxes) stay uncontrolled. Replace:

```tsx
<Field label="Your name" help="How you'd like it to appear on the site.">
  <Input placeholder="e.g. Sarah Williams or Dr Sarah Williams" />
</Field>
<Field label="Your professional title" help="What you'd put on a business card.">
  <Input placeholder="e.g. CBT Therapist, Psychotherapist, Clinical Psychologist" />
</Field>
<Field label="Your accreditation or registration" help="List any professional bodies you're registered with.">
  <Input placeholder="e.g. BACP Accredited, BPS Registered, UKCP" />
</Field>
<Field label="Where do you work?">
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
    <CheckItem>In person</CheckItem>
    <CheckItem>Online</CheckItem>
  </div>
</Field>
<Field label="Your fees" help="Plain language is fine — you don't need to be clever about this.">
  <Input placeholder="e.g. £90 per 50-minute session, sliding scale available" />
</Field>
```

With:

```tsx
<Field label="Your name" help="How you'd like it to appear on the site.">
  <Input
    placeholder="e.g. Sarah Williams or Dr Sarah Williams"
    value={formValues.name}
    onChange={(e) => setField("name", e.target.value)}
  />
</Field>
<Field label="Your professional title" help="What you'd put on a business card.">
  <Input
    placeholder="e.g. CBT Therapist, Psychotherapist, Clinical Psychologist"
    value={formValues.title}
    onChange={(e) => setField("title", e.target.value)}
  />
</Field>
<Field label="Your accreditation or registration" help="List any professional bodies you're registered with.">
  <Input
    placeholder="e.g. BACP Accredited, BPS Registered, UKCP"
    value={formValues.accreditation}
    onChange={(e) => setField("accreditation", e.target.value)}
  />
</Field>
<Field label="Where do you work?">
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
    {["In person", "Online"].map((mode) => (
      <CheckItem
        key={mode}
        checked={formValues.workMode.includes(mode)}
        onChange={(checked) =>
          setField(
            "workMode",
            checked
              ? [...formValues.workMode, mode]
              : formValues.workMode.filter((m) => m !== mode),
          )
        }
      >
        {mode}
      </CheckItem>
    ))}
  </div>
</Field>
<Field label="Your fees" help="Plain language is fine — you don't need to be clever about this.">
  <Input
    placeholder="e.g. £90 per 50-minute session, sliding scale available"
    value={formValues.fees}
    onChange={(e) => setField("fees", e.target.value)}
  />
</Field>
```

#### 3e: Wire Section 2 required fields

- [ ] **Step 5: Update Section 2 (Who you help)**

Replace the required Input/Textarea fields in Section 2:

```tsx
<Field label="In one sentence, who do you help?" help="Think of one ideal client...">
  <ExamplesToggle />
  <Input
    placeholder="In about 10–20 words"
    value={formValues.whoYouHelp}
    onChange={(e) => setField("whoYouHelp", e.target.value)}
  />
</Field>
<Field label="What are three things your clients are most often struggling with...">
  <ExamplesToggle />
  <div className="grid gap-2">
    <Input
      placeholder="First struggle"
      value={formValues.struggle1}
      onChange={(e) => setField("struggle1", e.target.value)}
    />
    <Input
      placeholder="Second struggle"
      value={formValues.struggle2}
      onChange={(e) => setField("struggle2", e.target.value)}
    />
    <Input
      placeholder="Third struggle"
      value={formValues.struggle3}
      onChange={(e) => setField("struggle3", e.target.value)}
    />
  </div>
</Field>
<Field label="What's the moment in life that often brings someone to you?" help="...">
  <ExamplesToggle />
  <Textarea
    placeholder="Two or three sentences"
    rows={4}
    value={formValues.triggerMoment}
    onChange={(e) => setField("triggerMoment", e.target.value)}
  />
</Field>
```

Leave the optional "Anyone you don't work with?" field uncontrolled.

#### 3f: Wire Section 3 required fields

- [ ] **Step 6: Update Section 3 (How you work)**

```tsx
<Field label="What therapeutic approach do you use?" help="...">
  <Input
    placeholder="e.g. CBT, Integrative, Psychodynamic with trauma-focused training"
    value={formValues.approach}
    onChange={(e) => setField("approach", e.target.value)}
  />
</Field>
<Field label="What's it actually like to work with you?" help="...">
  <ExamplesToggle />
  <Textarea
    placeholder="Two or three sentences"
    rows={4}
    value={formValues.workingStyle}
    onChange={(e) => setField("workingStyle", e.target.value)}
  />
</Field>
<Field label="What's a first session like?" help="...">
  <Textarea
    placeholder="Anxious clients want to know what they're walking into"
    rows={4}
    value={formValues.firstSession}
    onChange={(e) => setField("firstSession", e.target.value)}
  />
</Field>
```

Leave the ToggleGroup for "free initial consultation" uncontrolled (always has a default selection).

#### 3g: Wire Section 4 required fields

- [ ] **Step 7: Update Section 4 (Your story)**

```tsx
<Field label="Why do you do this work?" help="...">
  <ExamplesToggle />
  <Textarea
    placeholder="Three to five sentences"
    rows={5}
    value={formValues.whyYouDoThis}
    onChange={(e) => setField("whyYouDoThis", e.target.value)}
  />
</Field>
```

Leave the optional "What do clients tell you..." field uncontrolled.

```tsx
<Field label="Your training background" help="...">
  <Textarea
    placeholder="e.g. MSc in Counselling Psychology..."
    rows={4}
    value={formValues.trainingBackground}
    onChange={(e) => setField("trainingBackground", e.target.value)}
  />
</Field>
<Field label="How long have you been practising?">
  <Input
    placeholder="e.g. Over 10 years, or Since 2015"
    value={formValues.yearsPractising}
    onChange={(e) => setField("yearsPractising", e.target.value)}
  />
</Field>
```

#### 3h: Wire Section 5 required fields

- [ ] **Step 8: Update Section 5 (Issues you work with)**

The tag-pill buttons need to toggle `issuesSelected`. Replace the issues tag group:

```tsx
<div className="mb-3.5 flex flex-wrap gap-2">
  {issues.map((issue) => (
    <button
      key={issue}
      type="button"
      onClick={() =>
        setField(
          "issuesSelected",
          formValues.issuesSelected.includes(issue)
            ? formValues.issuesSelected.filter((i) => i !== issue)
            : [...formValues.issuesSelected, issue],
        )
      }
      className={cn(
        "select-none rounded-full border px-3.5 py-2 text-[13.5px] transition-colors",
        formValues.issuesSelected.includes(issue)
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card text-foreground/75 hover:border-muted-foreground hover:text-foreground",
      )}
    >
      {issue}
    </button>
  ))}
</div>
```

And the top specialisms textarea:

```tsx
<Textarea
  placeholder="e.g. Anxiety and burnout in high-pressure careers, perinatal mental health"
  rows={2}
  value={formValues.topSpecialisms}
  onChange={(e) => setField("topSpecialisms", e.target.value)}
/>
```

#### 3i: Wire Section 6 required fields

- [ ] **Step 9: Update Section 6 (Practical details)**

Update `FileDrop` to support an `onChange` callback for the headshot:

```tsx
function FileDrop({
  title,
  help,
  onChange,
}: {
  title: string;
  help: string;
  onChange?: (hasFile: boolean) => void;
}) {
  return (
    <label className="block cursor-pointer rounded-[10px] border border-dashed border-border bg-card px-5 py-7 text-center transition-colors hover:border-primary hover:bg-accent">
      <input
        type="file"
        className="sr-only"
        onChange={(e) => onChange?.(e.target.files != null && e.target.files.length > 0)}
      />
      <div className="mb-1 text-[14.5px] font-medium text-foreground">{title}</div>
      <div className="text-[13px] text-muted-foreground">{help}</div>
    </label>
  );
}
```

Then in Section 6, wire the headshot FileDrop, domain Input, and the CTA RadioCard group:

```tsx
<Field label="Your photo" help="...">
  <FileDrop
    title="Click to upload your headshot"
    help="JPG or PNG, ideally 1500px or larger"
    onChange={(hasFile) => setField("hasHeadshot", hasFile)}
  />
</Field>
```

```tsx
<Field label="Your domain name" help="...">
  <Input
    placeholder="e.g. sarahtherapy.co.uk"
    value={formValues.domain}
    onChange={(e) => setField("domain", e.target.value)}
  />
</Field>
<Field label="What's the main thing you want visitors to do?" help="...">
  <div className="flex flex-col gap-2">
    {[
      { title: "Book a free consultation", description: "Best if you offer a short intro call and want to remove friction." },
      { title: "Send an enquiry through a contact form", description: "Best if you'd rather read about someone before speaking." },
      { title: "Read about my approach first", description: "Best for niche practitioners whose approach is the differentiator." },
    ].map((opt) => (
      <RadioCard
        key={opt.title}
        title={opt.title}
        description={opt.description}
        selected={formValues.primaryCta === opt.title}
        onSelect={() => setField("primaryCta", opt.title)}
      />
    ))}
  </div>
</Field>
```

#### 3j: Wire Section 8 tone selection

- [ ] **Step 10: Update Section 8 (Tone & voice)**

```tsx
{[
  { title: "Warm and reassuring", description: "Gentle, soft, calming. Good for clients carrying a lot of pain or anxiety." },
  { title: "Grounded and practical", description: "Clear, professional, calm. Good for clients who want results without fuss." },
  { title: "Direct and confident", description: "Warm but no-nonsense. Good for clients who want clarity, not hand-holding." },
  { title: "Thoughtful and reflective", description: "Literary, considered. Good for clients drawn to depth and meaning." },
].map((opt) => (
  <RadioCard
    key={opt.title}
    title={opt.title}
    description={opt.description}
    selected={formValues.toneSelection === opt.title}
    onSelect={() => setField("toneSelection", opt.title)}
  />
))}
```

- [ ] **Step 11: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 12: Commit**

```bash
git add src/components/therapist-form/therapist-form-page.tsx
git commit -m "feat: make required fields controlled for completion tracking"
```

---

### Task 4: Scroll-spy for active section

**Files:**
- Modify: `src/components/therapist-form/therapist-form-page.tsx`

Add a `useEffect` with a scroll listener. Populate `sectionRefs` after mount by finding each section element by its ID. On every scroll, find the last section whose top edge is at or above the viewport midpoint — that becomes the active section.

- [ ] **Step 1: Add activeSection state and section refs inside TherapistFormPage**

Add these two lines alongside the existing `formValues` state declaration:

```ts
const [activeSection, setActiveSection] = useState<string>(sections[0].id);
const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
```

- [ ] **Step 2: Add scroll-spy useEffect inside TherapistFormPage**

Add this after the state declarations, before the `return`:

```ts
useEffect(() => {
  sections.forEach((s) => {
    sectionRefs.current[s.id] = document.getElementById(s.id);
  });

  const handleScroll = () => {
    const midY = window.innerHeight / 2;
    let current = sections[0].id;
    for (const section of sections) {
      const el = sectionRefs.current[section.id];
      if (el && el.getBoundingClientRect().top <= midY) {
        current = section.id;
      }
    }
    setActiveSection(current);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

- [ ] **Step 3: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/therapist-form/therapist-form-page.tsx
git commit -m "feat: add scroll-spy to track active section"
```

---

### Task 5: Dynamic sidebar — active state, completion state, progress bar

**Files:**
- Modify: `src/components/therapist-form/therapist-form-page.tsx` (sidebar JSX in the `aside`)

Replace static `section.state` references with dynamic computed values from `activeSection` and `isSectionComplete`.

- [ ] **Step 1: Replace the sidebar nav JSX**

Find the `<nav aria-label="Form sections">` block and replace it entirely with:

```tsx
<nav aria-label="Form sections" className="hidden lg:block">
  <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
    {sections.map((section) => {
      const isActive = activeSection === section.id;
      const isComplete = isSectionComplete(section.id, formValues);
      return (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14.5px] text-foreground/75 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-blue-600",
              isActive && "bg-accent font-medium text-foreground",
            )}
          >
            <span
              className={cn(
                "flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-border text-[11px] font-medium text-muted-foreground transition-colors",
                (isActive || isComplete) &&
                  "border-primary bg-primary text-primary-foreground",
              )}
            >
              {isComplete ? "✓" : section.number}
            </span>
            <span>{section.label}</span>
          </a>
        </li>
      );
    })}
  </ul>
</nav>
```

- [ ] **Step 2: Replace the progress bar JSX**

Find the progress card `<div className="mb-6 rounded-[10px]...">` and replace its contents with dynamic values:

```tsx
<div className="mb-6 rounded-[10px] border border-border bg-card px-4 py-3.5">
  <div className="mb-2 text-xs uppercase tracking-[0.04em] text-muted-foreground">
    Progress
  </div>
  <div className="h-1 overflow-hidden rounded-full bg-muted">
    <div
      className="h-full bg-primary transition-all duration-500"
      style={{
        width: `${(sections.filter((s) => isSectionComplete(s.id, formValues)).length / sections.length) * 100}%`,
      }}
    />
  </div>
  <div className="mt-2 text-[13px] text-foreground/75">
    {sections.filter((s) => isSectionComplete(s.id, formValues)).length} of{" "}
    {sections.length} sections
  </div>
</div>
```

- [ ] **Step 3: Compile check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Start dev server and verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000` (or wherever the intake form is routed). Verify:
- Sidebar item highlights as you scroll through sections
- Clicking a sidebar item smooth-scrolls to that section
- Filling in all required fields in section 1 causes the section indicator to show ✓
- Progress bar advances and count updates
- Completing section 1 changes the indicator to primary-filled circle with ✓

- [ ] **Step 5: Commit**

```bash
git add src/components/therapist-form/therapist-form-page.tsx
git commit -m "feat: wire dynamic sidebar active state, completion indicators, and progress bar"
```

---

## Done Checklist

- [ ] Clicking a sidebar section jumps to the right place
- [ ] Active state follows the current section accurately as user scrolls
- [ ] Completing all required fields in a section shows ✓ on that section's indicator
- [ ] Progress bar and "N of 8 sections" count update as sections are completed
- [ ] Visual result matches the prototype's active and complete states
- [ ] No TypeScript errors (`npx tsc --noEmit` clean)
