import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}


export class CreateJobDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsNotEmpty({message: 'Skills không được để trống'})
    skills: string[];

    @IsNotEmpty({message: 'Start Date không được để trống'})
    startDate: Date;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @IsNotEmpty({message: 'Company không được để trống'})
    @Type(() => Company)
    company: Company;

}


