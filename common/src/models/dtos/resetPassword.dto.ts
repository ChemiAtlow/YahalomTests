import { validations } from "../../constants";
import { IsHexadecimal, IsString, Matches } from "class-validator";
const { passwordDescription, passwordRegex } = validations;

export class ResetPasswordDto {
	@IsString()
	@IsHexadecimal()
	public token!: string;
	@IsString()
	@Matches(passwordRegex, { message: passwordDescription })
	password!: string;
}
