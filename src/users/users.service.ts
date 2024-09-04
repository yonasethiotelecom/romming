import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-roll.dto';
import { ChangeDto } from './dto/change-user.dto';
import { ChangePassDto } from './dto/change-user-pass.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async createRole(createRoleDto: CreateRoleDto) {
    const { subject, action, ...roleData } = createRoleDto;

    const role = await this.prisma.role.create({
      data: {
        ...roleData,
        abilities: {
          connectOrCreate: {
            where: { subject },
            create: { subject, action },
          },
        },
      },
      include: {
        abilities: true,
      },
    });

    return role;
  }

  async findrole(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        abilities: true,
      },
    });
    return role;
  }

  async findOneWithUserName(userName: string) {
    console.log('#######################' + userName);
    console.log(
      await this.prisma.user.findUnique({ where: { empId: userName } }),
    );
    return await this.prisma.user.findUnique({ where: { empId: userName } });
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const { password: _, ...result } = user;
    return result;
    return 'This action adds a new user';
  }

  async change(changeDto: ChangeDto) {
    const { empId, password } = changeDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.update({
      where: {
        empId: empId,
      },
      data: {
        password: hashedPassword,
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async changePass(changePassDto: ChangePassDto, data) {
    const { oldPassword, newPassword } = changePassDto;
    const hashedPasswor = await bcrypt.hash(newPassword, 10);
    const user = await this.findOneWithUserName(data.empId);
    console.log('-----------------' + user);
    if (await bcrypt.compare(oldPassword, user.password)) {
      const update = await this.prisma.user.update({
        where: {
          empId: user.empId,
        },
        data: {
          password: hashedPasswor,
        },
      });

      const { password, createdAt, updatedAt, ...result } = update;

      return result;
    }

    throw new BadRequestException('the old password is not right');
  }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
