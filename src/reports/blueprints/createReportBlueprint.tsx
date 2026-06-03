import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  /** i18n key under blueprints.* in the reports namespace */
  blueprintKey: string;
  /** Fallback title if translation is missing */
  title: string;
  /** Fallback description if translation is missing */
  description: string;
  defaultDimensions: ReportDimensionRequestDto[];
  defaultMetrics: ReportMetricRequestDto[];
  pageSize?: number;
  allowedDimensions?: string[];
  allowedMetrics?: string[];
  enableApartmentFilter?: boolean;
  useComparisonPeriod?: boolean;
  hideGenericKpis?: boolean;
}

export function createReportBlueprint(options: ReportBlueprintOptions) {
  const Blueprint: React.FC<ReportBlueprintProps> = ({ reportId, defaultRequest, onRunResult, tablePortalId }) => {
    const { t } = useTranslation('reports');
    const mergedRequest = useMemo<Partial<ReportRunRequestDto>>(() => ({
      ...defaultRequest,
      dimensions: defaultRequest?.dimensions ?? options.defaultDimensions,
      metrics: defaultRequest?.metrics ?? options.defaultMetrics,
      pageSize: defaultRequest?.pageSize ?? options.pageSize ?? 50,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [JSON.stringify(defaultRequest)]);

    const label = t(`blueprints.${options.blueprintKey}.label`, { defaultValue: 'Landlord report' });
    const title = t(`blueprints.${options.blueprintKey}.title`, { defaultValue: options.title });
    const description = t(`blueprints.${options.blueprintKey}.description`, { defaultValue: options.description });

    return (
      <section style={{ display: 'grid', gap: 12 }}>
        <header style={{ padding: '8px 0' }}>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: 12, color: '#6b7280' }}>
            {label}
          </p>
          <h2 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 700 }}>{title}</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280' }}>{description}</p>
        </header>

        <ReportShell
          reportId={reportId}
          defaultRequest={mergedRequest}
          allowedDimensions={options.allowedDimensions}
          allowedMetrics={options.allowedMetrics}
          enableApartmentFilter={options.enableApartmentFilter}
          useComparisonPeriod={options.useComparisonPeriod}
          hideGenericKpis={options.hideGenericKpis}
          exportFileName={title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}
          onRunResult={onRunResult}
          tablePortalId={tablePortalId}
        />
      </section>
    );
  };

  Blueprint.displayName = `${options.title.replace(/\s+/g, '')}Blueprint`;
  return Blueprint;
}
