import { promises as fsPromises, constants as fsConstants } from "fs";
import { resolve as pathResolve } from "path";
import { models } from "@yahalom-tests/common";
import { DbError, ItemNotInDbError } from "../errors";
import { types } from "../models";
import { appLoggerService } from "../services";

export class Repository<EntityType extends models.interfaces.HasId> {
	private fileName: string;
	private data?: EntityType[];
	private fullData?: EntityType[];

	constructor(fileName: string, protected entityName: types.EntityTypes) {
		appLoggerService.debug(`Creating a repo with proxy for ${fileName}`);
		this.fileName = pathResolve(__dirname, "..", "..", "data", fileName);
		this.isValidFile().then(isValid => {
			if (!isValid) {
				appLoggerService.error(`Couldn't find/read from ${fileName}`, this.fileName);
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
			appLoggerService.info(`${this.entityName} repo is preparing the data proxy.`);
			const items = await fsPromises.readFile(this.fileName, "utf8");
			const data = JSON.parse(items);
			if (!Array.isArray(data)) {
				appLoggerService.error(`${this.entityName} repo did not find an array in DB`, data);
				throw new DbError("Db is corrupt");
			}
			this.fullData = data;
			this.filterArchived();
			return data;
		} catch (err) {
			if (err instanceof DbError) {
				throw err;
			}
			appLoggerService.error(`An unhandled issue happened while starting the ${this.entityName} repo.`, err);
			throw new DbError("Couldn't fetch items");
		}
	}

	async getItemById(id: models.classes.guid) {
		const items = await this.getAll();
		return items.find(item => item.id === id);
	}

	async addItem(entity: EntityType) {
		appLoggerService.info(`${this.entityName} repo is adding a new item.`);
		entity.id = models.classes.Guid.newGuid(); //set id
		this.fullData = this.fullData || [];
		this.fullData.push(entity);
		this.filterArchived();
		await this.writeToFile();
		return entity;
	}
	
	async updateItem(id: models.classes.guid, entity: Partial<EntityType>) {
		appLoggerService.info(`${this.entityName} repo is updating an item with id: ${id}.`);
		let index = this.findIndexById(id);
		this.fullData![index] = { ...this.fullData![index], ...entity, id };
		await this.writeToFile();
		this.filterArchived();
		return this.fullData![index];
	}

	async deleteItem(id: models.classes.guid) {
		appLoggerService.info(`${this.entityName} repo is archiving an item with id: ${id}.`);
		const removed = await this.updateItem(id, { archived: true } as any);
		return removed;
	}

	private filterArchived() {
		this.data = (this.fullData || []).filter(entity => !entity.archived);
	}

	private findIndexById(id: models.classes.guid) {
		let index = (this.fullData || []).findIndex(entity => entity.id === id);
		if (index < 0) {
			throw new ItemNotInDbError(id, this.entityName);
		}
		return index;
	}

	private async writeToFile() {
		try {
			const data = JSON.stringify(this.fullData || []);
			await fsPromises.writeFile(this.fileName, data);
		} catch (err) {
			appLoggerService.error("Writing to DB error", err);
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
