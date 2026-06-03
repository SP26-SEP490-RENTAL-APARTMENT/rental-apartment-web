import { createReportBlueprint } from './createReportBlueprint';

const OccupancyReportBlueprint = createReportBlueprint({
  blueprintKey: 'occupancy',
  title: 'Occupancy Report',
  description: 'Occupancy rate, booked/available nights, ALOS, peak/low days, and revenue per occupied night.',
  defaultDimensions: [
    { field: 'date', alias: 'date' },
    { field: 'apartment_name', alias: 'apartment_name' },
  ],
  defaultMetrics: [
    { field: 'occupancy_percent', aggregation: 'avg', alias: 'occupancy_percent' },
    { field: 'total_booked_nights', aggregation: 'sum', alias: 'total_booked_nights' },
    { field: 'total_available_nights', aggregation: 'sum', alias: 'total_available_nights' },
    { field: 'avg_length_of_stay', aggregation: 'avg', alias: 'avg_length_of_stay' },
    { field: 'peak_occupancy_days', aggregation: 'count', alias: 'peak_occupancy_days' },
    { field: 'low_occupancy_days', aggregation: 'count', alias: 'low_occupancy_days' },
    { field: 'revenue_per_occupied_night', aggregation: 'avg', alias: 'revenue_per_occupied_night' },
  ],
  allowedDimensions: ['apartment_name', 'city', 'day_of_week', 'holiday_period'],
  allowedMetrics: ['occupancy_percent', 'total_booked_nights', 'total_available_nights', 'avg_length_of_stay', 'peak_occupancy_days', 'low_occupancy_days', 'revenue_per_occupied_night'],
  pageSize: 50,
  enableApartmentFilter: true,
  useComparisonPeriod: true,
  hideGenericKpis: true,
});

export default OccupancyReportBlueprint;
