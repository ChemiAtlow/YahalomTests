import { guid } from "../classes";

export interface StudyField {
	id?: guid;
	name: string;
	questions: guid[];
	tests: guid[];
}
