import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/user.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage("Create a new Job")
  create(
    @Body() createJobDto: CreateJobDto,
    @User() user: IUser
  ) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch List Job with pagination")
  findAll(
    @Query("current") currentPage: string, //const currentPage:string = req.query.page;
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage("Fetch Job by id")
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @ResponseMessage("Update Job by id")
  @Patch(':id')
  update(
      @Param('id') id: string,
      @Body() updateJobDto: UpdateJobDto,
      @User() user: IUser
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @ResponseMessage("Soft Delete Job by id")
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.jobsService.remove(id, user);
  }
}
