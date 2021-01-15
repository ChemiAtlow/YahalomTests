import { IsBoolean, IsString } from "class-validator";
export class AnswerDto {
	@IsString()
	public content!: string;
	@IsBoolean()
	correct!: boolean;
}
