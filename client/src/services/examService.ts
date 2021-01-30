import { models } from "@yahalom-tests/common";
import http from "./httpService";

const examRoute = "/exam/";

export async function checkIfTestIdIsValid(testId: models.classes.guid) {
    return await http.get<void>(`${examRoute}validate-test/${testId}`);
};

export async function requestToStartExam(testId: models.classes.guid, student: models.dtos.StudentDto) {
    return await http.post<models.interfaces.Exam>(`${examRoute}new/${testId}`, student);
};

export async function getExam(examId: models.classes.guid) {
    return await http.get<models.interfaces.Exam>(`${examRoute}${examId}`);
};

export async function updateExam(examId: models.classes.guid, update: models.dtos.ExamChangeDto) {
    return await http.put<void>(`${examRoute}${examId}`, update);
};

export async function submitExam(examId: models.classes.guid) {
    return await http.get<models.interfaces.ExamResult>(`${examRoute}${examId}/submit`);
};
