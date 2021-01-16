import { models } from "@yahalom-tests/common";
import { userRepository } from "../DAL";
import { EmailTakenError } from "../errors";

export const signup = ({ email, password }: models.dtos.UserDto) => {
	if (userRepository.isEmailTaken(email)) {
		throw new EmailTakenError(email);
	}
	return userRepository.addItem({ email, password });
};

export const login = () => {};
export const resetPassword = () => {};
export const requestPasswordReset = () => {};
