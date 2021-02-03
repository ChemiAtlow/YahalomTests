import { models } from "@yahalom-tests/common";

export type ExamResultWithEmailDetails = {
    result: models.interfaces.ExamResult,
    email: models.interfaces.Email;
    teacherEmail: string,
    completionDate: number,
    title: string,
    studentEmail: string,
};
