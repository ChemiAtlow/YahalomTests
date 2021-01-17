import axios from "axios";
import environment from "../environments/environment";

const axiosCreate = axios.create({ baseURL: `${environment.serverUrl}` });

const methods = {
	get: axiosCreate.get,
	post: axiosCreate.post,
	put: axiosCreate.put,
	delete: axiosCreate.delete,
};

export default methods;
