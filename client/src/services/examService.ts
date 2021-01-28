import { models } from "@yahalom-tests/common";
import http from "./httpService";

const examRoute = "/exam/";

export async function checkIfTestIdIsValid(testId: models.classes.guid) {
    return await http.get<void>(`${examRoute}validate-test/${testId}`);
};

export async function requestToStartExam(testId: models.classes.guid, student: models.dtos.StudentDto) {
    return await http.post<models.interfaces.Exam>(`${examRoute}new/${testId}`, student);
};
