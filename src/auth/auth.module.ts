import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  //khi nhan vao API /stateless/login de biet chay vao passport thi phai import module passport vào 
  // Nói vs JWT tao muốn đăng nhập bằng Json web token hay mật khẩu, thì phải import Local Strategy
  imports: [UsersModule, PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),

  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {}
