import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/dto/auth';
import { AuthService } from 'src/service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() registerBody: RegisterDto) {
    return this.authService.register(registerBody);
  }

  @Post('login')
  login(@Body() loginBody: LoginDto) {
    return this.authService.login({
      username: loginBody.username,
      password: loginBody.password,
    });
  }
}
