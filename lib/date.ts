const PT_LOCALE = "pt-PT";

export function formatDate(date: Date | string, format: "full" | "short" = "full"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    return d.toLocaleDateString(PT_LOCALE, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (format === "full") {
    return d.toLocaleDateString(PT_LOCALE, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return d.toLocaleDateString(PT_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}