import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type {
  ReportSchemaDto,
  ReportRunRequestDto,
  ReportResultPageDto,
} from '../types/reports';
import { getSchema, runReport, exportReport } from '../api/landlordReports';

export interface ReportShellProps {
  reportId: string;
  defaultRequest?: Partial<ReportRunRequestDto>;
  allowedDimensions?: string[];
  allowedMetrics?: string[];
  onRunResult?: (payload: {
    request: ReportRunRequestDto;
    result: ReportResultPageDto | null;
  }) => void;
  tablePortalId?: string;
}

type RangePreset = 'last_30_days' | 'this_day' | 'last_day' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_year' | 'last_year';

export const ReportShell: React.FC<ReportShellProps> = ({ reportId, defaultRequest, allowedDimensions: propsAllowedDimensions, allowedMetrics: propsAllowedMetrics, onRunResult, tablePortalId }) => {
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
  const [tablePortalTarget, setTablePortalTarget] = useState<HTMLElement | null>(null);

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

  function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function endOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  }

  function startOfWeek(date: Date) {
    const d = startOfDay(date);
    const day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
    return d;
  }

  function endOfWeek(date: Date) {
    const d = startOfWeek(date);
    d.setDate(d.getDate() + 6);
    return endOfDay(d);
  }

  function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function endOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  function startOfYear(date: Date) {
    return new Date(date.getFullYear(), 0, 1);
  }

  function endOfYear(date: Date) {
    return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
  }

  function formatDateInput(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  function applyRangePreset(preset: RangePreset) {
    const now = new Date();
    let fromDate = startOfDay(now);
    let toDate = endOfDay(now);

    switch (preset) {
      case 'this_day':
        fromDate = startOfDay(now);
        toDate = endOfDay(now);
        break;
      case 'last_day': {
        const prev = new Date(now);
        prev.setDate(prev.getDate() - 1);
        fromDate = startOfDay(prev);
        toDate = endOfDay(prev);
        break;
      }
      case 'this_week':
        fromDate = startOfWeek(now);
        toDate = endOfDay(now);
        break;
      case 'last_week': {
        const prev = new Date(now);
        prev.setDate(prev.getDate() - 7);
        fromDate = startOfWeek(prev);
        toDate = endOfWeek(prev);
        break;
      }
      case 'this_month':
        fromDate = startOfMonth(now);
        toDate = endOfDay(now);
        break;
      case 'last_month': {
        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        fromDate = startOfMonth(prev);
        toDate = endOfMonth(prev);
        break;
      }
      case 'this_year':
        fromDate = startOfYear(now);
        toDate = endOfDay(now);
        break;
      case 'last_year': {
        const prev = new Date(now.getFullYear() - 1, 0, 1);
        fromDate = startOfYear(prev);
        toDate = endOfYear(prev);
        break;
      }
      case 'last_30_days':
      default: {
        const prev = new Date(now);
        prev.setDate(prev.getDate() - 29);
        fromDate = startOfDay(prev);
        toDate = endOfDay(now);
        break;
      }
    }

    setRangePreset(preset);
    setRequest(r => ({
      ...r,
      from: formatDateInput(fromDate),
      to: formatDateInput(toDate),
      page: 1,
    }));
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

      const defaultAgg = schema?.aggregations?.[0] ?? 'sum';
      const metrics = [...(r.metrics ?? []), { field, alias: field, aggregation: defaultAgg }];
      return { ...r, metrics };
    });
  }

  function formatDimensionValue(value: unknown) {
    if (value == null) {
      return '';
    }

    const text = String(value);
    // Keep report tables readable by collapsing ISO datetime values to date-only.
    if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
      return text.split('T')[0];
    }

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

    if (metricField === 'total_revenue' || metricField === 'avg_booking_value' || metricField === 'net_revenue' || metricField === 'deposit_collected' || metricField === 'balance_collected' || metricField === 'refunded_amount') {
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

    // ensure time dimension is present and first
    const timeField = timeFieldForPreset(rangePreset);
    const dims = (request.dimensions ?? []).filter(d => !['date','week','month','quarter','year'].includes(d.field));
    if (timeField) dims.unshift({ field: timeField, alias: timeField });

    // ensure any filter target dimensions are included in dimensions list
    filters.forEach(f => {
      if (!f || !f.field) return;
      const target = (f.target ?? 'dimension').toLowerCase();
      if (target !== 'dimension') return;
      const exists = dims.some(d => (d.field ?? '').toLowerCase() === (f.field ?? '').toLowerCase());
      if (!exists) dims.push({ field: f.field, alias: f.field });
    });

    const runRequest: ReportRunRequestDto = {
      ...request,
      dimensions: dims,
      filters: filters.length > 0 ? filters : undefined,
    };

    // strip undefined filters/search values for cleanliness
    if (!runRequest.searchTerm) delete (runRequest as any).searchTerm;
    return runRequest;
  }

  async function handleExport() {
    try {
      const blob = await exportReport(reportId, { format: 'csv', runRequest: buildRunRequest() as any });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportId || 'report'}.csv`;
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
      a.download = `${reportId || 'report'}.xlsx`;
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

  // Reactive fetch: whenever filters/controls change, refetch after debounce
  useEffect(() => {
    const id = setTimeout(() => {
      handleRun();
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request.from, request.to, request.page, request.pageSize, request.metrics, rangePreset, selectedStatuses, request.searchTerm]);

  const statusOptions = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

  const totalBookings = result
    ? Math.round(result.totalMetrics?.total_bookings ?? result.totalMetrics?.booking_count ?? 0)
    : 0;
  const totalRevenue = result
    ? Number(result.totalMetrics?.total_revenue_vnd ?? result.totalMetrics?.total_revenue ?? 0)
    : 0;
  const averageRevenue = result
    ? Number(result.totalMetrics?.avg_revenue_per_booking ?? result.totalMetrics?.avg_booking_value ?? 0)
    : 0;
  const occupancyRate = result
    ? Number(result.totalMetrics?.occupancy_rate_percent ?? result.totalMetrics?.occupancy_percent ?? 0)
    : 0;

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
        Total rows: <span className="font-semibold text-slate-900">{result.totalCount ?? result.rows.length}</span>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[1200px] whitespace-nowrap text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wider uppercase whitespace-nowrap">#</th>
              {result.rows.length > 0 && Object.keys(result.rows[0].dimensions).map(k => (
                <th key={k} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wider uppercase whitespace-nowrap">{k}</th>
              ))}
              {result.rows.length > 0 && Object.keys(result.rows[0].metrics).map(k => (
                <th key={k} className="px-4 py-3 text-right text-xs font-semibold text-slate-500 tracking-wider uppercase whitespace-nowrap">{k}</th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {result.rows.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-4 py-3 whitespace-nowrap text-left">{idx + 1}</td>
                {Object.keys(r.dimensions).map(k => {
                  const value = formatDimensionValue(r.dimensions[k]);
                  const isStatus = /status|state/i.test(k);
                  return (
                    <td key={k} className="px-4 py-3 whitespace-nowrap text-left">
                      {isStatus ? (
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(String(value))}`}>
                          {value}
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
      No results yet. Run the report.
    </div>
  );

  const renderedTableSection = tablePortalTarget ? createPortal(tableArea, tablePortalTarget) : tableArea;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Report: {reportId}</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Total Bookings</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{result ? totalBookings.toLocaleString('vi-VN') : '—'}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{result ? formatCurrencyVnd(totalRevenue) : '—'}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Avg Revenue per Booking</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{result ? formatCurrencyVnd(averageRevenue) : '—'}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Occupancy Rate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{result ? `${occupancyRate.toFixed(1)}%` : '—'}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Period</label>
            <select
              value={rangePreset}
              onChange={e => applyRangePreset(e.target.value as RangePreset)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="last_30_days">Last 30 days</option>
              <option value="this_day">This day</option>
              <option value="last_day">Last day</option>
              <option value="this_week">This week</option>
              <option value="last_week">Last week</option>
              <option value="this_month">This month</option>
              <option value="last_month">Last month</option>
              <option value="this_year">This year</option>
              <option value="last_year">Last year</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">From</label>
            <input
              type="date"
              value={request.from ?? ''}
              onChange={e => setFrom(e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">To</label>
            <input
              type="date"
              value={request.to ?? ''}
              onChange={e => setTo(e.target.value || undefined)}
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-600">Search</label>
            <input
              type="text"
              value={request.searchTerm ?? ''}
              onChange={e => setSearchTerm(e.target.value || undefined)}
              placeholder="Search report data"
              className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Status</label>
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
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">Dimensions</p>
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
                      {d}
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">Metrics</p>
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
                      {m}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Page size</label>
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
            {loading ? 'Running…' : 'Run'}
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Export CSV
          </button>

          <button
            type="button"
            onClick={handleExportXlsx}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Export XLSX
          </button>
        </div>
      </div>

      {renderedTableSection}

    </div>
  );
};

export default ReportShell;
