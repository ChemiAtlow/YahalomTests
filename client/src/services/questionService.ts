import { models } from "@yahalom-tests/common";
import { AuthRequest } from "../models";
import http, { authRequestToHeaders } from "./httpService";

const questionRoute = "/questions/";


export async function getAllQuestions(authReqData: AuthRequest) {
    return await http.get<models.interfaces.Question[]>(
        questionRoute,
        authRequestToHeaders(authReqData)
    );
}

export async function getQuestion(authReqData: AuthRequest, id: models.classes.guid) {
    return await http.get<models.interfaces.Question>(
        `${questionRoute}${id}`,
        authRequestToHeaders(authReqData)
    );
}

export async function addQuestion(authReqData: AuthRequest, question: models.dtos.QuestionDto) {
    return await http.post<models.interfaces.Question>(
        questionRoute,
        question,
        authRequestToHeaders(authReqData)
    );
}

export async function editQuestion(authReqData: AuthRequest, id: models.classes.guid, question: models.dtos.QuestionDto) {
    return await http.put<models.interfaces.Question>(
        `${questionRoute}${id}`,
        question,
        authRequestToHeaders(authReqData)
    );
}

export async function deleteQuestion(authReqData: AuthRequest, id: models.classes.guid) {
    return await http.delete<models.interfaces.Question>(
        `${questionRoute}${id}`,
        authRequestToHeaders(authReqData)
    );
}
