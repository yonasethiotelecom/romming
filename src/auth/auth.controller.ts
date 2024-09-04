import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

import { Public } from 'src/public.decorator';
import { LdapAuthGuard } from './guards/ldap-auth.guard';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { CreateRoleDto } from '@/users/dto/create-roll.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ChangeDto } from '@/users/dto/change-user.dto';
import { ChangePassDto } from '@/users/dto/change-user-pass.dto';
import {
  adminAblility,
  CheckAbilities,
  userAblility,
} from '@/ability/ability.decorator';
import { AbilitiesGuard } from '@/ability/abilities.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  //@UsePipes(new ZodValidationPipe(LoginDto))
  // @UseGuards(LdapAuthGuard)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('evvvvvvvvvvvvv' + process.env.jwt_secret);
    return await this.authService.login(req.user);

    //  return req.user;
  }
  //@Public()
  @Post('register')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new adminAblility())
  async registerUser(@Body() createUserDto: CreateUserDto) {
    console.log('yon-----------------' + createUserDto);
    return await this.userService.create(createUserDto);
  }

  @Post('change')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new adminAblility())
  async registerChange(@Body() changeDto: ChangeDto) {
    return await this.userService.change(changeDto);
  }

  @Post('changePass')
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new userAblility())
  async registerChangePass(
    @Body() changePassDto: ChangePassDto,
    @Request() req,
  ) {
    console.log('evvvvvvvvvvvvv');
    return await this.userService.changePass(changePassDto, req.user);
  }

  @Public()
  @Post('role')
  async registerRoll(@Body() createRoleDto: CreateRoleDto) {
    console.log('yon-----------------' + createRoleDto);
    return await this.userService.createRole(createRoleDto);
  }
  @Public()
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refrshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
