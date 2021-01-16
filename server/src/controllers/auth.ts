import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { models } from "@yahalom-tests/common";
import { userRepository } from "../DAL";
import { EmailTakenError } from "../errors";
import { LoginError } from "../errors/LoginError";

export const signup = async ({ email, password }: models.dtos.UserDto) => {
	if (await userRepository.getUserByEmail(email)) {
		throw new EmailTakenError(email);
	}
	const hashedPassword = await hash(password, 12);
	const newUser = await userRepository.addItem({ email, password: hashedPassword });
	return createUserJWT(newUser);
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
	return createUserJWT(userFromDb);
};
export const resetPassword = () => { };
export const requestPasswordReset = () => { };

//creats json web token
//server knows how to read it as if it was a user
const createUserJWT = (user: models.interfaces.User) => sign(user, "veryStrongPassword", { expiresIn: "30d" });