import { models } from "@yahalom-tests/common";
import { Repository } from "./reporsitory";

export class UserRepository extends Repository<models.interfaces.User> {
	constructor(fileName: string) {
		super(fileName, "User");
	}
	async isEmailTaken(email: string) {
		const users = await this.getAll();
		const user = users.find(u => u.email === email);
		return Boolean(user);
	}
}
