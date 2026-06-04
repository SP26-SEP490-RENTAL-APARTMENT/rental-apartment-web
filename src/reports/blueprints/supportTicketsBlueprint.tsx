import { createReportBlueprint } from './createReportBlueprint';

const SupportTicketsBlueprint = createReportBlueprint({
  title: 'Support Tickets Report',
  description: 'Support ticket volume and service resolution overview.',
  defaultDimensions: [
    { field: 'date', alias: 'date' },
  ],
  defaultMetrics: [
    { field: 'booking_count', aggregation: 'count', alias: 'booking_count' },
  ],
  pageSize: 50,
  blueprintKey: ''
});

export default SupportTicketsBlueprint;
