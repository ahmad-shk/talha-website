export type ApplicationFieldType = "text" | "textarea" | "select" | "radio" | "country" | "state" | "number" | "date" | "checkbox" | "repeatable";
export type ApplicationOption = { label: string; value: string; description?: string };
export type ApplicationCondition = { field: string; equals?: string | number | boolean; notEquals?: string | number | boolean };
export type ApplicationField = { key: string; label: string; description?: string; type: ApplicationFieldType; required?: boolean; placeholder?: string; options?: ApplicationOption[]; itemFields?: ApplicationField[]; condition?: ApplicationCondition; validation?: { minLength?: number; maxLength?: number; min?: number; max?: number } };
export type ApplicationStep = { id: string; title: string; description: string; fields: ApplicationField[] };
export type ApplicationConfig = { serviceSlug: string; steps: ApplicationStep[] };

const usaMemberFields: ApplicationField[] = [
  { key: "full_name", label: "Full legal name", type: "text", required: true, placeholder: "Member's full legal name", validation: { minLength: 2, maxLength: 150 } },
  { key: "ownership_percentage", label: "Ownership percentage", type: "number", required: true, validation: { min: 1, max: 100 } },
  { key: "country", label: "Country of residence", type: "country", required: true },
  { key: "date_of_birth", label: "Date of birth", type: "date", required: true },
  { key: "address", label: "Residential address", type: "textarea", required: true, validation: { minLength: 5, maxLength: 500 } },
];

export const usaLlcApplication: ApplicationConfig = {
  serviceSlug: "usa-llc",
  steps: [
    { id: "business", title: "Your Business", description: "Tell us what you are planning to do with your company.", fields: [
      { key: "business_name", label: "Business name", description: "Enter the legal business name you want us to use for formation.", type: "text", required: true, placeholder: "Example Holdings LLC", validation: { minLength: 2, maxLength: 150 } },
      { key: "business_activity", label: "What will your business do?", type: "select", required: true, options: [{ label: "E-commerce", value: "ecommerce" }, { label: "SaaS / Software", value: "saas" }, { label: "Agency", value: "agency" }, { label: "Consulting", value: "consulting" }, { label: "Trading", value: "trading" }, { label: "Other", value: "other" }] },
      { key: "business_description", label: "Business information", description: "Briefly describe what your company will sell or provide.", type: "textarea", required: true, placeholder: "Example: We sell consumer products online to customers in the United States.", validation: { minLength: 20, maxLength: 1000 } },
    ] },
    { id: "contact", title: "Contact Information", description: "Provide the contact details we should use for your application.", fields: [
      { key: "email", label: "Email address", type: "text", required: true, placeholder: "you@example.com" },
      { key: "phone", label: "Phone number", type: "text", required: true, placeholder: "+1 555 000 0000" },
      { key: "whatsapp", label: "WhatsApp number", type: "text", required: true, placeholder: "+1 555 000 0000" },
    ] },
    { id: "owner", title: "Company Structure & Owner", description: "Choose the LLC structure first, then provide the legal details for the primary owner.", fields: [
      { key: "company_type", label: "Company type", type: "radio", required: true, options: [{ label: "Single member LLC", value: "single_member_llc", description: "You are the only company member. Your ownership is automatically set to 100%." }, { label: "Multi member LLC", value: "multi_member_llc", description: "The company has two or more members. You will enter each member's ownership below." }] },
      { key: "owner_full_name", label: "Legal full name", type: "text", required: true, placeholder: "Your full legal name", validation: { minLength: 2, maxLength: 150 } },
      { key: "owner_country", label: "Country of residence", type: "country", required: true },
      { key: "owner_date_of_birth", label: "Date of birth", type: "date", required: true },
      { key: "owner_ownership_percentage", label: "Ownership percentage", description: "Enter the primary owner's percentage. All member percentages must total 100%.", type: "number", required: true, condition: { field: "company_type", equals: "multi_member_llc" }, validation: { min: 1, max: 100 } },
    ] },
    { id: "location", title: "Your Location", description: "Provide your current residential address.", fields: [
      { key: "residential_address", label: "Street address", type: "text", required: true, placeholder: "Street address" },
      { key: "residential_city", label: "City", type: "text", required: true },
      { key: "residential_state", label: "State / Province", type: "text", required: true },
      { key: "residential_postal_code", label: "Postal code", type: "text", required: true },
      { key: "residential_country", label: "Country", type: "country", required: true },
    ] },
    { id: "company", title: "Additional Company Members", description: "For a multi-member LLC, add every additional member and assign their ownership percentage.", fields: [
      { key: "members", label: "Additional members", description: "Add every additional member of the multi-member company.", type: "repeatable", required: true, condition: { field: "company_type", equals: "multi_member_llc" }, itemFields: usaMemberFields },
    ] },
    { id: "documents", title: "Identity & Address Documents", description: "Upload the required identity and address documents for every company member.", fields: [] },
    { id: "services", title: "Optional Services", description: "Review the optional services selected with your commercial package.", fields: [{ key: "selected_add_ons", label: "Optional services", type: "checkbox", options: [{ label: "Wise Account Setup — $75", value: "wise-account-setup", description: "Includes trading address with proof and Wise setup fees." }] }] },
  ],
};

export const itinApplication: ApplicationConfig = {
  serviceSlug: "itin-processing",
  steps: [
    { id: "applicant", title: "Applicant Information", description: "Provide the legal details we need for your ITIN application.", fields: [
      { key: "legal_full_name", label: "Legal full name", type: "text", required: true, validation: { minLength: 2, maxLength: 150 } },
      { key: "email", label: "Email address", type: "text", required: true, placeholder: "you@example.com" },
      { key: "phone", label: "Phone number", type: "text", required: true },
      { key: "whatsapp", label: "WhatsApp number", type: "text", required: true },
    ] },
    { id: "documents", title: "Supporting Documents", description: "Upload the documents available for your ITIN application.", fields: [
      { key: "articles_available", label: "Do you have Articles of Organization available?", type: "radio", required: true, options: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }] },
      { key: "ein_form_available", label: "Do you have an EIN form available?", type: "radio", required: true, options: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }] },
    ] },
    { id: "payment", title: "Payment & Submission", description: "Review the service fee and prepare your application for checkout.", fields: [] },
  ],
};

export const internationalEinApplication: ApplicationConfig = {
  serviceSlug: "ein-without-ssn",
  steps: [
    { id: "responsible-party", title: "Responsible Party", description: "Provide the legal details of the single member or responsible party with the relevant ownership interest.", fields: [
      { key: "legal_full_name", label: "Legal full name", type: "text", required: true, validation: { minLength: 2, maxLength: 150 } },
      { key: "email", label: "Email address", type: "text", required: true, placeholder: "you@example.com" },
      { key: "phone", label: "Phone number", type: "text", required: true },
      { key: "whatsapp", label: "WhatsApp number", type: "text", required: true },
    ] },
    { id: "documents", title: "Supporting Documents", description: "Provide the formation documents available for the EIN application.", fields: [
      { key: "formation_document_type", label: "Document you will provide", type: "radio", required: true, options: [{ label: "Articles of Organization", value: "articles" }, { label: "SS-4", value: "ss4" }] },
    ] },
  ],
};

export const ukLtdApplication: ApplicationConfig = {
  serviceSlug: "uk-ltd",
  steps: [
    { id: "business", title: "Your Business", description: "Tell us about the business you are establishing.", fields: [{ key: "business_activity", label: "What will your business do?", type: "select", required: true, options: [{ label: "E-commerce", value: "ecommerce" }, { label: "SaaS / Software", value: "saas" }, { label: "Agency", value: "agency" }, { label: "Consulting", value: "consulting" }, { label: "Trading", value: "trading" }, { label: "Other", value: "other" }] }, { key: "business_description", label: "Describe your business", type: "textarea", required: true, placeholder: "Briefly describe your business activities.", validation: { minLength: 20, maxLength: 1000 } }] },
    { id: "owner", title: "Director Information", description: "Provide information about the company director.", fields: [{ key: "director_full_name", label: "Full legal name", type: "text", required: true }, { key: "director_country", label: "Country of residence", type: "country", required: true }, { key: "director_date_of_birth", label: "Date of birth", type: "date", required: true }] },
    { id: "company", title: "Company Details", description: "Choose your preferred company name and structure.", fields: [{ key: "preferred_company_name", label: "Preferred company name", type: "text", required: true, placeholder: "Example Ltd" }, { key: "alternative_company_name", label: "Alternative company name", type: "text", required: false }, { key: "share_structure", label: "Share structure", type: "radio", required: true, options: [{ label: "1 shareholder", value: "one_shareholder" }, { label: "Multiple shareholders", value: "multiple_shareholders" }] }] },
  ],
};

export const applicationConfigs: Record<string, ApplicationConfig> = { "usa-llc": usaLlcApplication, "uk-ltd": ukLtdApplication, "itin-processing": itinApplication, "ein-without-ssn": internationalEinApplication };
export function getApplicationConfig(serviceSlug: string): ApplicationConfig | undefined { return applicationConfigs[serviceSlug]; }