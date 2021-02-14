import { createResource, strategies, plugins, StorageRequest } from "@lxsmnsyc/react-suspense-cache";
import { models } from "@yahalom-tests/common";
import { AuthRequest } from "../models";
import http, { authRequestToHeaders } from "./httpService";

const reportsRoute = "/reports/";

export const getAllStudents = createResource<models.interfaces.Student[], StorageRequest>({
    keyFactory() {
        return `allStudents`;
    },
    async fetcher(authReqData: AuthRequest) {
        const { data } = await http.get<models.interfaces.Student[]>(
            `${reportsRoute}students`,
            authRequestToHeaders(authReqData)
        );
        return data;
    },
    strategy: new strategies.StaleWhileRevalidate({
        plugins: [new plugins.ExpirationPlugin(10)],
    }),
    revalidateOnVisibility: true,
});

export const getStudentReports = createResource<models.interfaces.ExamResult[], StorageRequest>({
    keyFactory(_: AuthRequest, email: string) {
        return `studentReport-${email}`;
    },
    async fetcher(authReqData: AuthRequest, email: string) {
        const { data } = await http.get<models.interfaces.ExamResult[]>(
            `${reportsRoute}student/${email}`,
            authRequestToHeaders(authReqData)
        );
        return data;
    },
    strategy: new strategies.StaleWhileRevalidate({
        plugins: [new plugins.ExpirationPlugin(10)],
    }),
    revalidateOnVisibility: true,
});


export const getTestReport = createResource<models.interfaces.TestReport, StorageRequest>({
    keyFactory(_: AuthRequest, id: models.classes.guid, startDate = 0, endDate = 0) {
        return `testReport-${id}&${startDate}-${endDate}`;
    },
    async fetcher(authReqData: AuthRequest, id: models.classes.guid, startDate = 0, endDate = 0) {
        const { data } = await http.get<models.interfaces.TestReport>(
            `${reportsRoute}test/${id}?start=${startDate}&end=${endDate}`,
            authRequestToHeaders(authReqData)
        );
        return data;
    },
    strategy: new strategies.StaleWhileRevalidate({
        plugins: [new plugins.ExpirationPlugin(10)],
    }),
    revalidateOnVisibility: true,
});
