"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

const insurers = ["Bupa", "AXA Health", "Aviva", "Vitality", "WPA", "Cigna"];

const issues = [
  "Anxiety",
  "Burnout",
  "Depression",
  "Work-related stress",
  "Trauma / PTSD",
  "Relationship issues",
  "Self-esteem & confidence",
  "Life transitions",
  "Bereavement & loss",
  "Perinatal mental health",
  "Identity (LGBTQ+, cultural)",
  "Health anxiety",
  "OCD",
  "Panic attacks",
  "Sleep problems",
];

function Field({
  label,
  help,
  optional,
  children,
}: {
  label: string;
  help?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mb-7">
      <label className="mb-1.5 block text-[15px] font-medium tracking-[-0.005em] text-foreground">
        {label}
        {optional ? (
          <span className="ml-1.5 text-[13px] font-normal text-muted-foreground">
            optional
          </span>
        ) : null}
      </label>
      {help ? (
        <p className="mb-3 text-[13.5px] leading-normal text-foreground/75">
          {help}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function Section({
  id,
  number,
  title,
  description,
  children,
}: {
  id: string;
  number: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="mb-16 scroll-mt-8 border-b border-border pb-16 last:border-b-0"
    >
      <header className="mb-9">
        <div className="mb-2 font-display text-[13px] tracking-[0.04em] text-muted-foreground">
          Section {number}
        </div>
        <h2 className="mb-2.5 font-display text-[30px] font-medium leading-[1.15] tracking-[-0.015em] text-foreground">
          {title}
        </h2>
        <p className="max-w-xl text-[15.5px] leading-normal text-foreground/75">
          {description}
        </p>
      </header>
      {children}
    </section>
  );
}

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

function ExamplesToggle() {
  return (
    <button
      type="button"
      className="mb-3 inline-flex items-center gap-1.5 text-[13.5px] text-primary transition-opacity hover:opacity-70"
    >
      <span>+</span>
      Show me examples
    </button>
  );
}

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
        onChange={(e) =>
          onChange?.(e.target.files != null && e.target.files.length > 0)
        }
      />
      <div className="mb-1 text-[14.5px] font-medium text-foreground">{title}</div>
      <div className="text-[13px] text-muted-foreground">{help}</div>
    </label>
  );
}

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

function FaqItem({
  number,
  question,
  answer,
}: {
  number: string;
  question: string;
  answer: string;
}) {
  return (
    <div className="relative mb-3 rounded-[10px] border border-border bg-card p-[18px]">
      <div className="mb-2.5 font-display text-xs tracking-[0.04em] text-muted-foreground">
        Question {number}
      </div>
      <button
        type="button"
        className="absolute right-3.5 top-3.5 rounded px-2 py-1 text-lg leading-none text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
      >
        ×
      </button>
      <Input
        className="mb-2.5"
        defaultValue={question}
        placeholder="The question, in your client's words"
      />
      <Textarea
        defaultValue={answer}
        placeholder="The key facts you want included in the answer — bullets are fine"
        rows={3}
      />
    </div>
  );
}

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

export function TherapistFormPage() {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto grid min-h-dvh max-w-[1400px] grid-cols-1 lg:grid-cols-[300px_1fr]">
        <aside className="flex border-b border-border bg-background px-6 py-6 lg:sticky lg:top-0 lg:h-dvh lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-7 lg:pb-6 lg:pt-9">
          <div className="w-full">
            <div className="mb-8 flex items-center gap-2.5 font-display text-lg font-medium tracking-[-0.01em]">
              <span className="size-2.5 rounded-full bg-primary" />
              <span>Your site</span>
            </div>

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
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14.5px] text-foreground/75 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-blue-600",
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
          </div>

          <div className="mt-auto hidden items-center gap-2 pt-5 text-[12.5px] text-muted-foreground lg:flex">
            <span className="size-1.5 shrink-0 rounded-full bg-primary" />
            <span>Saved automatically</span>
          </div>
        </aside>

        <div className="px-6 py-8 sm:px-10 lg:px-16 lg:py-14">
          <form className="max-w-[720px]">
            <div className="mb-14">
              <div className="mb-3.5 text-xs font-medium uppercase tracking-[0.12em] text-primary">
                Step one of three
              </div>
              <h1 className="mb-[18px] font-display text-[44px] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
                Let&apos;s get to know you.
              </h1>
              <p className="max-w-[580px] text-[17px] leading-[1.55] text-foreground/75">
                We&apos;ll use what you share here to write the first draft of
                your website. Most therapists take about 30 minutes. Your
                answers save as you go — close the tab whenever, come back when
                you&apos;re ready.
              </p>
            </div>

            <Section
              id="s1"
              number={1}
              title="The basics"
              description="Quick facts about you. Nothing to overthink."
            >
              <Field
                label="Your name"
                help="How you'd like it to appear on the site."
              >
                <Input placeholder="e.g. Sarah Williams or Dr Sarah Williams" value={formValues.name} onChange={(e) => setField("name", e.target.value)} />
              </Field>
              <Field
                label="Your professional title"
                help="What you'd put on a business card."
              >
                <Input placeholder="e.g. CBT Therapist, Psychotherapist, Clinical Psychologist" value={formValues.title} onChange={(e) => setField("title", e.target.value)} />
              </Field>
              <Field
                label="Your accreditation or registration"
                help="List any professional bodies you're registered with."
              >
                <Input placeholder="e.g. BACP Accredited, BPS Registered, UKCP" value={formValues.accreditation} onChange={(e) => setField("accreditation", e.target.value)} />
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
              <Field
                label="Your fees"
                help="Plain language is fine — you don't need to be clever about this."
              >
                <Input placeholder="e.g. £90 per 50-minute session, sliding scale available" value={formValues.fees} onChange={(e) => setField("fees", e.target.value)} />
              </Field>
              <Field
                label="Show your email on the site?"
                help="We always need this to contact you — the toggle only controls whether visitors see it."
              >
                <ToggleGroup options={["Yes", "Just for us"]} />
              </Field>
              <Field label="Show a phone number on the site?">
                <ToggleGroup options={["Yes", "No"]} />
              </Field>
              <Field label="Show an address on the site?">
                <ToggleGroup options={["Yes", "No"]} />
              </Field>
              <Field
                label="Insurance providers you accept"
                help="Tick any you work with. We'll display the logos on your site."
                optional
              >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {insurers.map((insurer) => (
                    <CheckItem key={insurer}>{insurer}</CheckItem>
                  ))}
                </div>
              </Field>
            </Section>

            <Section
              id="s2"
              number={2}
              title="Who you help"
              description="The hardest part of writing about yourself is being specific. We'll guide you."
            >
              <Field
                label="In one sentence, who do you help?"
                help="Think of one ideal client. Not everyone — the person you're best placed to support."
              >
                <ExamplesToggle />
                <Input placeholder="In about 10–20 words" value={formValues.whoYouHelp} onChange={(e) => setField("whoYouHelp", e.target.value)} />
              </Field>
              <Field
                label="What are three things your clients are most often struggling with when they first contact you?"
                help="In their words — what they'd type into Google — not clinical terms."
              >
                <ExamplesToggle />
                <div className="grid gap-2">
                  <Input placeholder="First struggle" value={formValues.struggle1} onChange={(e) => setField("struggle1", e.target.value)} />
                  <Input placeholder="Second struggle" value={formValues.struggle2} onChange={(e) => setField("struggle2", e.target.value)} />
                  <Input placeholder="Third struggle" value={formValues.struggle3} onChange={(e) => setField("struggle3", e.target.value)} />
                </div>
              </Field>
              <Field
                label="What's the moment in life that often brings someone to you?"
                help={
                  'The trigger point. The "I can\'t keep doing this" moment.'
                }
              >
                <ExamplesToggle />
                <Textarea placeholder="Two or three sentences" rows={4} value={formValues.triggerMoment} onChange={(e) => setField("triggerMoment", e.target.value)} />
              </Field>
              <Field
                label="Anyone you don't work with?"
                help="It's okay — and helpful — to be clear. It helps the wrong clients self-select out."
                optional
              >
                <Input placeholder="e.g. I don't currently work with addictions or eating disorders" />
              </Field>
            </Section>

            <Section
              id="s3"
              number={3}
              title="How you work"
              description="Your approach, in language a client would understand."
            >
              <Field
                label="What therapeutic approach do you use?"
                help="If you use more than one, name your main one first."
              >
                <Input placeholder="e.g. CBT, Integrative, Psychodynamic with trauma-focused training" value={formValues.approach} onChange={(e) => setField("approach", e.target.value)} />
              </Field>
              <Field
                label="What's it actually like to work with you?"
                help="Try to avoid technical terms. Think about how a friend would describe your style."
              >
                <ExamplesToggle />
                <Textarea placeholder="Two or three sentences" rows={4} value={formValues.workingStyle} onChange={(e) => setField("workingStyle", e.target.value)} />
              </Field>
              <Field
                label="What's a first session like?"
                help="Practical — what happens, how long, how they pay, what they should expect to feel."
              >
                <Textarea
                  placeholder="Anxious clients want to know what they're walking into"
                  rows={4}
                  value={formValues.firstSession}
                  onChange={(e) => setField("firstSession", e.target.value)}
                />
              </Field>
              <Field label="Do you offer a free initial consultation?">
                <ToggleGroup options={["Yes", "No"]} />
              </Field>
            </Section>

            <Section
              id="s4"
              number={4}
              title="Your story"
              description="For your About page. This is the part that adds warmth."
            >
              <Field
                label="Why do you do this work?"
                help="Two ways to answer: a personal spark, or a client experience that confirmed this was the right work for you. You don't need to share trauma — just what makes this work meaningful to you."
              >
                <ExamplesToggle />
                <Textarea placeholder="Three to five sentences" rows={5} value={formValues.whyYouDoThis} onChange={(e) => setField("whyYouDoThis", e.target.value)} />
              </Field>
              <Field
                label="What do clients tell you they appreciated about working with you?"
                help="If you've had feedback, real quotes are gold. If not, your best guess is fine."
                optional
              >
                <Textarea
                  placeholder="e.g. They often say I'm easy to talk to and that I don't shy away from difficult things"
                  rows={3}
                />
              </Field>
              <Field
                label="Your training background"
                help="Where you trained, qualifications you hold, key additional training. Don't list everything — pick what a client would care about."
              >
                <Textarea
                  placeholder="e.g. MSc in Counselling Psychology from University of East London (2014). Additional training in trauma-focused CBT and EMDR. Ongoing CPD in perinatal mental health."
                  rows={4}
                  value={formValues.trainingBackground}
                  onChange={(e) => setField("trainingBackground", e.target.value)}
                />
              </Field>
              <Field label="How long have you been practising?">
                <Input placeholder="e.g. Over 10 years, or Since 2015" value={formValues.yearsPractising} onChange={(e) => setField("yearsPractising", e.target.value)} />
              </Field>
            </Section>

            <Section
              id="s5"
              number={5}
              title="Issues you work with"
              description="Tick the ones you'd want a client to come to you for. Don't tick everything — be honest about your specialism."
            >
              <Field label="Areas you work with">
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
                <div className="mt-2 flex gap-2">
                  <Input placeholder="Add your own — e.g. ADHD, neurodivergence" />
                  <button
                    type="button"
                    className="rounded-[10px] bg-foreground px-4 py-[9px] text-[13.5px] text-background transition-opacity hover:opacity-85"
                  >
                    Add
                  </button>
                </div>
              </Field>
              <Field
                label="Of these, what are your top two or three specialisms?"
                help="The things you most want to be known for. These will appear most prominently on your site."
              >
                <Textarea
                  placeholder="e.g. Anxiety and burnout in high-pressure careers, perinatal mental health"
                  rows={2}
                  value={formValues.topSpecialisms}
                  onChange={(e) => setField("topSpecialisms", e.target.value)}
                />
              </Field>
            </Section>

            <Section
              id="s6"
              number={6}
              title="Practical details"
              description="Photos, logos, your web address."
            >
              <Field
                label="Your photo"
                help="A professional headshot if you have one. Looking at the camera, warm expression, good lighting. We'll need at least one."
              >
                <FileDrop
                  title="Click to upload your headshot"
                  help="JPG or PNG, ideally 1500px or larger"
                  onChange={(hasFile) => setField("hasHeadshot", hasFile)}
                />
              </Field>
              <Field
                label="A second, more relaxed photo"
                help="A second image — perhaps you in your therapy room, or a wider shot — adds warmth."
                optional
              >
                <FileDrop title="Click to upload" help="JPG or PNG" />
              </Field>
              <Field
                label="Membership or accreditation logos"
                help="BACP, BPS, UKCP, etc. We'll display these in your footer."
                optional
              >
                <FileDrop
                  title="Click to upload logos"
                  help="PNG or SVG with transparent background, multiple files allowed"
                />
              </Field>
              <Field
                label="Your domain name"
                help="The web address for your site. If you don't have one yet, leave blank and we'll help."
              >
                <Input placeholder="e.g. sarahtherapy.co.uk" value={formValues.domain} onChange={(e) => setField("domain", e.target.value)} />
              </Field>
              <Field
                label="What's the main thing you want visitors to do?"
                help="This becomes the main call-to-action across your site."
              >
                <div className="flex flex-col gap-2">
                  {[
                    {
                      title: "Book a free consultation",
                      description: "Best if you offer a short intro call and want to remove friction.",
                    },
                    {
                      title: "Send an enquiry through a contact form",
                      description: "Best if you'd rather read about someone before speaking.",
                    },
                    {
                      title: "Read about my approach first",
                      description: "Best for niche practitioners whose approach is the differentiator.",
                    },
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
            </Section>

            <Section
              id="s7"
              number={7}
              title="Common questions clients ask"
              description="For your FAQ page. We'll write the answers — just give us the topics you want covered. Add as many as you like."
            >
              <FaqItem
                number="01"
                question="How long is a session and how often will we meet?"
                answer="50 minutes, weekly to start, can review after 6 sessions"
              />
              <FaqItem
                number="02"
                question="What's your cancellation policy?"
                answer="24 hours notice required, full fee charged for missed sessions"
              />
              <button
                type="button"
                className="mt-1 w-full rounded-[10px] border border-dashed border-border bg-transparent p-3.5 text-sm text-foreground/75 transition-colors hover:border-primary hover:bg-card hover:text-primary"
              >
                + Add another question
              </button>
            </Section>

            <Section
              id="s8"
              number={8}
              title="Tone & voice"
              description="How you'd like your site to sound. This guides how we write everything."
            >
              <Field label="Which best describes how you'd like to come across?">
                <div className="flex flex-col gap-2">
                  {[
                    {
                      title: "Warm and reassuring",
                      description: "Gentle, soft, calming. Good for clients carrying a lot of pain or anxiety.",
                    },
                    {
                      title: "Grounded and practical",
                      description: "Clear, professional, calm. Good for clients who want results without fuss.",
                    },
                    {
                      title: "Direct and confident",
                      description: "Warm but no-nonsense. Good for clients who want clarity, not hand-holding.",
                    },
                    {
                      title: "Thoughtful and reflective",
                      description: "Literary, considered. Good for clients drawn to depth and meaning.",
                    },
                  ].map((opt) => (
                    <RadioCard
                      key={opt.title}
                      title={opt.title}
                      description={opt.description}
                      selected={formValues.toneSelection === opt.title}
                      onSelect={() => setField("toneSelection", opt.title)}
                    />
                  ))}
                </div>
              </Field>
              <Field
                label="Anything we should avoid?"
                help="Words you hate, phrases that feel salesy, things other therapists say that make you wince."
                optional
              >
                <Textarea
                  placeholder="e.g. Please don't use the word 'passionate.' Avoid clinical jargon. I don't want to sound like a coach."
                  rows={3}
                />
              </Field>
            </Section>

            <div className="mt-14 rounded-2xl bg-foreground p-8 text-background">
              <h3 className="mb-2 font-display text-2xl font-medium tracking-[-0.01em]">
                Ready when you are.
              </h3>
              <p className="mb-6 text-[14.5px] leading-[1.55] text-background/70">
                Once you submit, we&apos;ll write the first draft of your site.
                It usually takes about an hour. You&apos;ll get an email with a
                preview link — you can edit anything you don&apos;t like, then
                we&apos;ll review it together before it goes live.
              </p>
              <button
                type="button"
                className="rounded-[10px] bg-background px-8 py-3.5 text-[15px] font-medium text-foreground transition-transform hover:-translate-y-px"
              >
                Write my site →
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
