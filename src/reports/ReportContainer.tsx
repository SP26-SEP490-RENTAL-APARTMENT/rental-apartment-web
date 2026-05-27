import React, { useEffect, useState } from 'react';
import type { ReportSchemaDto, ReportRunRequestDto, ReportResultPageDto, ReportDimensionRequestDto, ReportMetricRequestDto } from '../types/reports';
import { getSchema, runReport } from '../api/landlordReports';

export interface ReportContainerProps {
  reportId: string;
  blueprint?: {
    defaultDimensions?: ReportDimensionRequestDto[];
    defaultMetrics?: ReportMetricRequestDto[];
    title?: string;
  };
}

export const ReportContainer: React.FC<ReportContainerProps> = ({ reportId, blueprint }) => {
  const [schema, setSchema] = useState<ReportSchemaDto | null>(null);
  const [request, setRequest] = useState<ReportRunRequestDto>({
    page: 1,
    pageSize: 100,
    dimensions: blueprint?.defaultDimensions ?? [{ field: 'date', alias: 'date' }],
    metrics: blueprint?.defaultMetrics ?? [{ field: 'booking_count', aggregation: 'count', alias: 'booking_count' }]
  });

  const [result, setResult] = useState<ReportResultPageDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    getSchema(reportId).then(s => mounted && setSchema(s)).catch(() => {});
    return () => { mounted = false; };
  }, [reportId]);

  async function handleRun() {
    setLoading(true);
    try {
      const res = await runReport(reportId, request as any);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>{blueprint?.title ?? 'Report'}</h2>

      <div style={{ marginBottom: 8 }}>
        <label>Page size: </label>
        <input type="number" value={request.pageSize} onChange={e => setRequest({ ...request, pageSize: Number(e.target.value) })} />
        <button onClick={handleRun} disabled={loading} style={{ marginLeft: 8 }}>{loading ? 'Running…' : 'Run report'}</button>
        {schema && <span style={{ marginLeft: 12, color: '#666' }}>{schema.dimensions.length} dims • {schema.metricFields.length} metrics</span>}
      </div>

      <div>
        {result ? (
          <div>
            <div style={{ marginBottom: 8 }}>Total: {result.totalCount ?? result.rows.length}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {result.rows.length > 0 && Object.keys(result.rows[0].dimensions).map(k => (
                    <th key={k} style={{ border: '1px solid #ddd', padding: 8 }}>dim_{k}</th>
                  ))}
                  {result.rows.length > 0 && Object.keys(result.rows[0].metrics).map(k => (
                    <th key={k} style={{ border: '1px solid #ddd', padding: 8 }}>metric_{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r, idx) => (
                  <tr key={idx}>
                    {Object.keys(r.dimensions).map(k => <td key={k} style={{ border: '1px solid #eee', padding: 8 }}>{String(r.dimensions[k] ?? '')}</td>)}
                    {Object.keys(r.metrics).map(k => <td key={k} style={{ border: '1px solid #eee', padding: 8 }}>{r.metrics[k]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No results. Run the report to see rows.</div>
        )}
      </div>
    </div>
  );
};

export default ReportContainer;
