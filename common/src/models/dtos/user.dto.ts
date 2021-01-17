import { IsEmail, IsEmpty, Matches } from "class-validator";
import { constants } from "@yahalom-tests/common";
import { User } from "../interfaces";

export class UserDto implements User {
	@IsEmail()
	public email!: string;
	//1 upper-case, 1 lower-case, 1 number, 1 special char, minimum 8 chars
	@Matches(constants.validations.passwordRegex, {
		message: constants.validations.passwordDescription,
	})
	password!: string;
	@IsEmpty()
	role!: "CaptainAmerica" | "Admin" | "Teacher";
}
