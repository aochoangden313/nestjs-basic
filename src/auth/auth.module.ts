import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import * as ms from 'ms';
import { AuthController } from './auth.controller';

@Module({
  //khi nhan vao API /stateless/login de biet chay vao passport thi phai import module passport vào 
  // Nói vs JWT tao muốn đăng nhập bằng Json web token hay mật khẩu, thì phải import Local Strategy
  imports: [UsersModule, PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
            expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRE') as ms.StringValue)/1000,
        },
      }),
      inject: [ConfigService],
    }),

  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
