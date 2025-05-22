import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import * as ms_lib from 'ms'; // Alias the import
import { Response } from 'express';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { use } from 'passport';



@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private rolesService: RolesService
    ) { }

    //username và pass là 2 tham số thư viện passport sẽ ném về
    // khi sử dụng thư viện passport sẽ tự động chạy vào hàm này
    async validateUser(username: string, pass: string): Promise<any> {
        //nếu truyền vào email hợp lệ, sẽ lấy được thằng user
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                const userRole = user.role as unknown as { _id: string, name: string };
                const temp = await this.rolesService.findOne(userRole._id) as any;

                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                }

                //Nếu tìm thấy thằng user và so sánh password/ hash password hợp lệ thì trả về user
                return objUser;
            }
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role,
            permissions
        };

        const refreshToken = this.createRefreshToken(payload);

        //update user with refresh token
        await this.usersService.updateUserToken(refreshToken, _id);

        //set refresh token as cookie
        response.cookie('refresh_token', refreshToken, {
            maxAge: ms_lib(this.configService.get<string>('JWT_REFRESH_EXPIRE') as ms.StringValue),
            httpOnly: true
        });

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions
            }
        };
    }

    createRefreshToken = (payload) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms_lib(this.configService.get<string>('JWT_REFRESH_EXPIRE') as ms.StringValue) / 1000
        });
        return refreshToken;
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            });

            let user = await this.usersService.findUserByToken(refreshToken);

            if (user) {
                //update refresh token
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };

                const refreshToken = this.createRefreshToken(payload);

                //update user with refresh token
                await this.usersService.updateUserToken(refreshToken, _id.toString());

                const userRole = user.role as unknown as { _id: string, name: string };
                const temp = await this.rolesService.findOne(userRole._id) as any;


                //clear old cookie and set refresh token as cookie
                response.clearCookie('refresh_token');
                response.cookie('refresh_token', refreshToken, {
                    maxAge: ms_lib(this.configService.get<string>('JWT_REFRESH_EXPIRE') as ms.StringValue),
                    httpOnly: true
                });

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role,
                        permissions: temp?.permissions ?? []
                    }
                };

            } else {
                throw new BadRequestException(`Refresh Token không hợp lệ. Vui lòng login`);
            }
        } catch (error) {
            throw new BadRequestException(`Refresh Token không hợp lệ. Vui lòng login`);

        }
    }

    logout = async (user: IUser, response: Response) => {

        this.usersService.updateUserToken("", user._id);
        response.clearCookie('refresh_token');
        return "Ok";
    }
}
