import axios, { AxiosRequestConfig } from "axios";
import { constants } from "@yahalom-tests/common";
import { AuthRequest } from "../models";
const { serverDomain, serverPort } = constants.URLS;

const axiosCreate = axios.create({ baseURL: `${serverDomain}:${serverPort}` });

const methods = {
    get: axiosCreate.get,
    post: axiosCreate.post,
    put: axiosCreate.put,
    delete: axiosCreate.delete,
};

export const authRequestToHeaders: (authReqData: AuthRequest) => AxiosRequestConfig = ({
    jwt,
    organizationId,
    studyFieldId,
}) => {
    return {
        headers: {
            Authorization: `Bearer ${jwt}`,
            Organization: organizationId,
            Field: studyFieldId,
        },
    };
};

export default methods;
