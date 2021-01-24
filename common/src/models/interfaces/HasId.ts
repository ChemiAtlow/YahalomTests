import { guid } from "../classes";

export interface HasId {
	id?: guid;
	archived?: boolean;
}
