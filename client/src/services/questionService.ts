import { models } from "../../../common";
import http from "./httpService";

const questionRoute = "/Questions/";

export async function getAllQuestions() {
	return await http.get<models.Question[]>(questionRoute);
}

export async function addQuestion(question: { title: string }) {
	return await http.post<models.Question>(questionRoute, question);
}
