import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}
    
    //username và pass là 2 tham số thư viện passport sẽ ném về
    // khi sử dụng thư viện passport sẽ tự động chạy vào hàm này
    async validateUser(username: string, pass: string): Promise<any> {
        //nếu truyền vào email hợp lệ, sẽ lấy được thằng user
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                //Nếu tìm thấy thằng user và so sánh password/ hash password hợp lệ thì trả về user
                return user;
            }
        }
        return null;
      }
}
