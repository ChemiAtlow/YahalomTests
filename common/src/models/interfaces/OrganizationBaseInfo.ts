import { guid } from "../classes";
import { StudyField } from "./StudyField";

export interface OrganizationBaseInfo {
	id: guid;
	name: string;
	fields: StudyField[];
}
