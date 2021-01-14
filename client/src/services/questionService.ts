import { models } from "../../../common";
import http from "./httpService";

const questionRoute = "/Questions/";

export async function getAllQuestions() {
	return await http.get<models.interfaces.Question[]>(questionRoute);
}

export async function addQuestion(question: { title: string }) {
	return await http.post<models.interfaces.Question>(questionRoute, question);
}
