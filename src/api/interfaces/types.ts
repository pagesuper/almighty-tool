export interface IApiResultData<T> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
}

export type IBasicApiResultData = IApiResultData<null>;
