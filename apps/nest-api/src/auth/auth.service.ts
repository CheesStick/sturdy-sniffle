import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ProfileProvider } from '../profile/profile';
import { Profile } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthProvider } from './auth';
import { MailService } from '../email/mail.service';

@Injectable()
export class AuthService {

  constructor ( 
    private readonly profile: ProfileProvider, 
    private readonly auth: AuthProvider,
    private readonly mail: MailService ) {}

  private token = (id) => jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' })

  async register(body) {
    try {
      const profile: Profile = await this.profile.createProfile(body);
      return { success: true, token: this.token(profile.id) };
    } catch (err) {
      if ( err.code === 'P2002' ) err.message = 'email or username has already been taken';
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }

  }

  async login(body) {
    try {
      const profile: Profile = await this.profile.findProfileByEmail(body.email) ;
      if ( profile ) {
        const auth = await bcrypt.compare(body.password, profile.password);
        if (auth) {
          return { success: true, token: this.token(profile.id) }
        }
      } throw new HttpException('incorrect password', HttpStatus.BAD_REQUEST)
    } catch (err) {
      return err;
    }
  }

  logout(profileID)  {
    return this.profile.findProfileByID(profileID)
      .then( (profile: Profile) => ({ success: true }))
      .catch( (err) => ({ success: false }) );
  }

  async forgotPassword(email) {
    try {
      const profile: Profile = await this.profile.findProfileByEmail(email);
      if (!profile) throw new HttpException('There is no user with such user email', HttpStatus.BAD_REQUEST);
      const resetToken = await this.auth.createPasswordResetToken(profile);
      await this.mail.sendMail(profile.email, profile.username, resetToken);
      return { success: true };
    } catch (err) {
      return err;
    }
  }

  async resetPassword(password, token) {
    try {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const profile: Profile = await this.profile.findProfileByResetToken(hashedToken);
      if ( !profile && token !== hashedToken && profile.password_reset_expires < Date.now() ) throw new HttpException('token has expired', HttpStatus.BAD_REQUEST);
      profile.password = await bcrypt.hash(password, 10);
      profile.password_changed_at = Date.now();
      await this.profile.updateProfile(profile, profile.id);
      return { success: true, token: this.token(profile.id) };
    } catch (err) {
      return err;
    }
  }

}