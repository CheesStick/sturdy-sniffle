import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserProvider } from '../user/user';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

  constructor ( private user: UserProvider) {}

  private token = (id) => jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' })

  async register(body) {
    try {
      const user: User = await this.user.createUser(body);
      return { success: true, token: this.token(user.id) };
    } catch (err) {
      if ( err.code === 'P2002' ) err.message = 'email or username has already been taken';
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }

  }

  async login(email, password) {
    try {
      const user: User = await this.user.findUserByEmail(email) ;
      const auth = await bcrypt.compare(password, user.password);
      if ( user && auth ) {
        return { success: true, token: this.token(user.id) }
      }
      throw new HttpException('incorrect password', HttpStatus.BAD_REQUEST)
    } catch (err) {
      return err;
    }
  }

  async logout(userID)  {
    return this.user.findUserByID(userID)
      .then( (user) => ({ success: true }))
      .catch( (err) => ({ success: false }) );
  }

}
