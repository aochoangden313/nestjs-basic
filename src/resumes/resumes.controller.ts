import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage("Create a new resume")
  create(
    @Body() createUserCvDto: CreateUserCvDto,
    @User() user: IUser
  ) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Get()
  @ResponseMessage("Fetch List Resume with pagination")
  findAll(
    @Query("current") currentPage: string, //const currentPage:string = req.query.page;
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage("Fetch Resume by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @ResponseMessage("Update Resume by id")
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('status') status: string,
    @User() user: IUser
  ) {
    return this.resumesService.update(id, status, user);
  }

  @ResponseMessage("Soft Delete Resume by id")
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.resumesService.remove(id, user);
  }

  //find all CV by user
  @Post('by-user')
  @ResponseMessage("Get resume by user")
  getResumeByUser(@User() user: IUser) {
    return this.resumesService.findByUsers(user);
  }

}
