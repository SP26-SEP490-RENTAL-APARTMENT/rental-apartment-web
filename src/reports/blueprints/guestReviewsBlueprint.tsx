import { createReportBlueprint } from './createReportBlueprint';

const GuestReviewsBlueprint = createReportBlueprint({
  title: 'Guest Feedback / Reviews Report',
  description: 'Review metrics including ratings, response rates, and sentiment analysis.',
  defaultDimensions: [
    { field: 'month', alias: 'month' },
    { field: 'apartment_name', alias: 'apartment_name' },
  ],
  defaultMetrics: [
    { field: 'review_avg_rating', aggregation: 'avg', alias: 'average_rating' },
    { field: 'review_count', aggregation: 'count', alias: 'total_reviews' },
    { field: 'response_rate', aggregation: 'avg', alias: 'response_rate' },
    { field: 'five_star_review_percent', aggregation: 'avg', alias: 'five_star_reviews_percent' },
    { field: 'one_star_review_percent', aggregation: 'avg', alias: 'one_star_reviews_percent' },
  ],
  allowedDimensions: ['month', 'quarter', 'apartment_name', 'guest_nationality'],
  allowedMetrics: ['review_avg_rating', 'review_count', 'response_rate', 'five_star_review_percent', 'one_star_review_percent'],
  pageSize: 50,
  enableApartmentFilter: true,
});

export default GuestReviewsBlueprint;
