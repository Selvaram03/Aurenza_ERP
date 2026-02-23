const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

export function formatINR(value) {
  const numeric = Number(value ?? 0);
  return inrFormatter.format(Number.isFinite(numeric) ? numeric : 0);
}
