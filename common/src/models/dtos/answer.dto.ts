import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
export class AnswerDto {
	@IsString()
	@IsNotEmpty()
	public content!: string;
	@IsBoolean()
	correct!: boolean;
}
