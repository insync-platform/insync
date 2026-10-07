// Content switches for the platform pages. Everything that still waits on a decision or a
// measured figure lives here, so publishing a fact is a change to this file, not to the pages.

export type Status = "live" | "pilot" | "soon";

// A "soon" item gets a "Binnenkort" badge; "pilot" shows no badge but is never offered as
// available. To be confirmed per item before going live.
export const status = {
  aiAssistant: "live",
  compare: "live",
  customerPortal: "live",
  workQueue: "pilot",
  reconcileTotals: "pilot",
  clientQuestions: "pilot",
  clientRequests: "pilot",
  claimCases: "pilot",
  autonomySettings: "pilot",
  embeddedPanel: "soon",
  api: "soon",
  signals: "soon",
} satisfies Record<string, Status>;

// Time saved. Leave a value null until it is measured: a tile without a value is not rendered
// in production, and the whole row disappears when none is filled.
export const stats: { value: string | null; label: string }[] = [
  { value: null, label: "minder per klantvraag per mail" },
  { value: null, label: "van de borderellen sluit zonder handwerk" },
  { value: null, label: "per week terug voor een team" },
];

// Back offices as named on the site. Only list what is confirmed.
export const backOffices: { name: string; note: string }[] = [
  { name: "Novulo", note: "Lezen en voorstellen uitvoeren" },
];

// Mentions that need explicit consent before they are shown.
export const show = {
  duGardijnExample: false, // the borderel check at du Gardijn, on "Zo werk je ermee"
  pricing: false, // "per afgehandelde zaak"
  quote: null as null | { text: string; name: string; role: string; company: string },
};
