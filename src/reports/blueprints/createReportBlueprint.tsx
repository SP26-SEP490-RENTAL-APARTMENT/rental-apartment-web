import React from 'react';
import type { ReportDimensionRequestDto, ReportMetricRequestDto, ReportResultPageDto, ReportRunRequestDto } from '../../types/reports';
import ReportShell from '../ReportShell';

export interface ReportBlueprintProps {
  reportId: string;
  defaultRequest?: Partial<ReportRunRequestDto>;
  onRunResult?: (payload: {
    request: ReportRunRequestDto;
    result: ReportResultPageDto | null;
  }) => void;
  tablePortalId?: string;
}

export interface ReportBlueprintOptions {
  title: string;
  description: string;
  defaultDimensions: ReportDimensionRequestDto[];
  defaultMetrics: ReportMetricRequestDto[];
  pageSize?: number;
  allowedDimensions?: string[];
  allowedMetrics?: string[];
}

export function createReportBlueprint(options: ReportBlueprintOptions) {
  const Blueprint: React.FC<ReportBlueprintProps> = ({ reportId, defaultRequest, onRunResult, tablePortalId }) => {
    const mergedRequest: Partial<ReportRunRequestDto> = {
      ...defaultRequest,
      dimensions: defaultRequest?.dimensions ?? options.defaultDimensions,
      metrics: defaultRequest?.metrics ?? options.defaultMetrics,
      pageSize: defaultRequest?.pageSize ?? options.pageSize ?? 50,
    };

    return (
      <section style={{ display: 'grid', gap: 12 }}>
        <header style={{ padding: '8px 0' }}>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: 12, color: '#6b7280' }}>
            Landlord report
          </p>
          <h2 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 700 }}>{options.title}</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280' }}>{options.description}</p>
        </header>

        <ReportShell
          reportId={reportId}
          defaultRequest={mergedRequest}
          allowedDimensions={options.allowedDimensions}
          allowedMetrics={options.allowedMetrics}
          onRunResult={onRunResult}
          tablePortalId={tablePortalId}
        />
      </section>
    );
  };

  Blueprint.displayName = `${options.title.replace(/\s+/g, '')}Blueprint`;
  return Blueprint;
}
