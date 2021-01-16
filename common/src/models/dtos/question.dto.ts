import {
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsIn,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Matches,
	ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { IsWithAtLeastOneCorrectAnswer } from "../../validators";
import { guid } from "../classes";
import { QuestionType } from "../enums";
import { AnswerDto } from "./answer.dto";
import "reflect-metadata";

export class QuestionDto {
	@IsOptional()
	@IsUUID("4")
	public id?: guid;
	@IsString()
	@IsNotEmpty()
	public title!: string;
	@IsOptional()
	@IsString()
	additionalContent?: string;
	@IsEnum(QuestionType)
	type!: QuestionType;
	@IsArray()
	@ArrayMinSize(2)
	@Type(() => AnswerDto)
	@ValidateNested({ each: true, message: "Answers are invalid" })
	@IsWithAtLeastOneCorrectAnswer()
	answers!: AnswerDto[];
	@Matches(/(\d+)(,\s*\d+)*/)
	label!: string;
	@IsString()
	@IsIn(["Horizontal", "Vertical"])
	alignment!: "Horizontal" | "Vertical";
}
