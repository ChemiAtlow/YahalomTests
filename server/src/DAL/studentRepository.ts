import { promises as fsPromises, constants as fsConstants } from "fs";
import { resolve as pathResolve } from "path";
import { models } from "@yahalom-tests/common";
import { DbError, ItemNotInDbError } from "../errors";
import { types } from "../models";

type EntityType = models.interfaces.Student;

export class StudentRepository {
	private entityName: types.EntityTypes = "Student";
	private fileName: string;
	private data?: EntityType[];

	constructor(fileName: string) {
		this.fileName = pathResolve(__dirname, "..", "..", "data", fileName);
		this.isValidFile().then(isValid => {
			if (!isValid) {
				throw new DbError("Illegal file!");
			}
			this.getAll();
		});
	}

	async getAll(): Promise<EntityType[]> {
		try {
			if (this.data) {
				return this.data;
			}
			const items = await fsPromises.readFile(this.fileName, "utf8");
			const data = JSON.parse(items);
			if (!Array.isArray(data)) {
				throw new DbError("Db is corrupt");
			}
			return data;
		} catch (err) {
			if (err instanceof DbError) {
				throw err;
			}
			throw new DbError("Couldn't fetch items");
		}
	}

	async getItemByEmail(email: string) {
		const items = await this.getAll();
		return items.find(item => item.email === email);
	}

	async addItem(entity: EntityType) {
		this.data = this.data || [];
		this.data.push(entity);
		await this.writeToFile();
		return entity;
	}

	async updateItem(email: string, entity: Partial<EntityType>) {
		let index = this.findIndexByEmail(email);
		this.data![index] = { ...this.data![index], ...entity, email };
		await this.writeToFile();
		return this.data![index];
	}

	private findIndexByEmail(email: string) {
		let index = (this.data || []).findIndex(student => student.email === email);
		if (!this.data || index < 0) {
			throw new ItemNotInDbError(email, this.entityName);
		}
		return index;
	}

	private async writeToFile() {
		try {
			const data = JSON.stringify(this.data || []);
			await fsPromises.writeFile(this.fileName, data);
		} catch (err) {
			console.log("Writing to DB error", err);
			throw new DbError("Couldn't write into DB.");
		}
	}
	private async isValidFile() {
		try {
			const stats = await fsPromises.stat(this.fileName);
			if (!stats.isFile()) {
				return false;
			}
			await fsPromises.access(
				this.fileName,
				fsConstants.F_OK | fsConstants.R_OK | fsConstants.W_OK
			);
			return true;
		} catch (err) {
			return false;
		}
	}
}
