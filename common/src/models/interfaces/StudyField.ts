import { guid } from "../classes";
import { HasId } from "./HasId";

export interface StudyField extends HasId {
	name: string;
	questions: guid[];
	tests: guid[];
}
