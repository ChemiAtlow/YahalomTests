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
import { Alignment, QuestionType } from "../enums";
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
           @Matches(/(\w+)(,\s*\w+)*/, {
               message: "Label must be a comma seperated string!",
           })
           label!: string;
           @IsString()
           @IsEnum(Alignment)
           alignment!: Alignment;
       }
