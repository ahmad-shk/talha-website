/** Canonical domain contracts shared by catalog, application and pricing code. */
export type Currency = "USD" | "GBP";
export type PricingModel = "fixed" | "formation" | "quote";
export type ServiceType = "formation" | "business" | "tax" | "compliance" | "banking" | "payments" | "ecommerce" | "branding" | "other";
export type ServiceCapabilities = { pricingModel: PricingModel; requiresPackage: boolean; requiresJurisdiction: boolean; supportsAddOns: boolean; applicationRequired: boolean; hasVariants: boolean };
export type PackageInclusion = { serviceSlug: string; label?: string };
export type Package = { slug: string; name: string; description: string; price: number; currency: Currency; features: string[]; inclusions?: PackageInclusion[]; sortOrder: number };
export type AddOn = { slug: string; name: string; description: string; price: number; currency: Currency; sortOrder?: number; available?: boolean };
export type ServiceVariant = { variantSlug: string; name: string; price: number; currency: Currency; description?: string };
export type Jurisdiction = { slug: string; code: string; name: string; country: string; filingFee: number; renewalFee: number; renewalDue?: string; description: string; suitableFor: string[] };
export type Service = { slug: string; name: string; shortDescription: string; description: string; category: string; type: ServiceType; featured: boolean; capabilities: ServiceCapabilities; packages?: Package[]; addOns?: AddOn[]; jurisdictions?: Jurisdiction[]; variants?: ServiceVariant[]; recommendations?: { serviceSlug: string; reason: string; required?: boolean }[] };
export type ApplicationSelection = { serviceSlug: string; packageSlug?: string; jurisdictionSlug?: string; variantSlug?: string; addOnSlugs: string[] };
export type ApplicationDocument = { id: string; memberId?: string; requirementKey: string; fileName: string; status: "pending" | "uploaded" | "rejected" | "approved" };
export type ApplicationMember = { id: string; fullName: string; ownershipPercentage?: number; country?: string; dateOfBirth?: string; address?: string; documentIds?: string[] };
export type Application = ApplicationSelection & { id: string; userId: string; currentStep: number; answers: Record<string, unknown>; members: ApplicationMember[]; documents: ApplicationDocument[]; status: string; createdAt: string; updatedAt: string };
export type PricingLineItem = { key: string; label: string; quantity: number; unitAmount: number; total: number; currency: Currency };
export type PricingResult = { currency: Currency; lineItems: PricingLineItem[]; subtotal: number; total: number; pricingVersion?: string };
export type BillingOrder = { id: string; applicationId: string; lineItems: PricingLineItem[]; subtotal: number; total: number; currency: Currency; status: string };
