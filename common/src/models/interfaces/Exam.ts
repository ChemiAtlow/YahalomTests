import { guid } from "../classes";
import { Language } from "../enums";
import { AnsweredQuestion } from "./AnsweredQuestion";
import { HasId } from "./HasId";

export interface Exam extends HasId {
    id: guid;
    test: guid;
    language: Language;
    title: string;
    intro: string;
    student: string; //the email of student, which is the unique key
    completed?: number; //The date of completion.
    questions: AnsweredQuestion[];
    timeStarted: number;
    grade?: number;
    minPassGrade: number;
    correctAnswersCount?: number;
}
