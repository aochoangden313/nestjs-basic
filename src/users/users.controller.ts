import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TestGuard } from './test.guards';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './user.interface';

@Controller('users') // => link: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // => enpoint: /users --> noi endpoint
  @ResponseMessage("Create a new User")
  async create(
    @Body() createUserDto: CreateUserDto,
    @User() user: IUser
  ) {
    let newUser = await this.usersService.create(createUserDto, user);
    // return "create successfully";
    return {
      _id: newUser?._id,
      createAt: newUser?.createdAt
    }
  }

  @UseGuards(TestGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  //Update User
  @Patch()
  @ResponseMessage("Update a User")
  update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser
  ) {
    return this.usersService.update(updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a User")
  remove(
    @Param('id') id: string,
    @User() user: IUser
) {
    return this.usersService.remove(id, user);
  }
}
