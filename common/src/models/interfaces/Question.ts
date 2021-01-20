import { Alignment, QuestionType } from "../enums";
import { Answer } from "./Answer";
import { HasId } from "./HasId";

export interface Question extends HasId {
    title: string;
    additionalContent?: string;
    type: QuestionType;
    answers: Answer[];
    label: string;
    alignment: Alignment;
    lastUpdate: number;
    active?: boolean;
    testCount?: number;
}
