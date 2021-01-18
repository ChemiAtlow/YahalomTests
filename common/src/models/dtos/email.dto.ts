import { IsNotEmpty, IsString } from "class-validator";
export class EmailDto {
	@IsString()
	@IsNotEmpty()
	subject!: string;
	@IsString()
	@IsNotEmpty()
	body!: string;
}