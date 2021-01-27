import { guid } from "../classes";
import { Alignment, QuestionType } from "../enums";
import { Answer } from "./Answer";

export interface AnsweredQuestion {
    questionId: guid;
    type: QuestionType;
    alignment: Alignment;
    title: string;
    additionalContent?: string;
    answers: Answer[];
}
