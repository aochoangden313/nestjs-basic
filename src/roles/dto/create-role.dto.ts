import { IsArray, IsBoolean, IsMongoId, isMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {

    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'description không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'isActive không được để trống' })
    @IsBoolean({ message: 'isActive có giá trị boolean' })
    isActive: boolean;

    @IsNotEmpty({ message: 'permissions không được để trống' })
    @IsMongoId({ each: true, message: 'permissions phải là object ID' })
    @IsArray({ message: 'permissions phải là mảng' })
    permissions: mongoose.Schema.Types.ObjectId[];

}
