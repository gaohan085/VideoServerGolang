import axios, { type AxiosResponse } from "axios";

const fetcher = <T>(url: string) =>
  axios.get<AxiosResponse<T>>(encodeURI(url)).then((res) => res.data);

export default fetcher;