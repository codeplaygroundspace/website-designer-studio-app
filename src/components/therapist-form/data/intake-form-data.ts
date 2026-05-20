export const sections = [
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
    requiredFields: [
      "whoYouHelp",
      "struggle1",
      "struggle2",
      "struggle3",
      "triggerMoment",
    ],
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
    requiredFields: [],
  },
  {
    id: "s8",
    number: 8,
    label: "Tone & voice",
    requiredFields: ["toneSelection"],
  },
];

export const fieldExamples: Record<string, string> = {
  whoYouHelp:
    "\"I work with high-achieving professionals in their 30s and 40s who are outwardly successful but privately exhausted — people who can hold it together at work but feel like they're quietly unravelling at home.\"",
  struggles:
    "\"I can't switch off after work\" · \"I've been signed off sick but feel guilty about it\" · \"My relationship is suffering because I bring all my stress home\"",
  triggerMoment:
    "\"Often it's a moment of realising the coping strategies that used to work just aren't cutting it anymore — a health scare, a relationship breaking point, or simply waking up one morning and thinking: I can't keep doing this.\"",
  workingStyle:
    "\"People often tell me sessions feel like a conversation rather than an interrogation. I'll gently challenge you when it's useful, but I'll never push you somewhere you're not ready to go. There's humour in the room too — therapy doesn't have to feel heavy all the time.\"",
  whyYouDoThis:
    "\"I came to this work after my own experience of burnout in my late twenties. I know what it's like to look completely fine from the outside while quietly falling apart — and I know how much difference the right support can make.\"",
};

export const insurers = [
  "Bupa",
  "AXA Health",
  "Aviva",
  "Vitality",
  "WPA",
  "Cigna",
];

export const issues = [
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
