import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';

@Module({
  //khi nhan vao API /stateless/login de biet chay vao passport thi phai import module passport vào 
  // Nói vs JWT tao muốn đăng nhập bằng Json web token hay mật khẩu, thì phải import Local Strategy
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
