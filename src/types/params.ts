export interface ParamsProp extends FiltersParamsProps {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

export interface FiltersParamsProps {
  fromDate?: Date;
  toDate?: Date;
  role?: string;
  status?: string;
  priority?: string;
  category?: string;
  inspectionStatus?: string;
  type?: string;
}
