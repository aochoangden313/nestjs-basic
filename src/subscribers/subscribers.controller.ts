import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/user.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Post()
  @ResponseMessage("Create a new Subscriber")
  create(
    @Body() createSubscriberDto: CreateSubscriberDto,
    @User() user: IUser
  ) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Get()
  @ResponseMessage("Fetch List Subscriber with pagination")
  findAll(
    @Query("current") currentPage: string, //const currentPage:string = req.query.page;
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage("Fetch Subscriber by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @ResponseMessage("Update Subscriber by id")
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser
  ) {
    return this.subscribersService.update(id, updateSubscriberDto, user);
  }

    @ResponseMessage("Soft Delete Subscriber by id")
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.subscribersService.remove(id, user);
  }
}
