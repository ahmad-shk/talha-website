import { getServiceBySlug } from "@/lib/services";

export type PricingLineItem = {
  key: string;
  label: string;
  quantity: number;
  unitAmount: number;
  total: number;
  currency: "USD" | "GBP";
};

export type ApplicationPricingInput = {
  serviceSlug: string;
  packageSlug?: string;
  additionalServices?: string[];
};

export type ApplicationPricing = {
  currency: "USD" | "GBP";
  lineItems: PricingLineItem[];
  subtotal: number;
  total: number;
};

/**
 * Frontend pricing adapter.
 *
 * Components consume this stable pricing contract instead of reading prices
 * directly. Later, a server-side pricing repository can implement the same
 * contract without requiring checkout/review components to change.
 */
export function calculateApplicationPricing({
  serviceSlug,
  packageSlug,
  additionalServices = [],
}: ApplicationPricingInput): ApplicationPricing {
  const service = getServiceBySlug(serviceSlug);
  const selectedPackage = service?.packages?.find(
    (item) => item.slug === packageSlug,
  ) ?? service?.packages?.[0];

  if (!service || !selectedPackage) {
    return {
      currency: "USD",
      lineItems: [],
      subtotal: 0,
      total: 0,
    };
  }

  const lineItems: PricingLineItem[] = [
    {
      key: `package:${selectedPackage.slug}`,
      label: selectedPackage.name,
      quantity: 1,
      unitAmount: selectedPackage.price,
      total: selectedPackage.price,
      currency: selectedPackage.currency,
    },
  ];

  // Additional services are currently descriptive selections. They are not
  // priced until explicit package/add-on prices are added to the catalog.
  // Keeping them out of the total prevents accidental $0/undefined pricing.
  void additionalServices;

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);

  return {
    currency: selectedPackage.currency,
    lineItems,
    subtotal,
    total: subtotal,
  };
}
