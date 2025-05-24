import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @ResponseMessage("Create a new Permission")
  async create(@Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser
  ) {
    // return this.permissionsService.create(createPermissionDto);
    let newPermission = await this.permissionsService.create(createPermissionDto, user);
    return {
      _id: newPermission?._id,
      createAt: newPermission?.createdAt
    }
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch List Permission with pagination")
  findAll(
    @Query("current") currentPage: string, //const currentPage:string = req.query.page;
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.permissionsService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage("Fetch Permission by id")
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @ResponseMessage("Update Permission by id")
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @ResponseMessage("Soft Delete Permission by id")
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser ) {
    return this.permissionsService.remove(id, user);
  }
}
