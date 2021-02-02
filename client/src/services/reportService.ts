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

export async function getTestReport(authReqData: AuthRequest, id: models.classes.guid) {
    return await http.get<{test: models.interfaces.Test; exams: models.interfaces.ExamResult[]}>( //need to notice which type to send...
        `${reportsRoute}test/${id}`, authRequestToHeaders(authReqData));
}

