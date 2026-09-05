export const services = [
  {
    id: "llc-formation",
    title: "LLC Formation",
    desc: "Form a U.S. LLC with state filing, name preparation and formation documents managed in one workflow.",
  },
  {
    id: "ein-without-ssn",
    title: "EIN without an SSN",
    desc: "Get a federal tax ID through an assisted IRS filing process designed for non-U.S. founders.",
  },
  {
    id: "us-business-banking",
    title: "U.S. Business Banking",
    desc: "Assisted setup for a U.S. business account, payment rails and account-readiness documentation.",
  },
  {
    id: "payment-gateway-setup",
    title: "Payment Gateway Setup",
    desc: "Get support preparing and applying for global payment processors under your business entity.",
  },
  {
    id: "registered-agent-us-address",
    title: "Registered Agent & U.S. Address",
    desc: "Keep a compliant registered-agent relationship and business-address solution for your entity.",
  },
  {
    id: "compliance-renewals",
    title: "Compliance & Renewals",
    desc: "Track annual reports, renewal dates and recurring compliance obligations.",
  },
  {
    id: "itin-processing",
    title: "ITIN Processing",
    desc: "Assisted W-7 preparation and submission support when an ITIN is actually required.",
  },
  {
    id: "trademark",
    title: "Trademark",
    desc: "Prepare a U.S. trademark application for your brand name, logo or other eligible mark.",
  },
  {
    id: "annual-report",
    title: "Annual Report",
    desc: "Annual-report preparation and filing support for U.S. entities.",
  },
  {
    id: "wise-trading-address",
    title: "Wise Trading Address",
    desc: "Business-address support for eligible payment and financial workflows.",
  },
  {
    id: "website",
    title: "Website",
    desc: "A conversion-focused website package for founders launching their U.S. business.",
  },
  {
    id: "bookkeeping-tax",
    title: "Bookkeeping & Tax Referrals",
    desc: "Connect your business with accounting and tax-filing professionals.",
  },
  {
    id: "us-phone",
    title: "U.S. Phone Number",
    desc: "Business communications support for eligible plans and use cases.",
  },
  {
    id: "operating-agreement",
    title: "Operating Agreement",
    desc: "Customized operating-agreement preparation for your LLC structure.",
  },
  {
    id: "business-address",
    title: "Business Address",
    desc: "A business-address option for eligible founders and workflows.",
  },
  {
    id: "tax-consultation",
    title: "Tax Consultation",
    desc: "Referral and consultation support for U.S. business tax questions.",
  },
];
export const states = {
  Wyoming: {
    abbr: "WY",
    file: 100,
    renewal: 60,
    due: "1st day of anniversary month",
    tag: "Non-resident favourite",
  },
  "New Mexico": {
    abbr: "NM",
    file: 50,
    renewal: 0,
    due: "No annual report",
    tag: "Low ongoing cost",
  },
  Delaware: {
    abbr: "DE",
    file: 110,
    renewal: 300,
    due: "June 1",
    tag: "Investor friendly",
  },
  Texas: {
    abbr: "TX",
    file: 300,
    renewal: 0,
    due: "May 15",
    tag: "Large-market option",
  },
  Florida: {
    abbr: "FL",
    file: 125,
    renewal: 138.75,
    due: "May 1",
    tag: "Popular operating state",
  },
} as const;
export const faqs = [
  [
    "Do I need to travel to the U.S.?",
    "No. The core formation workflow is designed for remote founders. Requirements vary by service and provider.",
  ],
  [
    "Can I get an EIN without an SSN?",
    "Many non-resident founders can apply without an SSN. Eligibility and IRS requirements should be checked for the specific applicant.",
  ],
  [
    "How long does formation take?",
    "Timing depends on the state and any third-party approvals. Your dashboard can be used to track progress.",
  ],
  [
    "Which state should I choose?",
    "It depends on where you operate, your ownership structure, privacy preferences and ongoing compliance costs.",
  ],
  [
    "What about U.S. taxes?",
    "A U.S. entity can create U.S. filing obligations. Get professional tax advice for your specific facts.",
  ],
  [
    "What happens after formation?",
    "You receive formation documents and can proceed with EIN, banking, payment and compliance workflows as applicable.",
  ],
];
export const articles = [
  {
    slug: "how-to-open-a-us-business-bank-account",
    title: "How To Open a US Business Bank Account",
    excerpt:
      "A practical overview of documents, account selection and the basic process.",
  },
  {
    slug: "us-llc-for-pakistani-founders",
    title: "A Practical Guide to a U.S. LLC for Pakistani Founders",
    excerpt:
      "Key decisions to make before forming a U.S. company from Pakistan.",
  },
  {
    slug: "ein-without-ssn",
    title: "EIN Without an SSN: What Non-Residents Should Know",
    excerpt:
      "Understand the general process, documentation and common mistakes.",
  },
];
