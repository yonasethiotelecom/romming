import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '@/users/users.service';
import * as bcrypt from 'bcrypt';

const EXPIRE_TIME = 20 * 1000;
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    console.log('-----------------');
    const user = await this.userService.findOneWithUserName(username);
    console.log('-----------------' + user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, createdAt, updatedAt, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.name,
      title: user.title,
      empId: user.empId,
      roleId: user.roleId,
    };

    return {
      user,
      backendTokens: {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async refreshToken(user: any) {
    const payload = {
      username: user.username,
      title: user.title,
      empId: user.empId,
      roleId: user.roleId,
    };

    return {
      backendTokens: {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }
}
