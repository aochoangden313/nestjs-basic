import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

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
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Public()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile1')
  getProfile1(@Request() req) {
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

}
