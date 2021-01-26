import { models } from "@yahalom-tests/common";
import { AuthRequest } from "../models";
import http, { authRequestToHeaders } from "./httpService";

const testsRoute = "/test/";

export async function getAllTests(authReqData: AuthRequest) {
    return await http.get<models.interfaces.Test[]>(testsRoute, authRequestToHeaders(authReqData));
}

export async function getTest(authReqData: AuthRequest, id: models.classes.guid) {
    return await http.get<models.interfaces.Test>(
        `${testsRoute}${id}`,
        authRequestToHeaders(authReqData)
    );
}

export async function addTest(authReqData: AuthRequest, test: models.dtos.TestDto) {
    return await http.post<models.interfaces.Test>(
        testsRoute,
        test,
        authRequestToHeaders(authReqData)
    );
}

export async function editTest(
    authReqData: AuthRequest,
    id: models.classes.guid,
    test: models.dtos.TestDto
) {
    return await http.put<models.interfaces.Test>(
        `${testsRoute}${id}`,
        test,
        authRequestToHeaders(authReqData)
    );
}
