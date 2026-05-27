import { apiConfig } from "@/config/apiConfig";
import type {
  ApiResponse,
  ReportComparisonResult,
  ReportExportRequest,
  ReportResult,
  ReportRunRequest,
  ReportSchema,
  ReportDefinitionResponse,
  ReportQueryConfigResponse,
} from "../types/reports";

const BASE = "/landlord/reports";

function unwrapApiResponse<T>(payload: T | ApiResponse<T>): T {
  if (payload && typeof payload === "object" && "success" in (payload as any)) {
    const api = payload as ApiResponse<T>;
    if (!api.success) {
      throw new Error(api.message || "API error");
    }

    return api.data as T;
  }

  return payload as T;
}

export async function getCatalog(page = 1, pageSize = 20): Promise<{ items: ReportDefinitionResponse[]; totalCount: number }> {
  const url = `${BASE}/catalog?page=${page}&pageSize=${pageSize}`;
  const response = await apiConfig.privateApi.get<{ Items: ReportDefinitionResponse[]; TotalCount: number }>(url);
  const data = response.data;
  return { items: data.Items, totalCount: data.TotalCount };
}

export async function getSchema(reportId: string): Promise<ReportSchema> {
  const url = `${BASE}/${reportId}/schema`;
  const response = await apiConfig.privateApi.get<ReportSchema | ApiResponse<ReportSchema>>(url);
  return unwrapApiResponse(response.data);
}

export async function getConfig(reportId: string): Promise<ReportQueryConfigResponse> {
  const url = `${BASE}/${reportId}/config`;
  const response = await apiConfig.privateApi.get<ReportQueryConfigResponse | ApiResponse<ReportQueryConfigResponse>>(url);
  return unwrapApiResponse(response.data);
}

export async function runReport(reportId: string, request: ReportRunRequest): Promise<ReportResult> {
  const url = `${BASE}/${reportId}/run`;
  const response = await apiConfig.privateApi.post<ReportResult | ApiResponse<ReportResult>>(url, request);
  return unwrapApiResponse(response.data);
}

export async function compareReport(reportId: string, request: any): Promise<ReportComparisonResult> {
  const url = `${BASE}/${reportId}/compare`;
  const response = await apiConfig.privateApi.post<ReportComparisonResult | ApiResponse<ReportComparisonResult>>(url, request);
  return unwrapApiResponse(response.data);
}

export async function exportReport(reportId: string, request: ReportExportRequest): Promise<Blob> {
  const url = `${BASE}/${reportId}/export`;
  const response = await apiConfig.privateApi.post(url, request, { responseType: "blob" });
  return response.data as Blob;
}

export default {
  getCatalog,
  getSchema,
  getConfig,
  runReport,
  compareReport,
  exportReport,
};
