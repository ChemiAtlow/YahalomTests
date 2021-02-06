import { models } from "@yahalom-tests/common";
import { AuthRequest } from "../models";
import http, { authRequestToHeaders } from "./httpService";

const reportsRoute = "/reports/";

export async function getAllStudents(authReqData: AuthRequest) {
    return await http.get<models.interfaces.Student[]>(`${reportsRoute}students`, authRequestToHeaders(authReqData));
}

export async function getStudentReports(authReqData: AuthRequest, email: string) {
    return await http.get<models.interfaces.ExamResult[]>(
        `${reportsRoute}student/${email}`, authRequestToHeaders(authReqData));
}

export async function getTestReport(authReqData: AuthRequest, id: models.classes.guid, startDate = 0, endDate = 0) {
    return await http.get<models.interfaces.TestReport>(
        `${reportsRoute}test/${id}?start=${startDate}&end=${endDate}`, authRequestToHeaders(authReqData));
}

