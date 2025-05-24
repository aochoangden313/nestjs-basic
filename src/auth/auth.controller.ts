import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { IUser } from 'src/users/user.interface';
import { request } from 'http';
import { Role } from 'src/roles/schemas/role.schemas';
import { RolesService } from 'src/roles/roles.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
    private roleService: RolesService,
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60) // 3 requests per minute
  @Post('/login')
  @ApiBody({ type: UserLoginDto, })
  @ResponseMessage("User login")
  handleLogin(
    @Req() req,
    @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  // refesher web browser
  @Post('/logout')
  @ResponseMessage("Logout user")
  handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.logout(user, response);
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
  async handleGetAccount(
    @User() user: IUser
  ) {
    const temp = await this.roleService.findOne(user.role._id) as any;
    user.permissions = temp.permissions;
    return { user };
  }

  // refesher web browser
  @Public()
  @Get('/refresh')
  @ResponseMessage("Get user by refresh token")
  handleRefreshToken(@Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const refreshToken = request.cookies["refresh_token"];
    return this.authService.processNewToken(refreshToken, response);
  }
}
