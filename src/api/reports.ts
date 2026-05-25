import type {
    ApiResponse,
    ReportComparisonResult,
    ReportExportRequest,
    ReportResult,
    ReportRunRequest,
    ReportSchema,
    ReportDefinitionResponse,
    AdminAnalyticsSnapshot,
} from "../types/reports";

const BASE = "/api/reports";

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  if (contentType.includes("application/json")) {
    const parsed = await res.json();
    // unwrap ApiResponse if present
    if (parsed && typeof parsed === "object" && "success" in parsed) {
      const api = parsed as ApiResponse<any>;
      if (!api.success) throw new Error(api.message || "API error");
      return api.data as T;
    }

    return parsed as T;
  }

  // fallback: return raw text
  const text = await res.text();
  return (text as unknown) as T;
}

export async function getCatalog(page = 1, pageSize = 20): Promise<{ items: ReportDefinitionResponse[]; totalCount: number }> {
  const url = `${BASE}/catalog?page=${page}&pageSize=${pageSize}`;
  const data = await fetchJson<{ Items: ReportDefinitionResponse[]; TotalCount: number }>(url);
  return { items: data.Items, totalCount: data.TotalCount };
}

export async function getSchema(reportId: string): Promise<ReportSchema> {
  const url = `${BASE}/${reportId}/schema`;
  return await fetchJson<ReportSchema>(url);
}

export async function getConfig(reportId: string): Promise<{ DimensionsJson?: string | null; MetricsJson?: string | null; FiltersJson?: string | null; TimeRangeJson?: string | null }> {
  const url = `${BASE}/${reportId}/config`;
  return await fetchJson<any>(url);
}

export async function runReport(reportId: string, request: ReportRunRequest): Promise<ReportResult> {
  const url = `${BASE}/${reportId}/run`;
  return await fetchJson<ReportResult>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export async function compareReport(reportId: string, request: any): Promise<ReportComparisonResult> {
  const url = `${BASE}/${reportId}/compare`;
  return await fetchJson<ReportComparisonResult>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export async function exportReport(reportId: string, request: ReportExportRequest): Promise<Blob | { content: Uint8Array; contentType: string; fileName: string }> {
  const url = `${BASE}/${reportId}/export`;

  if (request.stream) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!res.ok) throw new Error(`Export failed: ${res.status}`);
    const blob = await res.blob();
    return blob;
  }

  const data = await fetchJson<any>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  // when not streaming, backend may return File result or ApiResponse-wrapped content
  return data;
}

export async function getSnapshot(): Promise<AdminAnalyticsSnapshot> {
  const url = `${BASE}/streaming/snapshot`;
  return await fetchJson<AdminAnalyticsSnapshot>(url);
}

export default {
  getCatalog,
  getSchema,
  runReport,
  compareReport,
  exportReport,
  getSnapshot,
};
