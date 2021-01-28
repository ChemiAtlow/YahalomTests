import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    MaxLength,
    Min,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { guid } from "../classes";
import "reflect-metadata";
import { Language } from "../enums";
import { EmailDto } from "./email.dto";

export class TestDto {
    @IsOptional()
    @IsUUID("all")
    id?: guid;
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title!: string;
    @IsString()
    @IsNotEmpty()
    intro!: string;
    @IsArray()
    @ArrayNotEmpty()
    questions!: guid[];
    @IsEnum(Language)
    language!: Language;
    @IsNumber()
    @Min(1)
    @Max(100)
    minPassGrade!: number;
    @IsBoolean()
    isReviewEnabled!: boolean;
    @IsString()
    @IsNotEmpty()
    successMessage!: string;
    @IsString()
    @IsNotEmpty()
    failureMessage!: string;
    @Type(() => EmailDto)
    @ValidateNested()
    successEmail!: EmailDto;
    @Type(() => EmailDto)
    @ValidateNested()
    failureEmail!: EmailDto;
}
