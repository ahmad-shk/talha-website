export type ApplicationFieldType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "country"
  | "state"
  | "number"
  | "date"
  | "checkbox";

export type ApplicationOption = {
  label: string;
  value: string;
  description?: string;
};

export type ApplicationField = {
  key: string;
  label: string;
  description?: string;

  type: ApplicationFieldType;

  required?: boolean;

  placeholder?: string;

  options?: ApplicationOption[];

  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
};

export type ApplicationStep = {
 id: string;
  title: string;
  description: string;
  fields: ApplicationField[];
};

export type ApplicationConfig = {
  serviceSlug: string;
  steps: ApplicationStep[];
};

/* -------------------------------------------------------------------------- */
/* USA LLC Application                                                        */
/* -------------------------------------------------------------------------- */

export const usaLlcApplication: ApplicationConfig = {
  serviceSlug: "usa-llc",

  steps: [
    {
      id: "business",
      title: "Your Business",
      description:
        "Tell us what you are planning to do with your company.",

      fields: [
        {
          key: "business_activity",
          label: "What will your business do?",
          type: "select",
          required: true,

          options: [
            {
              label: "E-commerce",
              value: "ecommerce",
            },
            {
              label: "SaaS / Software",
              value: "saas",
            },
            {
              label: "Agency",
              value: "agency",
            },
            {
              label: "Consulting",
              value: "consulting",
            },
            {
              label: "Trading",
              value: "trading",
            },
            {
              label: "Other",
              value: "other",
            },
          ],
        },

        {
          key: "business_description",
          label: "Describe your business",
          description:
            "Briefly describe what your company will sell or provide.",
          type: "textarea",
          required: true,
          placeholder:
            "Example: We sell consumer products online to customers in the United States.",
          validation: {
            minLength: 20,
            maxLength: 1000,
          },
        },
      ],
    },

    {
      id: "owner",
      title: "Owner Information",
      description:
        "Provide information about the person or people who will own the company.",

      fields: [
        {
          key: "owner_full_name",
          label: "Full legal name",
          type: "text",
          required: true,
          placeholder: "Your full legal name",
          validation: {
            minLength: 2,
            maxLength: 150,
          },
        },

        {
          key: "owner_country",
          label: "Country of residence",
          type: "country",
          required: true,
        },

        {
          key: "owner_date_of_birth",
          label: "Date of birth",
          type: "date",
          required: true,
        },

        {
          key: "owner_ownership_percentage",
          label: "Ownership percentage",
          type: "number",
          required: true,
          validation: {
            min: 1,
            max: 100,
          },
        },
      ],
    },

    {
      id: "address",
      title: "Your Address",
      description:
        "Provide your current residential address.",

      fields: [
        {
          key: "residential_address",
          label: "Street address",
          type: "text",
          required: true,
          placeholder: "Street address",
        },

        {
          key: "residential_city",
          label: "City",
          type: "text",
          required: true,
        },

        {
          key: "residential_state",
          label: "State / Province",
          type: "text",
          required: true,
        },

        {
          key: "residential_postal_code",
          label: "Postal code",
          type: "text",
          required: true,
        },

        {
          key: "residential_country",
          label: "Country",
          type: "country",
          required: true,
        },
      ],
    },

    {
      id: "company",
      title: "Company Details",
      description:
        "Choose how you want your U.S. LLC to be established.",

      fields: [
        {
          key: "preferred_company_name",
          label: "Preferred company name",
          description:
            "Enter your first choice for the company name.",
          type: "text",
          required: true,
          placeholder: "Example Holdings LLC",
          validation: {
            minLength: 2,
            maxLength: 150,
          },
        },

        {
          key: "alternative_company_name",
          label: "Alternative company name",
          description:
            "Provide a backup name in case your first choice is unavailable.",
          type: "text",
          required: false,
          placeholder: "Alternative Holdings LLC",
          validation: {
            maxLength: 150,
          },
        },

        {
          key: "formation_state",
          label: "Preferred formation state",
          type: "state",
          required: true,

          options: [
            {
              label: "Wyoming",
              value: "WY",
              description:
                "Popular with non-resident founders.",
            },
            {
              label: "New Mexico",
              value: "NM",
              description:
                "Known for relatively low ongoing costs.",
            },
            {
              label: "Delaware",
              value: "DE",
              description:
                "Common choice for investor-focused companies.",
            },
            {
              label: "Texas",
              value: "TX",
              description:
                "Large U.S. operating market.",
            },
            {
              label: "Florida",
              value: "FL",
              description:
                "Popular operating state.",
            },
          ],
        },

        {
          key: "company_structure",
          label: "Company structure",
          type: "radio",
          required: true,

          options: [
            {
              label: "Single-member LLC",
              value: "single_member",
            },
            {
              label: "Multi-member LLC",
              value: "multi_member",
            },
          ],
        },
      ],
    },

    {
      id: "services",
      title: "Additional Services",
      description:
        "Select any additional services you may need after formation.",

      fields: [
        {
          key: "additional_services",
          label: "Services you are interested in",
          type: "checkbox",

          options: [
            {
              label: "EIN without an SSN",
              value: "ein-without-ssn",
            },
            {
              label: "Registered Agent & U.S. Address",
              value: "registered-agent-us-address",
            },
            {
              label: "Operating Agreement",
              value: "operating-agreement",
            },
            {
              label: "U.S. Business Banking",
              value: "us-business-banking",
            },
            {
              label: "Payment Gateway Setup",
              value: "payment-gateway-setup",
            },
            {
              label: "ITIN Processing",
              value: "itin-processing",
            },
          ],
        },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* UK LTD Application                                                         */
/* -------------------------------------------------------------------------- */

export const ukLtdApplication: ApplicationConfig = {
  serviceSlug: "uk-ltd",

  steps: [
    {
      id: "business",
      title: "Your Business",
      description:
        "Tell us about the business you are establishing.",

      fields: [
        {
          key: "business_activity",
          label: "What will your business do?",
          type: "select",
          required: true,

          options: [
            {
              label: "E-commerce",
              value: "ecommerce",
            },
            {
              label: "SaaS / Software",
              value: "saas",
            },
            {
              label: "Agency",
              value: "agency",
            },
            {
              label: "Consulting",
              value: "consulting",
            },
            {
              label: "Trading",
              value: "trading",
            },
            {
              label: "Other",
              value: "other",
            },
          ],
        },

        {
          key: "business_description",
          label: "Describe your business",
          type: "textarea",
          required: true,
          placeholder:
            "Briefly describe your business activities.",
          validation: {
            minLength: 20,
            maxLength: 1000,
          },
        },
      ],
    },

    {
      id: "owner",
      title: "Director Information",
      description:
        "Provide information about the company director.",

      fields: [
        {
          key: "director_full_name",
          label: "Full legal name",
          type: "text",
          required: true,
        },

        {
          key: "director_country",
          label: "Country of residence",
          type: "country",
          required: true,
        },

        {
          key: "director_date_of_birth",
          label: "Date of birth",
          type: "date",
          required: true,
        },
      ],
    },

    {
      id: "company",
      title: "Company Details",
      description:
        "Choose your preferred company name and structure.",

      fields: [
        {
          key: "preferred_company_name",
          label: "Preferred company name",
          type: "text",
          required: true,
          placeholder: "Example Ltd",
        },

        {
          key: "alternative_company_name",
          label: "Alternative company name",
          type: "text",
          required: false,
        },

        {
          key: "share_structure",
          label: "Share structure",
          type: "radio",
          required: true,

          options: [
            {
              label: "1 shareholder",
              value: "one_shareholder",
            },
            {
              label: "Multiple shareholders",
              value: "multiple_shareholders",
            },
          ],
        },
      ],
    },

    {
      id: "services",
      title: "Additional Services",
      description:
        "Choose any additional services you may need.",

      fields: [
        {
          key: "additional_services",
          label: "Services you are interested in",
          type: "checkbox",

          options: [
            {
              label: "Business Address",
              value: "business-address",
            },
            {
              label: "Payment Gateway Setup",
              value: "payment-gateway-setup",
            },
            {
              label: "Compliance & Renewals",
              value: "compliance-renewals",
            },
          ],
        },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Lookup helpers                                                             */
/* -------------------------------------------------------------------------- */

export const applicationConfigs: Record<
  string,
  ApplicationConfig
> = {
  "usa-llc": usaLlcApplication,
  "uk-ltd": ukLtdApplication,
};

export function getApplicationConfig(
  serviceSlug: string,
): ApplicationConfig | undefined {
  return applicationConfigs[serviceSlug];
}