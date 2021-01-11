import { Question } from "../models";
import http from "./httpService";

const serverRoute = "/api/Questions/";

export async function getAllQuestions() {
	return await http.get<Question[]>(serverRoute + "getQuestions");
}

export async function addQuestion(question: { title: string }) {
	return await http.post<Question>(serverRoute + "addQuestion", question);
}
