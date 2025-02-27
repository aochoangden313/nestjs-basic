import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CompanyDocument } from 'src/companies/schemas/company.schema';
import { IUser } from './user.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';


@Injectable()
export class UsersService {
  constructor(@InjectModel(UserM.name)
  private userModel: SoftDeleteModel<UserDocument>
  ) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  // create(createUserDto: CreateUserDto) {
  // async create(email: string, password: string, name: string) {
  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    let { name, email, age, password, gender, address, company, role } = createUserDto;

    //kiem tra email user da dang ky voi email chua
    let existEmail = await this.userModel.findOne({ email });

    if (existEmail) throw new BadRequestException(`Email ${email} đã tồn tại trên hệ thống, vui lòng sử dụng email khác để đăng ký.`);


    const hashPassword = this.getHashPassword(password);
    let newUser = await this.userModel.create({
      email,
      password: hashPassword,
      name,
      age,
      gender,
      address,
      company,
      role
    })
    return newUser;
  }

  async register(registerUserDto: RegisterUserDto) {
    let { name, email, age, password, gender, address } = registerUserDto;

    //kiem tra email user da dang ky voi email chua
    let existEmail = await this.userModel.findOne({ email });

    if (existEmail) throw new BadRequestException(`Email ${email} đã tồn tại trên hệ thống, vui lòng sử dụng email khác để đăng ký.`);

    const hashPassword = this.getHashPassword(password);

    let newUser = await this.userModel.create({
      name,
      password: hashPassword,
      email,
      age,
      gender,
      role: "USER",
      address
    })
    return newUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * (+limit);

    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;

    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
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
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';

    return this.userModel.findOne({
      _id: id
    }).select("-password");
  }

  //Tìm user bởi username
  findOneByUsername(username: string) {

    //Nếu email trùng vs username thì trả ra user
    return this.userModel.findOne({
      email: username
    });
  }

  // Password là password nhập vào, còn hash password lấy lên từ database
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    let { _id } = updateUserDto;

    //kiem tra email user da dang ky voi email chua
    let existUser = await this.userModel.findOne({ _id });

    if (!existUser) throw new BadRequestException(`User khong ton tai`);

    return await this.userModel.updateOne({
      _id: updateUserDto._id
    },
      {
        ...updateUserDto,
        updatedBy: {
          "_id": user._id,
          "email": user.email
        }
      }
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';

    // const deleted = await this.testModel.softDelete({ _id: test._id, name: test.name }, options);
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return await this.userModel.softDelete({
      _id: id
    })
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    // const deleted = await this.testModel.softDelete({ _id: test._id, name: test.name }, options);
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken,
      });
  }
}
