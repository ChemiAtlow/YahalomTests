import { AnsweredQuestion } from "./AnsweredQuestion";
import { Question } from "./Question";

export interface ExamResult {
    message: string;
    isReviewEnabled: boolean;
    grade: number;
    minPassGrade: number;
    title: string;
    intro: string;
    questionCount: number;
    correctAnswersCount: number;
    answeredQuestions?: AnsweredQuestion[];
    originalQuestions?: Question[];
}