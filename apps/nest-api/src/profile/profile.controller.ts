import { Controller, UseGuards, Body, Get, Patch, UseInterceptors, UploadedFile, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { UpdateProfileInfoDto, updateProfilePasswordDto } from './dto/profile.dto';

@Controller('account')
@UseGuards(AuthGuard("jwt"))
export class ProfileController {

  constructor ( private profileService: ProfileService ) {}

  @Get('info')
  @HttpCode(HttpStatus.FOUND)
  get_user_info(@Req() req) {
    return this.profileService.getProfile(req.user["id"]);
  }

  @Patch('update-info')
  @HttpCode(HttpStatus.CREATED)
  update_user_info(@Body() body: UpdateProfileInfoDto, @Req() req) {
    return this.profileService.updateProfile(body.username, body.email, req.user["id"])
  }

  @Patch('update-photo')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  update_user_photo(@UploadedFile() file, @Req() req) {
    return this.profileService.updateProfilePhoto(file, req.user["id"]);
  }

  @Patch('update-password')
  @HttpCode(HttpStatus.CREATED)
  update_user_password(@Body() body: updateProfilePasswordDto, @Req() req) {
    return this.profileService.updateProfilePassword(body.currentPassword, body.password, req.user["id"]);
  }
}