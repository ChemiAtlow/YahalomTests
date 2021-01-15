import { promises as fsPromises } from "fs";
import { models } from "@yahalom-tests/common";
import { DbError, ItemNotInDbError } from "../errors";
const jsonFileName = "./data/jsonAsDb.json";

class DBQuestionsRepository {
	private data?: models.interfaces.Question[];

	constructor() {
		this.getAllQuestions();
	}

	async getAllQuestions(): Promise<models.interfaces.Question[]> {
		try {
			if (this.data) {
				return this.data;
			}
			const questions = await fsPromises.readFile(jsonFileName, "utf8");
			const data = JSON.parse(questions);
			if (!Array.isArray(data)) {
				throw new DbError("Db is corrupt");
			}
			this.data = data;
			return data;
		} catch (err) {
			if (err instanceof DbError) {
				throw err;
			}
			throw new DbError("Couldn't fetch items");
		}
	}

	async getQuestionById(id: models.classes.guid) {
		const index = this.findIndexById(id);
		return this.data![index];
	}

	async addQuestion(question: models.interfaces.Question) {
		question.id = models.classes.Guid.newGuid(); //set id
		this.data = this.data || [];
		this.data.push(question);
		await this.writeToFile();
		return question;
	}

	async updateQuestion(
		id: models.classes.guid,
		question: models.interfaces.Question
	) {
		let index = this.findIndexById(id);
		this.data![index] = { ...this.data![index], ...question, id };
		await this.writeToFile();
		return this.data![index];
	}

	async deleteQuestion(id: models.classes.guid) {
		let index = this.findIndexById(id);
		const removed = this.data!.splice(index, 1);
		await this.writeToFile();
		return removed;
	}

	private findIndexById(id: models.classes.guid) {
		let index = (this.data || []).findIndex(q => q.id === id);
		if (!this.data || index < 0) {
			throw new ItemNotInDbError(id, "Question");
		}
		return index;
	}

	private async writeToFile() {
		try {
			const data = JSON.stringify(this.data || []);
			await fsPromises.writeFile(jsonFileName, data);
		} catch (err) {
			console.log("Writing to DB error", err);
			throw new DbError("Couldn't write into DB.");
		}
	}
}

export const questionsRepository = new DBQuestionsRepository();
