import { guid } from "../classes";
import { Language } from "../enums";
import { Email } from "./Email";
import { HasId } from "./HasId";

export interface Test extends HasId {
    lastUpdate: number;
    questions: guid[];
    language: Language;
    title: string;
    intro: string;
    teacherEmail: string;
    minPassGrade: number;
    isReviewEnabled: boolean;
    successMessage: string;
    failureMessage: string;
    successEmail: Email;
    failureEmail: Email;
}