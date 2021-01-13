import { guid } from "../classes";
import { QuestionType } from "../enums";
import { Answer } from "./Answer";

export interface Question {
	id?: guid;
	title: string;
	additionalContent: string;
	type: QuestionType;
	answers: Answer[];
	label: string;
	alignment: "Horizontal" | "Vertical";
}
