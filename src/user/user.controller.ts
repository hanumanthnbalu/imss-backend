import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/role.enum';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findAll(@Query() query): Promise<User[]> {
    return this.userService.findAll(query);
  }


  @Get(':id')
  findOne(@Param('id') id): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  create(@Body() CreateUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(CreateUserDto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req)
    return req.user;
  }

  @Post('login')
  login(@Body() user: User): Promise<User> {
    return this.userService.login(user);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  delete(@Param('id') id): Promise<User> {
    return this.userService.delete(id);
  }

  @Put(':id')
  @Roles(Role.Admin)
  update(@Body() updateUserDto: CreateUserDto, @Param('id') id): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }
}
