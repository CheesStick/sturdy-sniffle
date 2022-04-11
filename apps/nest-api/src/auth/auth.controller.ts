import { Controller, Body, Post, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterProfileDto, LoginProfileDto } from './dto/auth.dto';
import { ProfileID } from '../profile/profile.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  sign_up(@Body() body: RegisterProfileDto) {
    return this.authService.register(body);
  }

  @Post('sign-in')
  sign_in(@Body() body: LoginProfileDto) {
    return this.authService.login(body);
  }

  @Delete('sign-out')
  @UseGuards(AuthGuard)
  sign_out(@ProfileID() profileID) {
    return this.authService.logout(profileID);
  }

  @Post('forgot-password')
  forgot_password(@Body() body) {
    return this.authService.forgotPassword(body.email)
  }

  @Post('reset-password')
  reset_password(@Body() body, @Query() { token }) {
    return this.authService.resetPassword(body.password, token);
  }

}
