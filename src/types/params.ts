export interface ParamsProp extends DateParamsProps {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  search: string;
}

export interface DateParamsProps {
  fromDate?: Date;
  toDate?: Date;
}
