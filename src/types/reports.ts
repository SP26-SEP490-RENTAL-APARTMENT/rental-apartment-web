export interface ReportDimensionRequestDto {
  field: string;
  alias?: string;
}

export interface ReportMetricRequestDto {
  field: string;
  aggregation?: string;
  alias?: string;
}

export interface ReportFilterRequestDto {
  target?: string; // 'dimension' | 'metric'
  field: string;
  operator?: string;
  value?: string;
  values?: string[];
}

export interface ReportRunRequestDto {
  from?: string; // ISO
  to?: string; // ISO
  searchTerm?: string;
  dimensions?: ReportDimensionRequestDto[];
  metrics?: ReportMetricRequestDto[];
  filters?: ReportFilterRequestDto[];
  page?: number;
  pageSize?: number;
}

export interface ReportResultRowDto {
  dimensions: Record<string, any>;
  metrics: Record<string, number>;
}

export interface ReportResultPageDto {
  reportId: string;
  name: string;
  rows: ReportResultRowDto[];
  totalMetrics: Record<string, number>;
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export interface ReportSchemaDto {
  dimensions: string[];
  metricFields: string[];
  aggregations: string[];
  operators: string[];
}
export interface ReportSchema {
  dimensions: string[];
  metricFields: string[];
  aggregations: string[];
  operators: string[];
}

export interface ReportQueryConfigResponse {
  DimensionsJson?: string | null;
  MetricsJson?: string | null;
  FiltersJson?: string | null;
  TimeRangeJson?: string | null;
}

export interface ReportDimensionRequest {
  field: string;
  alias?: string;
}

export interface ReportMetricRequest {
  field: string;
  aggregation?: string;
  alias?: string;
}

export interface ReportFilterRequest {
  target?: 'dimension' | 'metric';
  field: string;
  operator?: string;
  value?: string;
  values?: string[];
}

export interface ReportRunRequest {
  from?: string; // ISO date string
  to?: string; // ISO date string
  searchTerm?: string;
  dimensions?: ReportDimensionRequest[];
  metrics?: ReportMetricRequest[];
  filters?: ReportFilterRequest[];
  page?: number;
  pageSize?: number;
}

export interface ReportResultRow {
  dimensions: Record<string, any>;
  metrics: Record<string, number>;
}

export interface ReportResult {
  reportId: string;
  name: string;
  rows: ReportResultRow[];
  totalMetrics: Record<string, number>;
}

export interface ReportComparisonRow {
  dimensions: Record<string, any>;
  currentMetrics: Record<string, number>;
  previousMetrics: Record<string, number>;
  deltaMetrics: Record<string, number>;
  deltaPercentMetrics: Record<string, number>;
}

export interface ReportComparisonResult {
  reportId: string;
  name: string;
  mode: string;
  currentFrom?: string;
  currentTo?: string;
  previousFrom?: string;
  previousTo?: string;
  rows: ReportComparisonRow[];
  totalCurrentMetrics: Record<string, number>;
  totalPreviousMetrics: Record<string, number>;
  totalDeltaMetrics: Record<string, number>;
  totalDeltaPercentMetrics: Record<string, number>;
}

export interface ReportExportRequest {
  format?: string;
  includeComparison?: boolean;
  fileName?: string;
  runRequest?: ReportRunRequest;
  comparisonRequest?: any;
  stream?: boolean;
  pageSize?: number;
}

export interface ReportDefinitionDto {
  name: string;
  description?: string;
  type?: string;
  category?: string;
  isActive?: boolean;
}

export interface ReportDefinitionResponse {
  reportId: string;
  name: string;
  description?: string;
  type?: string;
  category?: string;
  isActive?: boolean;
}

export interface AdminAnalyticsSnapshot {
  generatedAt: string;
  totalBookings: number;
  paidBookings: number;
  completedBookings: number;
  bookingsLast24Hours: number;
  revenueFromPaidAndCompleted: number;
  openSupportTickets: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export default {};
