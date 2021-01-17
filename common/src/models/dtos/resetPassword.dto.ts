import { validations } from "../../constants";
import { IsString, Matches } from "class-validator";
const { passwordDescription, passwordRegex } = validations;

export class ResetPasswordDto {
	@IsString()
	@Matches(passwordRegex, { message: passwordDescription })
	password!: string;
}
