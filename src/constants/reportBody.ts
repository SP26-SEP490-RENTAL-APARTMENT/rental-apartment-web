export const REVENUE = {
  dimensions: [{ field: "date", alias: "date" }],
  metrics: [{ field: "total_revenue", aggregation: "sum", alias: "revenue" }],
};

// export const BOOKING_STATUS = {
//   dimensions: [{ field: "status", alias: "status" }],
//   metrics: [{ field: "booking_count", aggregation: "count", alias: "count" }],
// };

export const GENERAL = {
  dimensions: [
    {
      field: "tenant_id",
      alias: "user_id",
    },
  ],
  metrics: [
    {
      field: "total_revenue",
      aggregation: "sum",
      alias: "total_revenue",
    },
    {
      field: "booking_count",
      aggregation: "count",
      alias: "total_booking",
    },
    {
      field: "unique_tenant_count",
      aggregation: "distinct_count",
      alias: "total_user",
    },
  ],
};

export const BOOKING = {
  dimensions: [{ field: "date", alias: "date" }],
  metrics: [
    { field: "booking_count", aggregation: "count", alias: "bookings" },
  ],
};
