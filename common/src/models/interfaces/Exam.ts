import { guid } from "../classes";
import { Language } from "../enums";
import { AnsweredQuestion } from "./AnsweredQuestion";

export interface Exam {
    id: guid;
    test: guid;
    language: Language;
    title: string;
    intro: string;
    student: string; //the email of student, which is the unique key
    completed: boolean;
    questions: AnsweredQuestion[];
}
