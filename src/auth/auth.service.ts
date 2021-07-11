
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async validateUser(email: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user) return user;
        return null;
    }
}