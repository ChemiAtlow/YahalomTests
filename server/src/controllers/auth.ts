import { hash, compare } from "bcryptjs";
import { randomBytes } from "crypto";
import { sign } from "jsonwebtoken";
import { models } from "@yahalom-tests/common";
import { userRepository } from "../DAL";
import { EmailTakenError, AuthError, HttpError } from "../errors";
import { HTTPStatuses, TIME } from "../constants";

export const signup = async ({ email, password }: models.dtos.UserDto) => {
	if (await userRepository.getUserByEmail(email)) {
		throw new EmailTakenError(email);
	}
	const hashedPassword = await hash(password, 12);
	const newUser = await userRepository.addItem({
		email,
		password: hashedPassword,
		role: "Teacher",
	});
	return createUserJWT(newUser);
};

export const login = async ({ email, password }: models.dtos.UserDto) => {
	//check if user exist
	const userFromDb = await userRepository.getUserByEmail(email);
	if (!userFromDb) {
		throw new AuthError();
	}
	//password checkout
	const isMatchingPass = await compare(password, userFromDb.password);
	if (!isMatchingPass) {
		throw new AuthError();
	}
	return createUserJWT(userFromDb);
};

export const requestPasswordReset = async ({
	email,
}: models.dtos.RequestPasswordResetDto) => {
	//check if user exist
	const userFromDb = await userRepository.getUserByEmail(email);
	if (!userFromDb) {
		throw new AuthError();
	}
	//Try generating reset token
	try {
		const token = randomBytes(32).toString("hex");
		userFromDb.resetToken = token;
		userFromDb.resetTokenExpiration = Date.now() + TIME.month;
		await userRepository.updateItem(userFromDb.id!, {
			resetToken: token,
			resetTokenExpiration: Date.now() + TIME.month,
		});
		//Add email sending for reset
	} catch (err) {
		throw new HttpError(
			HTTPStatuses.internalServerError,
			"An unhandeled error happened when creating reset token."
		);
	}
};

export const resetPassword = async ({
	token,
	password,
}: models.dtos.ResetPasswordDto) => {
	//check if user exist
	const userFromDb = await userRepository.getUserWithRestToken(token);
	if (!userFromDb) {
		throw new AuthError();
	}
	//If user was found, his token is valid, lets reset him!
	const hashedPassword = await hash(password, 12);
	await userRepository.updateItem(userFromDb.id!, {
		resetToken: undefined,
		resetTokenExpiration: undefined,
		password: hashedPassword,
	});
};

//creats json web token
//server knows how to read it as if it was a user
const createUserJWT = (user: models.interfaces.User) =>
	sign(user, "veryStrongPassword", { expiresIn: "30d" });
