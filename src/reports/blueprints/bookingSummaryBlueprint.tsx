import { createReportBlueprint } from './createReportBlueprint';

const BookingSummaryBlueprint = createReportBlueprint({
  blueprintKey: 'booking',
  title: 'Booking Summary',
  description: 'Booking count, revenue, occupancy, and ADR overview.',
  defaultDimensions: [
    { field: 'apartment_name', alias: 'apartment' },
  ],
  defaultMetrics: [
    { field: 'booking_count', aggregation: 'count', alias: 'total_bookings' },
    { field: 'completed_booking_count', aggregation: 'count', alias: 'completed_bookings' },
    { field: 'cancelled_booking_count', aggregation: 'count', alias: 'cancelled_bookings' },
    { field: 'total_revenue', aggregation: 'sum', alias: 'total_revenue_vnd' },
    { field: 'avg_booking_value', aggregation: 'avg', alias: 'avg_revenue_per_booking' },
    { field: 'occupancy_percent', aggregation: 'avg', alias: 'occupancy_rate_percent' },
  ],
  pageSize: 50,
  allowedDimensions: ['status', 'apartment_name', 'city', 'guest_nationality'],
  useComparisonPeriod: true,
  allowedMetrics: ['booking_count', 'completed_booking_count', 'cancelled_booking_count', 'total_revenue', 'avg_booking_value', 'occupancy_percent'],
  enableApartmentFilter: true,
});

export default BookingSummaryBlueprint;
