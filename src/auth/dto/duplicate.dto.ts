import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class DuplicateEmailReqDto {
    @ApiProperty()
    @IsEmail()
    email: string
}