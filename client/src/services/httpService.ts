import axios from "axios";
import{constants} from "@yahalom-tests/common";
const {serverDomain,serverPort} = constants.URLS;

const axiosCreate = axios.create({ baseURL: `${serverDomain}:${serverPort}` });

const methods = {
	get: axiosCreate.get,
	post: axiosCreate.post,
	put: axiosCreate.put,
	delete: axiosCreate.delete,
};

export default methods;
