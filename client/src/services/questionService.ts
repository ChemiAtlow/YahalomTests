import { Question } from "../models";
import http from "./httpService";

const serverRoute = "/api/Questions/";

const QuestionService = {
	async getAllQuestions() {
		return await http.get<Question[]>(serverRoute + "getQuestions");
	},

	async addQuestion(question: { title: string }) {
		return await http.post(serverRoute + "addQuestion", question);
	},
};

export default QuestionService;
