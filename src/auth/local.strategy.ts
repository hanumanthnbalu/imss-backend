import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/interfaces/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super();
    }

    async validate(user: User): Promise<any> {
        const checkUser = await this.userService.login(user);
        if (!checkUser) {
            throw new UnauthorizedException();
        }
        return checkUser;
    }
}