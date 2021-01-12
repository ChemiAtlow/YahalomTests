import { Question } from "../models";
import http from "./httpService";

const questionRoute = "/Questions/";

export async function getAllQuestions() {
	return await http.get<Question[]>(questionRoute);
}

export async function addQuestion(question: { title: string }) {
	return await http.post<Question>(questionRoute, question);
}
