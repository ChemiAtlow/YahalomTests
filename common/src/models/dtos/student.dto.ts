import { IsAlpha, IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class StudentDto {
    @IsEmail()
    email!: string;
    @IsAlpha()
    firstName!: string;
    @IsAlpha()
    lastName!: string;
    @IsPhoneNumber("IL")
    phone!: string;
}
