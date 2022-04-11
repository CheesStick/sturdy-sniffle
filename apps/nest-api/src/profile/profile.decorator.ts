import { createParamDecorator, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import jwt from 'jsonwebtoken';

export const ProfileID = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.token || req.body.token;

    return jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) throw new UnauthorizedException;
      return decoded.id;
    })
    
  }
);