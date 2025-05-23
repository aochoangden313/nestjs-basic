import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}


export class CreateUserDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsEmail({},{message: 'Email phải đúng định dạng'})
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;
 
    @IsNotEmpty({message: 'Password không được để trống'})
    password: string;

    @IsNotEmpty({message: 'Age không được để trống'})
    age: number;

    @IsNotEmpty({message: 'Gender không được để trống'})
    gender: number;

    @IsNotEmpty({message: 'Address không được để trống'})
    address: number;

    @IsNotEmpty({message: 'Role không được để trống'})
    @IsMongoId({message: 'Không đúng định dạng ObjectId'})
    role: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

}


export class RegisterUserDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsEmail({},{message: 'Email phải đúng định dạng'})
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;

    @IsNotEmpty({message: 'Password không được để trống'})
    password: string;

    @IsNotEmpty({message: 'Age không được để trống'})
    age: number;

    @IsNotEmpty({message: 'Gender không được để trống'})
    gender: number;

    @IsNotEmpty({message: 'Role không được để trống'})
    role: string;

    @IsNotEmpty({message: 'Address không được để trống'})
    address: string;

}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin@gmail.com', description: 'Email' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'Pssword',
  })
  readonly password: string;
}
