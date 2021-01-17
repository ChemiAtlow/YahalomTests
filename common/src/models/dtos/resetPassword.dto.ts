import { constants } from "@yahalom-tests/common";
import { IsHexadecimal, IsString, Matches } from "class-validator";
const { passwordDescription, passwordRegex } = constants.validations;

export class ResetPasswordDto {
	@IsString()
	@IsHexadecimal()
	public token!: string;
	@IsString()
	@Matches(passwordRegex, { message: passwordDescription })
	password!: string;
}
