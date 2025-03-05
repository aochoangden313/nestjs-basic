import { Transform, Type } from "class-transformer";
import { IsArray, isArray, IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    logo: string;
}


export class CreateJobDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsNotEmpty({message: 'Skills không được để trống'})
    @IsArray({message: 'Skills phải có định dạng array'})
    @IsString({each: true, message: 'Skill phải là string'})
    skills: string[];

    @IsNotEmpty({message: 'Start Date không được để trống'})
    @IsDate({message: 'startDate phải có định dạng là Date'})
    @Transform(({value}) => new Date(value))
    startDate: Date;

    @IsNotEmpty({message: 'End Date không được để trống'})
    @IsDate({message: 'endDate phải có định dạng là Date'})
    @Transform(({value}) => new Date(value))
    endDate: Date;

    @IsNotEmpty({message: 'isActive không được để trống'})
    @IsBoolean({message: 'isActive phải có định dạng là boolean'})
    isActive: Boolean;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @IsNotEmpty({message: 'Company không được để trống'})
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({message: 'Location không được để trống'})
    location: string;

    @IsNotEmpty({message: 'Salary không được để trống'})
    @IsNumber()
    salary: number;

    @IsNotEmpty({message: 'Quantity không được để trống'})
    @IsNumber()
    quantity: number;
}


