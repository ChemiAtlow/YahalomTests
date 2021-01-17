import { constants } from "@yahalom-tests/common";
import { IsEmail, IsString, Matches } from "class-validator";
const { passwordDescription, passwordRegex } = constants.validations;

export class ResetPasswordDto {
	@IsEmail()
	public token!: string;
	@IsString()
	@Matches(passwordRegex, { message: passwordDescription })
	password!: string;
}
