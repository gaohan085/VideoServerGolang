import axios from "axios";

const fetcher = (url: string) => axios.get(encodeURI(url)).then(res => res.data);

export default fetcher;
