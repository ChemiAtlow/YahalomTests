import { models } from "@yahalom-tests/common";
import { AxiosRequestConfig } from "axios";
import { AuthRequest } from "../models";
import http from "./httpService";

const questionRoute = "/questions/";

const authRequestToHeaders: (authReqData: AuthRequest) => AxiosRequestConfig = ({
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

export async function getAllQuestions(authReqData: AuthRequest) {
    return await http.get<models.interfaces.Question[]>(
        questionRoute,
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
export async function deleteQuestion(authReqData: AuthRequest, id: models.classes.guid) {
    return await http.delete<models.interfaces.Question>(
        `${questionRoute}${id}`,
        authRequestToHeaders(authReqData)
    );
}
