import { IsArray, IsNumber, IsUUID } from "class-validator";
import { guid } from "../classes";

export class ExamChangeDto {
    @IsUUID("all")
    questionId!: guid;
    @IsArray()
    @IsNumber({}, { each: true })
    answers!: number[];
};