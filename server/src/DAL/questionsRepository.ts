import { promises as fsPromises } from "fs";
import { models } from "../../../common";
import { DbError } from "../errors";
const jsonFileName = "./data/jsonAsDb.json";

class DBQuestionsRepository {
	async getAllQuestions(): Promise<models.interfaces.Question[]> {
		try {
			const questions = await fsPromises.readFile(jsonFileName, "utf8");
			const data = JSON.parse(questions);
			return data;
		} catch (err) {
			console.log("fetch items err", err);
			throw new DbError("Couldn't fetch items");
		}
	}

	async addQuestion(question: models.interfaces.Question) {
		try {
			let data = await this.getAllQuestions();     //get all questions
			question.id = models.classes.Guid.newGuid(); //set id
			data.push(question);

			await this.writeToFile(data);
			return question;
		} catch (err) {
			console.log("add item err", err);
			throw new DbError("Couldn't add item");
		}
	}

	private async writeToFile(data: models.interfaces.Question[]) {
		await fsPromises.writeFile(jsonFileName, JSON.stringify(data));
	}
}

export const questionsRepository = new DBQuestionsRepository();
