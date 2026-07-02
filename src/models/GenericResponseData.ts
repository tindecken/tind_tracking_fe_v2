export interface GenericResponseData<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  totalRecords?: number;
}
