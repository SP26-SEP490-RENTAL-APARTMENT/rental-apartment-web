import { createReportBlueprint } from './createReportBlueprint';

const GuestReviewsBlueprint = createReportBlueprint({
  title: 'Guest Reviews Analysis',
  description: 'Review count and rating averages for listing quality monitoring.',
  defaultDimensions: [
    { field: 'apartment_name', alias: 'apartment_name' },
  ],
  defaultMetrics: [
    { field: 'review_count', aggregation: 'count', alias: 'review_count' },
    { field: 'review_avg_rating', aggregation: 'avg', alias: 'review_avg_rating' },
  ],
  pageSize: 50,
});

export default GuestReviewsBlueprint;
