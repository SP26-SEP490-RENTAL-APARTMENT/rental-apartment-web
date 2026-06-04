import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { applyRangePreset, type RangePreset } from '@/utils/datePresets';
import type {
  ReportDimensionRequestDto,
  ReportMetricRequestDto,
  ReportSchemaDto,
  ReportRunRequestDto,
  ReportResultPageDto,
} from '../types/reports';
import { getSchema, runReport, exportReport } from '../api/landlordReports';
import { apartmentManagementApi } from '@/services/privateApi/landlordApi';
import type { Apartment } from '@/types/apartment';

export interface ReportShellProps {
  reportId: string;
  defaultRequest?: Partial<ReportRunRequestDto>;
  allowedDimensions?: string[];
  allowedMetrics?: string[];
  enableApartmentFilter?: boolean;
  /** Replace individual time dimension toggles with a single WoW/MoM/QoQ/YoY selector */
  useComparisonPeriod?: boolean;
  /** Base name for exported files (no extension). Defaults to a slug derived from reportId. */
  exportFileName?: string;
  onRunResult?: (payload: {
    request: ReportRunRequestDto;
    result: ReportResultPageDto | null;
  }) => void;
  tablePortalId?: string;
  hideGenericKpis?: boolean;
}

type ComparisonPeriod = 'wow' | 'mom' | 'qoq' | 'yoy';

const COMPARISON_PERIOD_OPTIONS: { value: ComparisonPeriod; field: string }[] = [
  { value: 'wow', field: 'week' },
  { value: 'mom', field: 'month' },
  { value: 'qoq', field: 'quarter' },
  { value: 'yoy', field: 'year' },
];

function normalizeDimensions(dimensions?: ReportDimensionRequestDto[]) {
  return (dimensions ?? []).filter((dimension): dimension is ReportDimensionRequestDto => {
    return typeof dimension?.field === 'string' && dimension.field.trim().length > 0;
  });
}

function normalizeMetrics(metrics?: ReportMetricRequestDto[]) {
  return (metrics ?? []).filter((metric): metric is ReportMetricRequestDto => {
    return typeof metric?.field === 'string' && metric.field.trim().length > 0;
  });
}

export const ReportShell: React.FC<ReportShellProps> = ({ reportId, defaultRequest, allowedDimensions: propsAllowedDimensions, allowedMetrics: propsAllowedMetrics, enableApartmentFilter = false, useComparisonPeriod = false, exportFileName, onRunResult, tablePortalId, hideGenericKpis = false }) => {
  const { t } = useTranslation('reports');
  const [schema, setSchema] = useState<ReportSchemaDto | null>(null);
  const [request, setRequest] = useState<ReportRunRequestDto>({
    from: undefined,
    to: undefined,
    dimensions: [],
    metrics: [],
    page: 1,
    pageSize: 100,
    ...defaultRequest,
  });

  const [result, setResult] = useState<ReportResultPageDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [rangePreset, setRangePreset] = useState<RangePreset>('last_30_days');
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>('mom');
  const [tablePortalTarget, setTablePortalTarget] = useState<HTMLElement | null>(null);
  const [apartmentOptions, setApartmentOptions] = useState<Array<Pick<Apartment, 'apartmentId' | 'title'>>>([]);
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>('');

  // filter control state
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    'Pending',
    'Confirmed',
    'Completed',
    'Cancelled',
  ]);
  // (Apartment/City/Nationality selects removed - landlord must add those as dimensions to search)

  useEffect(() => {
    let mounted = true;
    getSchema(reportId).then(s => mounted && setSchema(s)).catch(() => {});
    return () => { mounted = false; };
  }, [reportId]);

  useEffect(() => {
    setRequest({
      from: defaultRequest?.from,
      to: defaultRequest?.to,
      searchTerm: defaultRequest?.searchTerm,
      dimensions: normalizeDimensions(defaultRequest?.dimensions),
      metrics: normalizeMetrics(defaultRequest?.metrics),
      filters: defaultRequest?.filters,
      page: defaultRequest?.page ?? 1,
      pageSize: defaultRequest?.pageSize ?? 100,
    });
  }, [defaultRequest, reportId]);

  useEffect(() => {
    if (!enableApartmentFilter) {
      setApartmentOptions([]);
      setSelectedApartmentId('');
      return;
    }

    let mounted = true;

    async function loadApartments() {
      try {
        const res = await apartmentManagementApi.getApartments({
          page: 1,
          pageSize: 1000,
          search: '',
          sortBy: 'createdAt',
          sortOrder: 'desc',
          status: '',
        });

        if (!mounted) {
          return;
        }

        const items = (res.data.items ?? []).map((a) => ({
          apartmentId: a.apartmentId,
          title: a.title,
        }));

        setApartmentOptions(items);
      } catch {
        if (mounted) {
          setApartmentOptions([]);
        }
      }
    }

    void loadApartments();

    return () => {
      mounted = false;
    };
  }, [enableApartmentFilter]);

  function handleRangePreset(preset: RangePreset) {
    const { from, to } = applyRangePreset(preset);
    setRangePreset(preset);
    setRequest(r => ({ ...r, from, to, page: 1 }));
  }

  function setFrom(date?: string) {
    setRequest(r => ({ ...r, from: date }));
  }

  function setTo(date?: string) {
    setRequest(r => ({ ...r, to: date }));
  }

  function setSearchTerm(value?: string) {
    setRequest(r => ({ ...r, searchTerm: value }));
  }

  function toggleDimension(field: string) {
    setRequest(r => {
      const exists = (r.dimensions ?? []).some(d => d.field === field);
      const dims = exists ? (r.dimensions ?? []).filter(d => d.field !== field) : [...(r.dimensions ?? []), { field, alias: field }];
      return { ...r, dimensions: dims };
    });
  }

  function toggleMetric(field: string) {
    setRequest(r => {
      const exists = (r.metrics ?? []).some(m => m.field === field);
      if (exists) {
        const metrics = (r.metrics ?? []).filter(m => m.field !== field);
        return { ...r, metrics };
      }

      const countOnlyFields = ['booking_count', 'paid_booking_count', 'confirmed_booking_count', 'completed_booking_count', 'cancelled_booking_count', 'unique_tenant_count', 'unique_apartment_count', 'unique_paid_tenant_count', 'peak_occupancy_days', 'low_occupancy_days', 'total_booked_nights', 'total_available_nights'];
      const defaultAgg = countOnlyFields.includes(field) ? 'count' : (schema?.aggregations?.[0] ?? 'sum');
      const metrics = [...(r.metrics ?? []), { field, alias: field, aggregation: defaultAgg }];
      return { ...r, metrics };
    });
  }

  function periodEndDate(startStr: string, period: ComparisonPeriod): string {
    const start = new Date(startStr);
    if (isNaN(start.getTime())) return startStr;
    let end: Date;
    if (period === 'wow') {
      end = new Date(start);
      end.setDate(end.getDate() + 6);
    } else if (period === 'mom') {
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    } else if (period === 'qoq') {
      end = new Date(start.getFullYear(), start.getMonth() + 3, 0);
    } else {
      end = new Date(start.getFullYear(), 11, 31);
    }
    return end.toISOString().slice(0, 10);
  }

  function formatDimensionValue(value: unknown, columnKey?: string) {
    if (value == null) {
      return '';
    }

    const text = String(value);
    const dateStr = /^\d{4}-\d{2}-\d{2}T/.test(text) ? text.split('T')[0] : (/^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null);

    if (dateStr && useComparisonPeriod && columnKey) {
      const activeField = COMPARISON_PERIOD_OPTIONS.find(o => o.value === comparisonPeriod)?.field;
      if (activeField && columnKey === activeField) {
        return `${dateStr} – ${periodEndDate(dateStr, comparisonPeriod)}`;
      }
    }

    if (dateStr) return dateStr;

    return text;
  }

  function formatMetricValue(metricField: string, value: unknown) {
    if (value == null || value === '') {
      return '';
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return String(value);
    }

    if (metricField === 'total_revenue' || metricField === 'avg_booking_value' || metricField === 'net_revenue' || metricField === 'deposit_collected' || metricField === 'balance_collected' || metricField === 'refunded_amount' || metricField === 'revenue_per_occupied_night') {
      return numericValue.toLocaleString('vi-VN');
    }

    if (metricField === 'occupancy_percent' || metricField === 'revpar' || metricField === 'five_star_review_percent' || metricField === 'one_star_review_percent' || metricField === 'response_rate') {
      return `${numericValue.toFixed(1)}%`;
    }

    return Number.isInteger(numericValue) ? numericValue.toString() : numericValue.toLocaleString('vi-VN');
  }

  async function handleRun() {
    setLoading(true);
    const runRequest = buildRunRequest();
    try {
      const res = await runReport(reportId, runRequest as any);
      setResult(res as ReportResultPageDto);
      onRunResult?.({ request: runRequest, result: res as ReportResultPageDto });
      // no select options needed; search and filtering depend on chosen dimensions
    } catch (e) {
      console.error(e);
      setResult(null);
      onRunResult?.({ request: runRequest, result: null });
    } finally {
      setLoading(false);
    }
  }

  function timeFieldForPreset(preset: RangePreset) {
    if (preset.includes('week')) {
      return 'week';
    }

    if (preset.includes('month')) {
      return 'month';
    }

    if (preset.includes('year')) {
      return 'year';
    }

    return 'date';
  }

  function buildRunRequest(): ReportRunRequestDto {
    // assemble filters from selected controls
    const filters: any[] = [];
    if (selectedStatuses.length > 0) {
      filters.push({ target: 'dimension', field: 'status', operator: 'in', values: selectedStatuses });
    }
    if (enableApartmentFilter && selectedApartmentId) {
      filters.push({ target: 'dimension', field: 'apartment_id', operator: 'eq', value: selectedApartmentId });
    }

    // ensure time dimension is present and first
    const timeField = useComparisonPeriod
      ? COMPARISON_PERIOD_OPTIONS.find(o => o.value === comparisonPeriod)!.field
      : timeFieldForPreset(rangePreset);
    const dims = normalizeDimensions(request.dimensions).filter(d => !['date','week','month','quarter','year'].includes(d.field));
    if (timeField) dims.unshift({ field: timeField, alias: timeField });

    // ensure any filter target dimensions are included in dimensions list
    filters.forEach(f => {
      if (!f || !f.field) return;
      const target = (f.target ?? 'dimension').toLowerCase();
      if (target !== 'dimension') return;
      const exists = dims.some(d => (d.field ?? '').toLowerCase() === (f.field ?? '').toLowerCase());
      if (!exists) dims.push({ field: f.field, alias: f.field });
    });

    const metrics = normalizeMetrics(request.metrics);

    const runRequest: ReportRunRequestDto = {
      ...request,
      dimensions: dims,
      metrics,
      filters: filters.length > 0 ? filters : undefined,
    };

    // strip undefined filters/search values for cleanliness
    if (!runRequest.searchTerm) delete (runRequest as any).searchTerm;
    return runRequest;
  }

  function buildExportFileName(ext: string) {
    const base = exportFileName ?? 'report';
    const from = request.from ?? '';
    const to = request.to ?? '';
    const datePart = from && to ? `_${from}_${to}` : from ? `_${from}` : '';
    return `${base}${datePart}.${ext}`;
  }

  async function handleExport() {
    try {
      const blob = await exportReport(reportId, { format: 'csv', runRequest: buildRunRequest() as any });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = buildExportFileName('csv');
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    }
  }

  async function handleExportXlsx() {
    try {
      const blob = await exportReport(reportId, { format: 'xlsx', runRequest: buildRunRequest() as any });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = buildExportFileName('xlsx');
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    }
  }

  useEffect(() => {
    if (tablePortalId && typeof document !== 'undefined') {
      setTablePortalTarget(document.getElementById(tablePortalId));
    }
  }, [tablePortalId]);

  // Always hold a ref to the latest buildRunRequest so the debounce effect never uses a stale closure
  const buildRunRequestRef = useRef(buildRunRequest);
  buildRunRequestRef.current = buildRunRequest;

  // Reactive fetch: whenever filters/controls change, refetch after debounce
  const metricsKey = JSON.stringify(request.metrics);
  useEffect(() => {
    const id = setTimeout(() => {
      void (async () => {
        setLoading(true);
        const runRequest = buildRunRequestRef.current();
        try {
          const res = await runReport(reportId, runRequest as any);
          setResult(res as ReportResultPageDto);
          onRunResult?.({ request: runRequest, result: res as ReportResultPageDto });
        } catch (e) {
          console.error(e);
          setResult(null);
          onRunResult?.({ request: runRequest, result: null });
        } finally {
          setLoading(false);
        }
      })();
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request.from, request.to, request.page, request.pageSize, metricsKey, rangePreset, comparisonPeriod, JSON.stringify(selectedStatuses), selectedApartmentId, request.searchTerm]);

  const statusOptions = ['Pending', 'Confirmed', 'Completed', 'Cancelled'] as const;

  const tm = result?.totalMetrics;
  const totalBookings = tm != null && ('total_bookings' in tm || 'booking_count' in tm)
    ? Math.round(Number(tm.total_bookings ?? tm.booking_count))
    : null;
  const totalRevenue = tm != null && ('total_revenue_vnd' in tm || 'total_revenue' in tm)
    ? Number(tm.total_revenue_vnd ?? tm.total_revenue)
    : null;
  const averageRevenue = tm != null && ('avg_revenue_per_booking' in tm || 'avg_booking_value' in tm)
    ? Number(tm.avg_revenue_per_booking ?? tm.avg_booking_value)
    : null;
  const occupancyRate = tm != null && ('occupancy_rate_percent' in tm || 'occupancy_percent' in tm)
    ? Number(tm.occupancy_rate_percent ?? tm.occupancy_percent)
    : null;

  const formatCurrencyVnd = (value: number) => `${Math.round(value).toLocaleString('vi-VN')} VND`;

  const isFinancialMetric = (metricField: string) => /revenue|amount|adr|value|deposit|balance|refund/i.test(metricField);

  const statusBadgeClass = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes('cancel')) return 'bg-rose-100 text-rose-700';
    if (normalized.includes('pending')) return 'bg-amber-100 text-amber-700';
    if (normalized.includes('confirm')) return 'bg-emerald-100 text-emerald-700';
    if (normalized.includes('complete')) return 'bg-indigo-100 text-indigo-700';
    return 'bg-slate-100 text-slate-700';
  };

  const tableArea = result ? (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="mb-3 text-sm text-slate-600">
        {t('shell.totalRows')}: <span className="font-semibold text-slate-900">{result.totalCount ?? result.rows.length}</span>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[1200px] whitespace-nowrap text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wider uppercase whitespace-nowrap">#</th>
              {result.rows.length > 0 && Object.keys(result.rows[0].dimensions).map(k => (
                <th key={k} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wider uppercase whitespace-nowrap">{t(`shell.dimensionLabels.${k}`, { defaultValue: k })}</th>
              ))}
              {result.rows.length > 0 && Object.keys(result.rows[0].metrics).map(k => (
                <th key={k} className="px-4 py-3 text-right text-xs font-semibold text-slate-500 tracking-wider uppercase whitespace-nowrap">{t(`shell.metricLabels.${k}`, { defaultValue: k })}</th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {result.rows.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-4 py-3 whitespace-nowrap text-left">{idx + 1}</td>
                {Object.keys(r.dimensions).map(k => {
                  const value = formatDimensionValue(r.dimensions[k], k);
                  const isStatus = /status|state/i.test(k);
                  const statusKey = String(value)
                    .toLowerCase()
                    .split(/[_\s-]+/)
                    .filter(Boolean)
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join('');
                  const displayValue = isStatus
                    ? t(`shell.statuses.${statusKey}`, { defaultValue: String(value) })
                    : value;
                  return (
                    <td key={k} className="px-4 py-3 whitespace-nowrap text-left">
                      {isStatus ? (
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(String(value))}`}>
                          {displayValue}
                        </span>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}

                {Object.keys(r.metrics).map(k => (
                  <td
                    key={k}
                    className={`px-4 py-3 whitespace-nowrap ${isFinancialMetric(k) ? 'text-right' : 'text-right'}`}
                  >
                    {formatMetricValue(k, r.metrics[k])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="bg-white rounded-xl border border-slate-200 p-6 text-sm text-slate-600">
      {t('shell.noResults')}
    </div>
  );

  const renderedTableSection = tablePortalTarget ? createPortal(tableArea, tablePortalTarget) : tableArea;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{t('workspace.title')}</h3>

      {!hideGenericKpis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500 font-medium">{t('shell.kpi.totalBookings')}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalBookings != null ? totalBookings.toLocaleString('vi-VN') : '—'}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500 font-medium">{t('shell.kpi.totalRevenue')}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalRevenue != null ? formatCurrencyVnd(totalRevenue) : '—'}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500 font-medium">{t('shell.kpi.avgRevenue')}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{averageRevenue != null ? formatCurrencyVnd(averageRevenue) : '—'}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500 font-medium">{t('shell.kpi.occupancyRate')}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{occupancyRate != null ? `${occupancyRate.toFixed(1)}%` : '—'}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">{t('shell.period')}</label>
            <select
              value={rangePreset}
              onChange={e => handleRangePreset(e.target.value as RangePreset)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="last_30_days">{t('shell.presets.last_30_days')}</option>
              <option value="this_day">{t('shell.presets.this_day')}</option>
              <option value="last_day">{t('shell.presets.last_day')}</option>
              <option value="this_week">{t('shell.presets.this_week')}</option>
              <option value="last_week">{t('shell.presets.last_week')}</option>
              <option value="this_month">{t('shell.presets.this_month')}</option>
              <option value="last_month">{t('shell.presets.last_month')}</option>
              <option value="this_year">{t('shell.presets.this_year')}</option>
              <option value="last_year">{t('shell.presets.last_year')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">{t('shell.from')}</label>
            <input
              type="date"
              value={request.from ?? ''}
              onChange={e => setFrom(e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">{t('shell.to')}</label>
            <input
              type="date"
              value={request.to ?? ''}
              onChange={e => setTo(e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-600">{t('shell.search')}</label>
            <input
              type="text"
              value={request.searchTerm ?? ''}
              onChange={e => setSearchTerm(e.target.value || undefined)}
              placeholder={t('shell.searchPlaceholder')}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">{t('shell.status')}</label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => {
              const active = selectedStatuses.includes(status);
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatuses(prev => prev.includes(status) ? prev.filter(x => x !== status) : [...prev, status])}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${active ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  {t(`shell.statuses.${status}`)}
                </button>
              );
            })}
          </div>
        </div>

        {enableApartmentFilter && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">{t('shell.apartment')}</label>
            <select
              value={selectedApartmentId}
              onChange={e => setSelectedApartmentId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="">{t('shell.allApartments')}</option>
              {apartmentOptions.map((apartment) => (
                <option key={apartment.apartmentId} value={apartment.apartmentId}>
                  {apartment.title || apartment.apartmentId}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">
              {useComparisonPeriod ? t('shell.comparisonPeriod') : t('shell.dimensions')}
            </p>
            {useComparisonPeriod && (
              <div className="flex flex-wrap gap-2">
                {COMPARISON_PERIOD_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setComparisonPeriod(opt.value)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${comparisonPeriod === opt.value ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {t(`shell.comparison.${opt.value}`)}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {schema?.dimensions
                .filter(d => !propsAllowedDimensions || propsAllowedDimensions.includes(d))
                .map(d => {
                  const active = (request.dimensions ?? []).some(x => x.field === d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDimension(d)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${active ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                    >
                      {t(`shell.dimensionLabels.${d}`, { defaultValue: d })}
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">{t('shell.metrics')}</p>
            <div className="flex flex-wrap gap-2">
              {schema?.metricFields
                .filter(m => !propsAllowedMetrics || propsAllowedMetrics.includes(m))
                .map(m => {
                  const active = (request.metrics ?? []).some(x => x.field === m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMetric(m)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${active ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                    >
                      {t(`shell.metricLabels.${m}`, { defaultValue: m })}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">{t('shell.pageSize')}</label>
            <input
              type="number"
              value={request.pageSize ?? 100}
              onChange={e => setRequest(r => ({ ...r, pageSize: Number(e.target.value) }))}
              className="w-28 rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={handleRun}
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t('shell.running') : t('shell.run')}
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('shell.exportCsv')}
          </button>

          <button
            type="button"
            onClick={handleExportXlsx}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('shell.exportXlsx')}
          </button>
        </div>
      </div>

      {renderedTableSection}

    </div>
  );
};

export default ReportShell;
