import { IsArray, IsEmail, IsNotEmpty } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsEmail({ message: 'email không hợp lệ' })
    @IsNotEmpty({ message: 'email không được để trống' })
    email: string;

    @IsNotEmpty({ message: 'skills không được để trống' })
    @IsArray({ message: 'skills phải là mảng' })
    skills: string[];
}
