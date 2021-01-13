import { guid } from "../classes";

export interface Answer {
    id?: guid;
    content: string;
    correct: boolean;
}
