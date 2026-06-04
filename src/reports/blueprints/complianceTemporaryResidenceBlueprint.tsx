import { createReportBlueprint } from './createReportBlueprint';

const ComplianceTemporaryResidenceBlueprint = createReportBlueprint({
  title: 'Compliance Temporary Residence',
  description: 'Temporary residence compliance export for host/admin review.',
  defaultDimensions: [
    { field: 'date', alias: 'date' },
    { field: 'tenant_name', alias: 'tenant_name' },
    { field: 'apartment_name', alias: 'apartment_name' },
  ],
  defaultMetrics: [
    { field: 'booking_count', aggregation: 'count', alias: 'booking_count' },
  ],
  pageSize: 50,
  blueprintKey: ''
});

export default ComplianceTemporaryResidenceBlueprint;
