import { promises as fsPromises } from "fs";
import { models } from "@yahalom-tests/common";
import { DbError, ItemNotInDbError } from "../errors";
import { type } from "os";
const jsonFileName = "./data/jsonAsDb.json";

class DBQuestionsRepository {
	private data?: models.interfaces.Question[];

	constructor() {
		this.getAllQuestions();
	}

	async getAllQuestions(): Promise<models.interfaces.Question[]> {
		try {
			if (this.data) { return this.data; }
			const questions = await fsPromises.readFile(jsonFileName, "utf8");
			const data = JSON.parse(questions);
			if (Array.isArray(data)) {
				this.data = data;
				return data;
			}
			throw new DbError("Db is corrupt");
		} catch (err) {
			console.log("fetch items err", err);
			if (err instanceof DbError) {
				throw err;
			}
			throw new DbError("Couldn't fetch items");
		}
	}

	async getQuestionById(id: models.classes.guid) {
		const question = this.data?.find(q => q.id === id);
		if (!question) { throw new ItemNotInDbError(id, "Question"); }
		return question;
	}

	async addQuestion(question: models.interfaces.Question) {
		try {
			question.id = models.classes.Guid.newGuid(); //set id
			this.data?.push(question);
			await this.writeToFile(this.data || []); //if data is undefined send empty array
			return question;
		} catch (err) {
			console.log("add item err", err);
			throw new DbError("Couldn't add item");
		}
	}

	async updateQuestion(id: models.classes.guid, question: models.interfaces.Question) {
		let index = (this.data || []).findIndex(q => q.id === id);
		if (!this.data || index < 0) {
			throw new ItemNotInDbError(id, "Question");
		}
		this.data[index] = { ...this.data[index], ...question, id };
		await this.writeToFile(this.data);
		return this.data[index];
	}

	async deleteQuestion(id: models.classes.guid) {
		let index = (this.data || []).findIndex(q => q.id === id);
		if (!this.data || index < 0) {
			throw new ItemNotInDbError(id, "Question");
		}
		const removed = this.data.splice(index, 1);
		await this.writeToFile(this.data);
		return removed;
	}

	private async writeToFile(data: models.interfaces.Question[]) {
		await fsPromises.writeFile(jsonFileName, JSON.stringify(data));
	}
}

export const questionsRepository = new DBQuestionsRepository();
