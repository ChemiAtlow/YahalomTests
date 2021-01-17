import { models } from "@yahalom-tests/common";
import { Repository } from "./reporsitory";

export class UserRepository extends Repository<models.interfaces.User> {
	constructor(fileName: string) {
		super(fileName, "User");
	}
	async getUserByEmail(email: string) {
		const users = await this.getAll();
		const user = users.find(u => u.email === email);
		return user;
	}
	async getUserWithRestToken(token: string) {
		const users = await this.getAll();
		const user = users.find(u => u.resetToken === token);
		if (user?.resetTokenExpiration || 0 > Date.now()) {
			return undefined;
		}
		return user;
	}
}
