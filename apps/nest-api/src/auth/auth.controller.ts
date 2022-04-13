import { Controller, Body, Post, Delete, UseGuards, Query, HttpCode, HttpStatus, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterProfileDto, LoginProfileDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  sign_up(@Body() body: RegisterProfileDto) {
    return this.authService.register(body);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  sign_in(@Body() body: LoginProfileDto) {
    return this.authService.login(body);
  }

  @Delete('sign-out')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  sign_out(@Req() req) {
    return this.authService.logout(req.user["id"]);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  refresh(@Headers() headers, @Req() req) {
    return this.authService.refreshToken(req.user["refreshToken"], req.user["id"]);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgot_password(@Body() body) {
    return this.authService.forgotPassword(body.email)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  reset_password(@Query() { token }) {
    return this.authService.resetPassword(token);
  }

}
