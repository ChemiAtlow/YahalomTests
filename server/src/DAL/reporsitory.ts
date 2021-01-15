import { promises as fsPromises, constants as fsConstants } from "fs";
import { resolve as pathResolve } from "path";
import { models } from "@yahalom-tests/common";
import { DbError, ItemNotInDbError } from "../errors";
import { types } from "../models";

export class Repository<EntityType extends models.interfaces.HasId> {
	private fileName: string;
	private data?: EntityType[];

	constructor(fileName: string, protected entityName: types.EntityTypes) {
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
			this.data = data;
			return data;
		} catch (err) {
			if (err instanceof DbError) {
				throw err;
			}
			throw new DbError("Couldn't fetch items");
		}
	}

	async getItemById(id: models.classes.guid) {
		const index = this.findIndexById(id);
		return this.data![index];
	}

	async addItem(entity: EntityType) {
		entity.id = models.classes.Guid.newGuid(); //set id
		this.data = this.data || [];
		this.data.push(entity);
		await this.writeToFile();
		return entity;
	}

	async updateItem(id: models.classes.guid, entity: EntityType) {
		let index = this.findIndexById(id);
		this.data![index] = { ...this.data![index], ...entity, id };
		await this.writeToFile();
		return this.data![index];
	}

	async deleteItem(id: models.classes.guid) {
		let index = this.findIndexById(id);
		const removed = this.data!.splice(index, 1);
		await this.writeToFile();
		return removed;
	}

	private findIndexById(id: models.classes.guid) {
		let index = (this.data || []).findIndex(q => q.id === id);
		if (!this.data || index < 0) {
			throw new ItemNotInDbError(id, this.entityName);
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
