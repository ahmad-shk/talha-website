import type { AddOn, Package, Service, ServiceVariant } from "./domain";
import {
  serviceCatalog as legacyServiceCatalog,
  serviceCategories,
  type ServiceConfig as LegacyServiceConfig,
  type ServicePackageConfig as LegacyPackageConfig,
} from "./catalog";
import { jurisdictions } from "./states";

const usaFormationJurisdictionSlugs = new Set([
  "wyoming",
  "new-mexico",
  "delaware",
  "texas",
  "florida",
]);

const usaFormationPackages: Package[] = [
  {
    slug: "basic",
    name: "Basic",
    description: "Core U.S. LLC formation with the essential business setup services.",
    price: 125,
    currency: "USD",
    features: ["LLC Registration", "Registered Agent 1 year", "Business Mailing Address", "US Phone Number", "EIN", "Business Payoneer Account", "Business Stripe Account"],
    sortOrder: 1,
  },
  {
    slug: "standard",
    name: "Standard",
    description: "Basic U.S. LLC formation plus a unique business address.",
    price: 174,
    currency: "USD",
    features: ["Everything in Basic", "Unique Business Address"],
    sortOrder: 2,
  },
  {
    slug: "premium",
    name: "Premium",
    description: "Standard U.S. LLC formation plus ITIN and PayPal account setup.",
    price: 280,
    currency: "USD",
    features: ["Everything in Standard", "ITIN", "PayPal Account Setup"],
    sortOrder: 3,
  },
];

const usaFormationAddOns: AddOn[] = [
  {
    slug: "wise-account-setup",
    name: "Wise Account Setup",
    description: "Wise account setup with trading address and proof, plus Wise setup fees.",
    price: 75,
    currency: "USD",
    sortOrder: 1,
    available: true,
  },
];

const usaStandaloneVariants: Record<string, ServiceVariant[]> = {
  "itin-processing": [{ variantSlug: "itin", name: "ITIN", price: 150, currency: "USD" }],
  "ein-without-ssn": [
    { variantSlug: "resident", name: "International EIN — Resident", price: 10, currency: "USD" },
    { variantSlug: "non-resident", name: "International EIN — Non-Resident", price: 25, currency: "USD" },
  ],
};

function capabilitiesFor(service: LegacyServiceConfig) {
  const isUsaLlc = service.slug === "usa-llc";
  const hasVariants = Boolean(usaStandaloneVariants[service.slug]?.length);
  return {
    pricingModel: service.type === "formation" ? ("formation" as const) : ("fixed" as const),
    requiresPackage: Boolean(service.packages?.length) || isUsaLlc,
    requiresJurisdiction: isUsaLlc,
    supportsAddOns: isUsaLlc,
    applicationRequired: true,
    hasVariants,
  };
}

function normalizePackage(pkg: LegacyPackageConfig): Package {
  return { slug: pkg.slug, name: pkg.name, description: pkg.description, price: pkg.price, currency: pkg.currency, features: pkg.features, sortOrder: pkg.sortOrder };
}

function normalizeService(service: LegacyServiceConfig): Service {
  const isUsaLlc = service.slug === "usa-llc";
  const variants = usaStandaloneVariants[service.slug];
  return {
    slug: service.slug,
    name: service.name,
    shortDescription: service.shortDescription,
    description: service.description,
    category: service.category,
    type: service.type,
    featured: service.featured,
    capabilities: capabilitiesFor(service),
    packages: isUsaLlc ? usaFormationPackages : service.packages?.map(normalizePackage),
    addOns: isUsaLlc ? usaFormationAddOns : undefined,
    jurisdictions: isUsaLlc ? jurisdictions.filter((item) => usaFormationJurisdictionSlugs.has(item.slug)) : undefined,
    variants,
    recommendations: service.recommendations,
  };
}

export const commercialServiceCatalog: Service[] = legacyServiceCatalog.map(normalizeService);
export const commercialServiceCategories = serviceCategories;

export function getCommercialServiceBySlug(slug: string): Service | undefined {
  return commercialServiceCatalog.find((service) => service.slug === slug);
}

export function getCommercialServiceHref(slug: string): string {
  return `/services/${slug}`;
}

export const serviceCatalog: Service[] = commercialServiceCatalog;
export const getServiceBySlug = getCommercialServiceBySlug;
export const getServiceHref = getCommercialServiceHref;
