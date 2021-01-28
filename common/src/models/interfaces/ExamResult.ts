import { AnsweredQuestion } from "./AnsweredQuestion";
import { Question } from "./Question";

export interface ExamResult {
    message: string;
    isReviewEnabled: boolean;
    grade: number;
    questionCount: number;
    correctAnswersCount: number;
    answeredQuestions?: AnsweredQuestion[];
    originalQuestions?: Question[];
}