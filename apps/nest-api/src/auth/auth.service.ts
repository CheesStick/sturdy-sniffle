import { Injectable, ForbiddenException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ProfileProvider } from '../profile/profile';
import { Profile } from '@prisma/client';
import { AuthProvider } from './auth';
import { MailService } from '../email/mail.service';

@Injectable()
export class AuthService {

  constructor ( 
    private readonly profile: ProfileProvider, 
    private readonly auth: AuthProvider,
    private readonly mail: MailService ) {}

  async register(body) {
    try {
      const profile: Profile = await this.profile.createProfile(body);
      const tokens = await this.auth.token(profile.id);
      const hashedToken = await this.auth.hashData(tokens.refresh_token);
      await this.profile.updateProfile({ hashed_refresh_token: hashedToken }, profile.id);
      return tokens;
    } catch (err) {
      if ( err.code === 'P2002' ) err.message = 'email or username has already been taken';
      throw new BadRequestException(err.message);
    }

  }

  async login(body) {
    const profile: Profile = await this.profile.findProfileByEmail(body.email) ;
    if ( profile ) {
      const auth = await this.auth.compareData(body.password, profile.password);
      if (auth) {
        const tokens = await this.auth.token(profile.id);
        const hashedToken = await this.auth.hashData(tokens.refresh_token);
        await this.profile.updateProfile({ hashed_refresh_token: hashedToken }, profile.id);
        return tokens;
      }
    } throw new ForbiddenException;
  }

  async logout(profileID)  {
    await this.profile.updateProfile({ hashed_refresh_token: '' }, profileID);
    return profileID;
  }

  async refreshToken(rt, profileID) {
    const profile: Profile = await this.profile.findProfileByID(profileID);
    if ( profile ) {
      const auth: boolean = await this.auth.compareData(rt, profile.hashed_refresh_token);
      if ( auth ) {
        const tokens = await this.auth.token(profile.id);
        const hashedRToken = await this.auth.hashData(tokens.refresh_token);
        await this.profile.updateProfile({ hashed_refresh_token: hashedRToken }, profileID);
        return tokens;
      }
    } throw new UnauthorizedException;
  }

  async forgotPassword(email) {
    const profile: Profile = await this.profile.findProfileByEmail(email);
    if (!profile) throw new BadRequestException('There is no user with such user email');
    const resetToken = await this.auth.createPasswordResetToken(profile);
    await this.mail.sendMail(profile.email, profile.username, resetToken);
  }

  async resetPassword(token) {
    const hashedToken = this.auth.hashData(token);
    const profile: Profile = await this.profile.findProfileByResetToken(hashedToken);
    if ( !profile && token !== hashedToken && profile.password_reset_expires < Date.now() ) throw new ForbiddenException;
    const tokens = await this.auth.token(profile.id);
    profile.password_changed_at = Date.now();
    profile.hashed_refresh_token = await this.auth.hashData(tokens.refresh_token);
    await this.profile.updateProfile(profile, profile.id);
    return tokens;
  }

}