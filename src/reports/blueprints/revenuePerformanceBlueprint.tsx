import { createReportBlueprint } from './createReportBlueprint';

const RevenuePerformanceBlueprint = createReportBlueprint({
  title: 'Revenue Performance',
  description: 'Revenue, average booking value, and sold price trend.',
  defaultDimensions: [
    { field: 'date', alias: 'date' },
    { field: 'status', alias: 'status' },
  ],
  defaultMetrics: [
    { field: 'total_revenue', aggregation: 'sum', alias: 'total_revenue' },
    { field: 'avg_booking_value', aggregation: 'avg', alias: 'avg_booking_value' },
    { field: 'avg_sold_price', aggregation: 'avg', alias: 'avg_sold_price' },
    { field: 'avg_price_delta', aggregation: 'avg', alias: 'avg_price_delta' },
  ],
  pageSize: 50,
  blueprintKey: ''
});

export default RevenuePerformanceBlueprint;
