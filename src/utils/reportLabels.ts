const FIELD_LABEL_OVERRIDES: Record<string, string> = {
  date: "Date",
  status: "Status",
  payment_mode: "Payment Mode",
  apartment_id: "Apartment ID",
  apartment_name: "Apartment Name",
  tenant_id: "Tenant ID",
  tenant_name: "Tenant Name",
  nights: "Nights",
  booking_count: "Booking Count",
  total_revenue: "Total Revenue",
  avg_booking_value: "Average Booking Value",
  min_booking_value: "Minimum Booking Value",
  max_booking_value: "Maximum Booking Value",
  paid_booking_count: "Paid Booking Count",
  unique_tenant_count: "Unique Tenant Count",
  unique_apartment_count: "Unique Apartment Count",
  unique_paid_tenant_count: "Unique Paid Tenant Count",
  occupancy_percent: "Occupancy Percent",
  adr: "Average Daily Rate",
  check_time: "Check Time",
  avg: "Average",
  min: "Minimum",
  max: "Maximum",
  sum: "Sum",
  count: "Count",
  distinct_count: "Distinct Count",
  pct: "Percent",
  pct_change: "Percent Change",
  id: "Identifier",
  p50: "Median (P50)",
  p90: "90th Percentile (P90)",
  p95: "95th Percentile (P95)",
  avg_length_of_stay: "Average Length of Stay",
  review_avg_rating: "Average Review Rating",
  review_count: "Review Count",
  package_revenue: "Package Revenue",
  package_count: "Package Count",
  subscription_active_count: "Active Subscriptions",
  subscription_revenue: "Subscription Revenue",
  subscription_churn_count: "Subscription Churn Count",
  subscription_churn_rate: "Subscription Churn Rate",
  avg_sold_price: "Average Sold Price",
  avg_base_price: "Average Base Price",
  avg_price_delta: "Average Price Delta",
  revenue: "Revenue",
  bookings: "Bookings",
  user_id: "User",
  total_booking: "Total Bookings",
  total_user: "Total Tenants",
};

export function humanizeReportField(field: string): string {
  const normalized = (field ?? "").trim();
  if (!normalized) {
    return "-";
  }

  const lower = normalized.toLowerCase();

  // If the whole field matches an override, return it.
  const override = FIELD_LABEL_OVERRIDES[lower];
  if (override) {
    // Append currency for price-related overrides
    const PRICE_KEYS = [
      "total_revenue",
      "avg_booking_value",
      "min_booking_value",
      "max_booking_value",
      "adr",
      "package_revenue",
      "subscription_revenue",
      "avg_sold_price",
      "avg_base_price",
      "avg_price_delta",
      "revenue",
    ];

    if (PRICE_KEYS.includes(lower)) {
      return `${override} (VND)`;
    }

    return override;
  }

  // Handle aggregation prefixes like "avg_", "count_", "min_", etc.
  const aggMatch = lower.match(/^(distinct_count|distinct|avg|min|max|sum|count|p50|p90|p95)_(.+)$/);
  if (aggMatch) {
    const agg = aggMatch[1];
    let rest = aggMatch[2];

    const AGG_MAP: Record<string, string> = {
      avg: "Average",
      min: "Minimum",
      max: "Maximum",
      sum: "Sum",
      count: "Count",
      distinct: "Distinct",
      distinct_count: "Distinct Count",
      p50: "Median (P50)",
      p90: "90th Percentile (P90)",
      p95: "95th Percentile (P95)",
    };

    // If the rest itself starts with the same aggregation (e.g., avg_avg_base_price),
    // remove the duplicated agg prefix to avoid "Average Average ...".
    const dupPrefix = `${agg}_`;
    if (rest.startsWith(dupPrefix)) {
      rest = rest.slice(dupPrefix.length);
    }

    // If rest has an explicit override, use it; otherwise humanize it.
    const restLabel = FIELD_LABEL_OVERRIDES[rest] ?? rest.replace(/_/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/\b\w/g, (char) => char.toUpperCase());

    // If restLabel already begins with the agg word, don't duplicate.
    const aggWord = AGG_MAP[agg] ?? agg.toUpperCase();
    const baseLabel = restLabel.toLowerCase().startsWith(aggWord.toLowerCase()) ? restLabel : `${aggWord} ${restLabel}`;

    // Append currency for price-related metric keys
    const PRICE_KEYWORDS = ["revenue", "price", "adr", "booking_value", "sold_price", "base_price", "amount"];
    const isPrice = PRICE_KEYWORDS.some((kw) => rest.includes(kw) || restLabel.toLowerCase().includes(kw));
    return isPrice ? `${baseLabel} (VND)` : baseLabel;
  }

  return normalized
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function humanizeAggregation(aggregation: string): string {
  return humanizeReportField(aggregation);
}
