import { Controller, UseGuards, Body, Get, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '../auth/auth.guard';
import { ProfileService } from './profile.service';
import { ProfileID } from './profile.decorator';
import { UpdateProfileInfoDto, updateProfilePasswordDto } from './dto/profile.dto';

@Controller('account')
@UseGuards(AuthGuard)
export class ProfileController {

  constructor ( private profileService: ProfileService ) {}

  @Get('info')
  get_user_info(@ProfileID() profileID) {
    return this.profileService.getProfile(profileID);
  }

  @Patch('update-info')
  update_user_info(@Body() body: UpdateProfileInfoDto, @ProfileID() profileID) {
    return this.profileService.updateProfile(body.username, body.email, profileID)
  }

  @Patch('update-photo')
  @UseInterceptors(FileInterceptor('file'))
  update_user_photo(@UploadedFile() file, @ProfileID() profileID) {
    return this.profileService.updateProfilePhoto(file, profileID);
  }

  @Patch('update-password')
  update_user_password(@Body() body: updateProfilePasswordDto, @ProfileID() profileID) {
    return this.profileService.updateProfilePassword(body.currentPassword, body.password, profileID);
  }
}