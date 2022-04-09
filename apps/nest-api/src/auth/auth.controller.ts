import { Controller, Body, Post, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterUserDto, LoginUserDto } from './dto/auth.dto';
import { UserID } from '../user/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  sign_up(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @Post('sign-in')
  sign_in(@Body() body: LoginUserDto) {
    return this.authService.login(body.email, body.password);
  }

  @Delete('sign-out')
  @UseGuards(AuthGuard)
  sign_out(@UserID() userID) {
    return this.authService.logout(userID);
  }

}
