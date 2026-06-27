export function formatCurrency(
  value: number,
  currency: string = "HNL",
  locale: string = "es-HN"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(
  value: string | Date,
  locale: string = "es-HN"
) {
  return new Intl.DateTimeFormat(locale).format(
    new Date(value)
  );
}

export function formatNumber(
  value: number,
  locale: string = "es-HN"
) {
  return new Intl.NumberFormat(locale).format(
    value
  );
}

export function formatPercent(
  value: number,
  decimals = 2
) {
  return `${value.toFixed(decimals)}%`;
}