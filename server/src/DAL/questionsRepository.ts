import { promises as fsPromises } from "fs";
import type { models } from "../../../common";
const jsonFileName = "./data/jsonAsDb.json";

class DBQuestionsRepository {
	async getAllQuestions(): Promise<models.Question[]> {
		const questions = await fsPromises.readFile(jsonFileName, "utf8");
		const data = JSON.parse(questions);
		return data;
	}

	async addQuestion(question: models.Question) {
		let data = await this.getAllQuestions();
		const biggestId = Math.max(...data.map(q => q.id));
		question = { ...question, id: biggestId + 1 };
		data.push(question);
		await fsPromises.writeFile(jsonFileName, JSON.stringify(data));
		return question;
	}
}

export const questionsRepository = new DBQuestionsRepository();
