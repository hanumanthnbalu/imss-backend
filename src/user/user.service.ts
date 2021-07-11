import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import config from '../config/keys';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>, private jwtService: JwtService) { }

  async findAll(condition): Promise<User[]> {
    const users = await this.userModel.find(condition);
    if (!users.length) {
      throw new NotFoundException('No users registered yet.');
    }
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async create(user: User): Promise<User> {
    console.log(user)
    const userExist = await this.userModel.findOne({ email: user.email });
    if (userExist) {
      throw new BadRequestException('User already exist.');
    }
    user.role = 'DEVELOPER';
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async login(user: User): Promise<User> {
    const userExist: User = await this.userModel.findOne({ email: user.email });
    if (!userExist) {
      throw new NotFoundException('User not registered.');
    }
    const payload = { name: userExist.name, email: userExist.email, role: userExist.role }
    const token: any = this.jwtService.sign(payload);
    const data: any = {
      user: userExist,
      token: token
    }
    return data;
  }

  async delete(id: string): Promise<User> {
    this.findOne(id);
    return await this.userModel.findByIdAndRemove(id);
  }

  async update(id: string, user: User): Promise<User> {
    this.findOne(id);
    return await this.userModel.findByIdAndUpdate(id, user, { new: true });
  }
}
