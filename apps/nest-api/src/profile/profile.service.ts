import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFileSync, unlink } from 'fs';
import sharp from 'sharp';
import bcrypt from 'bcrypt';
import { ProfileProvider } from './profile';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {

  constructor ( private readonly profile: ProfileProvider, private readonly prisma: PrismaService ) {}

  async getProfile(profileID) {
    try {
      const profile = await this.profile.findProfileByID( profileID );
      return { success: true, data: {
        username: profile.username,
        email: profile.email,
        image: readFileSync(`${ this.profile.path }/${ profile.profile_image }`)
      } };

    } catch (err) {
      throw new InternalServerErrorException;
    }
  } 

  async updateProfile(username, email, profileID) {
    try {

      const profile = await this.profile.updateProfile({ username, email }, profileID);
      return { success: true, data: {
        username: profile.username,
        email: profile.email
      } };

    } catch (err) {
      if ( err.code === 'P2002' ) err.meta.target = "email or username has already been taken";
      return err;
    }
  }

  async updateProfilePhoto(file, profileID) {
    try {
      
      const profile =  await this.profile.findProfileByID( profileID );
  
      if ( !file ) throw new HttpException('no data provided', HttpStatus.BAD_REQUEST);
      
      const filename = `${ profile.id }-${ Date.now() }.jpeg`;
        
      if ( profile.profile_image !== 'default.jpeg' ) {
        unlink(`${ this.profile.path }/${ profile.profile_image }`, (err) => {
          if ( err ) InternalServerErrorException;
        });
      }

      sharp(file.buffer)
        .resize(100)
        .jpeg()
        .toFile(`${ this.profile.path }/${ filename }`);

      await this.profile.updateProfile({ image: filename }, profileID);
      
      return { 
        success: true, 
        image: readFileSync(`${ this.profile.path }/${ filename }`)
      };

    } catch (err) {
      return err;
    }
  }

  async updateProfilePassword(currentPassword, password, profileID) {
    try {
      const profile = await this.profile.findProfileByID( profileID );
      const match = await bcrypt.compare(currentPassword, profile.password);
      if ( !match ) throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      password = await bcrypt.hash(password, 10);
      await this.profile.updateProfile({ password }, profileID);
      return true;
    } catch (err) {
      return err;
    }
  }

}
