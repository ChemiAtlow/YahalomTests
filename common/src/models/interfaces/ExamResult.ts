import { guid } from "../classes";
import { AnsweredQuestion } from "./AnsweredQuestion";
import { Question } from "./Question";

export interface ExamResult {
    id: guid;
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