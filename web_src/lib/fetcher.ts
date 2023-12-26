import axios, { AxiosResponse } from "axios";

export const fetcher = <T>(url: string) =>
  axios.get<AxiosResponse<T>>(url).then((res) => res.data);
