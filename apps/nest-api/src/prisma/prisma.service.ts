import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { define, object, size, string } from 'superstruct';
import validator from 'validator';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  onModuleInit() {
    this.$use( async (params, next) => {
      if (params.action == 'create' && params.model == 'User') {
        const user = params.args.data;
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
        params.args.data = user;
      }
      return next(params);
    } )
  }

  email = () => define('email', (email: string) => validator.isEmail(email))

  updateUserInfo = object({
    username: size(string(), 8, 28),
    email: this.email()
  })

}
