import { hash, compare } from "bcryptjs";
import { models } from "@yahalom-tests/common";
import { userRepository } from "../DAL";
import { EmailTakenError } from "../errors";
import { LoginError } from "../errors/LoginError";

export const signup = async ({ email, password }: models.dtos.UserDto) => {
	if (userRepository.getUserByEmail(email)) {
		throw new EmailTakenError(email);
	}
	const hashedPassword = await hash(password, 12);
	return await userRepository.addItem({ email, password: hashedPassword });
};

export const login = async ({ email, password }: models.dtos.UserDto) => {
	//check if user exist
	const userFromDb = await userRepository.getUserByEmail(email);
	if (!userFromDb) {
		throw new LoginError();
	}
	//password checkout
	const isMatchingPass = await compare(password, userFromDb.password);
	if (!isMatchingPass) { throw new LoginError(); }
	return userFromDb;
};
export const resetPassword = () => { };
export const requestPasswordReset = () => { };
