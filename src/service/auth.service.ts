import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

// 일반적으로는 환경변수 또는 원격 키 서버에서 가져옴
const JWT_SECRET = 'secret';

@Injectable()
export class AuthService {
  private users: { username: string; password: string }[] = [];

  register(registerBody: { username: string; password: string }) {
    const user = this.users.find(
      (user) => user.username === registerBody.username,
    );

    if (user) {
      throw new HttpException('User Already Exist', HttpStatus.BAD_REQUEST);
    }

    this.users.push({
      username: registerBody.username,
      password: crypto
        .createHash('md5')
        .update(registerBody.password)
        .digest('hex'),
    });

    return {
      username: registerBody.username,
    };
  }

  login(loginBody: { username: string; password: string }) {
    const user = this.users.find(
      (user) => user.username === loginBody.username,
    );

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const hashedPassword = crypto
      .createHash('md5')
      .update(loginBody.password)
      .digest('hex');

    if (user.password !== hashedPassword) {
      throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
    }

    const accessToken = jwt.sign({ username: user.username }, JWT_SECRET);

    return {
      accessToken,
    };
  }
}
