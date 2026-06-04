import { createReportBlueprint } from './createReportBlueprint';

const SubscriptionPerformanceBlueprint = createReportBlueprint({
  title: 'Subscription Performance',
  description: 'Subscription revenue, active counts, and churn monitoring.',
  defaultDimensions: [
    { field: 'date', alias: 'date' },
  ],
  defaultMetrics: [
    { field: 'subscription_active_count', aggregation: 'count', alias: 'subscription_active_count' },
    { field: 'subscription_revenue', aggregation: 'sum', alias: 'subscription_revenue' },
    { field: 'subscription_churn_count', aggregation: 'count', alias: 'subscription_churn_count' },
    { field: 'subscription_churn_rate', aggregation: 'avg', alias: 'subscription_churn_rate' },
  ],
  pageSize: 50,
  blueprintKey: ''
});

export default SubscriptionPerformanceBlueprint;
