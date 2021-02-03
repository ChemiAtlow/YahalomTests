import { ExamResult } from "./ExamResult";
import { Test } from "./Test";

export interface TestReport {
    test: Test;
    exams: ExamResult[];
}
