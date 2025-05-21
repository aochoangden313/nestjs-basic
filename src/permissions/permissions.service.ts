import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission as PermissionM, PermissionDocument } from './schemas/permission.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(PermissionM.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>
  ) {
  }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {

    let { name, apiPath, method, module } = createPermissionDto;
    // kiem tra xem permission da ton tai chua
    let existPermission = await this.permissionModel.findOne({ apiPath, method });
    if (existPermission) throw new BadRequestException(`Permission ${name} đã tồn tại trên hệ thống, vui lòng sử dụng permission khác để đăng ký.`);
    let newPermission = await this.permissionModel.create({
      name,
      apiPath,
      method,
      module,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return {
      _id: newPermission?._id,
      createdAt: newPermission?.createdAt
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);

    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.permissionModel.find(filter)).length;

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.permissionModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, // số lượng bản ghi đã lấy 
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found job';

    return this.permissionModel.findOne({
      _id: id
    });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    return await this.permissionModel.updateOne(
      { _id: id },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
  }

  async remove(id: string, user: IUser) {
    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return await this.permissionModel.softDelete({
      _id: id
    });
  }
}
