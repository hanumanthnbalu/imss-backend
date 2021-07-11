import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './schemas/user.schema';

import { LocalStrategy } from '../auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule,
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '30m' },
  }),
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy,
    //   {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // }
  ],
  exports: [UserService, JwtModule],
})
export class UserModule { }
