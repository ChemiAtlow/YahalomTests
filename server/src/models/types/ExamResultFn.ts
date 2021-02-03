import { models } from "@yahalom-tests/common";
import { ExamResultWithEmailDetails } from "./ExamResultWithEmailDetails";

export type ExamResultFn = {
    (exam: models.interfaces.Exam): Promise<models.interfaces.ExamResult>;
    (exam: models.classes.guid): Promise<ExamResultWithEmailDetails>;
};
