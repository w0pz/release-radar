// Countries whose release dates the site tracks, merged into one view.
export const COUNTRIES = [
  { code: "US", label: "US", name: "United States" },
  { code: "GB", label: "UK", name: "United Kingdom" },
  { code: "IE", label: "IE", name: "Ireland" },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];

export function countryLabel(code: string) {
  return COUNTRIES.find((c) => c.code === code)?.label ?? code;
}
