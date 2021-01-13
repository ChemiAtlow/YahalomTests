import { promises as fsPromises } from "fs";
import { models } from "@yahalom-tests/common";
import { DbError } from "../errors";
const jsonFileName = "./data/jsonAsDb.json";

class DBQuestionsRepository {
	async getAllQuestions(): Promise<models.Question[]> {
		try {
			const questions = await fsPromises.readFile(jsonFileName, "utf8");
			const data = JSON.parse(questions);
			return data;
		} catch (err) {
			console.log("fetch items err", err);
			throw new DbError("Couldn't fetch items");
		}
	}

	async addQuestion(question: models.Question) {
		try {
			let data = await this.getAllQuestions();
			const biggestId = Math.max(...data.map(q => q.id ?? 0));
			question = { ...question, id: biggestId + 1 };
			data.push(question);
			await fsPromises.writeFile(jsonFileName, JSON.stringify(data));
			return question;
		} catch (err) {
			console.log("add item err", err);
			throw new DbError("Couldn't add item");
		}
	}
}

export const questionsRepository = new DBQuestionsRepository();
