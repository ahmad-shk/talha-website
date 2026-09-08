import type { Jurisdiction } from "./domain";

export type FormationState = {
  slug: string;
  name: string;
  abbreviation: string;
  filingFee: number;
  renewalFee: number;
  renewalDue: string;
  tag: string;
  description: string;
  suitableFor: string[];
};

export const formationStates: FormationState[] = [
  {
    slug: "wyoming", name: "Wyoming", abbreviation: "WY", filingFee: 100, renewalFee: 60,
    renewalDue: "1st day of anniversary month", tag: "Non-resident favourite",
    description: "A popular choice for founders who want a relatively simple U.S. LLC structure.",
    suitableFor: ["Non-U.S. founders", "Online businesses", "Small businesses", "E-commerce"],
  },
  {
    slug: "new-mexico", name: "New Mexico", abbreviation: "NM", filingFee: 50, renewalFee: 0,
    renewalDue: "No annual report", tag: "Low ongoing cost",
    description: "An option often considered by founders prioritizing lower ongoing state costs.",
    suitableFor: ["Non-U.S. founders", "Online businesses", "Cost-conscious founders"],
  },
  {
    slug: "delaware", name: "Delaware", abbreviation: "DE", filingFee: 110, renewalFee: 300,
    renewalDue: "June 1", tag: "Investor friendly",
    description: "A well-known jurisdiction for companies with more complex corporate or investor requirements.",
    suitableFor: ["Investor-focused businesses", "Startups", "Companies expecting outside investment"],
  },
  {
    slug: "texas", name: "Texas", abbreviation: "TX", filingFee: 300, renewalFee: 0,
    renewalDue: "May 15", tag: "Large-market option",
    description: "A major U.S. operating state that may make sense when the business has a genuine Texas connection.",
    suitableFor: ["Businesses operating in Texas", "Local businesses", "Large-market operations"],
  },
  {
    slug: "florida", name: "Florida", abbreviation: "FL", filingFee: 125, renewalFee: 138.75,
    renewalDue: "May 1", tag: "Popular operating state",
    description: "A popular operating state for businesses with a genuine Florida connection.",
    suitableFor: ["Florida-based businesses", "Local businesses", "Operating businesses"],
  },
];

export function getFormationState(slug: string): FormationState | undefined {
  return formationStates.find((state) => state.slug === slug);
}

/** Canonical commercial jurisdiction projection; FormationState remains the UI-facing compatibility type. */
export const jurisdictions: Jurisdiction[] = formationStates.map((state) => ({
  slug: state.slug,
  code: state.abbreviation,
  name: state.name,
  country: "US",
  filingFee: state.filingFee,
  renewalFee: state.renewalFee,
  renewalRules: state.renewalDue,
  description: state.description,
  suitableFor: state.suitableFor,
}));

export function getJurisdiction(slug: string): Jurisdiction | undefined {
  return jurisdictions.find((jurisdiction) => jurisdiction.slug === slug);
}
