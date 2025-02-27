import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { IUser } from 'src/users/user.interface';

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage("User login")
  handleLogin(
    @Req() req,
    @Res({ passthrough: true}) response: Response) {
    return this.authService.login(req.user, response);
  }

  // @UseGuards(JwtAuthGuard)
  @Public()
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile1')
  getProfile1(@Req() req) {
    return req.user;
  }

  // register new user
  @Public()
  @Post('/register')
  @ResponseMessage("Register user successfully!")
  async handeRegister(
    @Body() registerUserDto: RegisterUserDto
  ) {
    let newUser = await this.usersService.register(registerUserDto);
    return {
      _id: newUser?._id,
      createAt: newUser?.createdAt
    }
  }


  // refesher web browser
  @Get('/account')
  @ResponseMessage("Get user information")
  handleGetAccount(
    @User() user: IUser
  ) {
    return { user };
  }

}
