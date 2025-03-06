import { Prop } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { IsArray, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class UpdatedBy {
    @IsNotEmpty()
    _id: string;

    @IsNotEmpty()
    email: string;
}

class HistoryItem {
    @IsNotEmpty({ message: 'Status không được để trống' })
    @IsEnum(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'], { message: 'Status không hợp lệ' })
    status: string;

    @IsNotEmpty()
    updatedAt: Date;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => UpdatedBy)
    updatedBy: UpdatedBy;
}


export class CreateResumeDto {

    @IsOptional()
    @IsEmail({ message: 'email không đúng định dạng' })
    email: string;

    @IsNotEmpty({ message: 'userId không được để trống' })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming 'Company' is the name of your Company model
    })
    @IsMongoId({ message: 'userId is mongo id'})
    userId: mongoose.Schema.Types.ObjectId;

    @IsOptional()
    url: string;

    // status: string// PENDING-REVIEWING-APPROVED-REJECTED
    @IsNotEmpty({ message: 'status không được để trống' })
    @IsEnum(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'])
    @IsOptional()
    status: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Assuming 'Company' is the name of your Company model
    })
    @IsNotEmpty({ message: 'companyId không được để trống' })
    @IsMongoId({ message: 'companyId is mongo id'})
    companyId: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    })
    @IsMongoId({ message: 'jobId is mongo id'})
    @IsOptional()
    jobId: mongoose.Schema.Types.ObjectId;

    @IsOptional({ message: 'history không được để trống' })
    @IsArray({ message: 'history phải là một mảng' })
    @ValidateNested({ each: true, message: 'history không hợp lệ' })
    @Type(() => HistoryItem)
    history?: HistoryItem[];

}


export class CreateUserCvDto {

    @IsNotEmpty({ message: 'url không được để trống' })
    url: string;

    // status: string// PENDING-REVIEWING-APPROVED-REJECTED
    @IsNotEmpty({ message: 'status không được để trống' })
    @IsEnum(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'])
    @IsOptional()
    status?: string = 'PENDING';

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // Assuming 'Company' is the name of your Company model
    })
    @IsMongoId({ message: 'companyId is mongo id'})
    @IsNotEmpty({ message: 'companyId không được để trống' })
    companyId: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    })
    @IsOptional()
    @IsMongoId({ message: 'JobId is mongo id'})
    jobId: mongoose.Schema.Types.ObjectId;


}