import { Controller, Delete, Get } from '@nestjs/common';

@Controller('user')
export class UserController {

  @Get()
  findAll(): string {
    return 'This action will return all a users';
  }

  @Get("/by-id")
  findById(): string {
    return 'This action will delete a user by id!'
  }
}
