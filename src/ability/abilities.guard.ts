import { ForbiddenError } from '@casl/ability';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UsersService } from '@/users/users.service';
import { AbilityFactory } from './ability.factory';
import { CHECK_ABILITY, RequiredRule } from './ability.decorator';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private canAbilityFactory: AbilityFactory,

    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const { user } = context.switchToHttp().getRequest();
    console.log('))))))))))))))))))' + JSON.stringify(user, null, 2));
    //const userRole = await this.userService.findOne(user.id);

    const role = await this.userService.findrole(user.roleId);
    console.log(JSON.stringify(role));

    const ability = this.canAbilityFactory.defineAbility(role);

    console.log('ability' + ability);

    try {
      rules.forEach((rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
      );
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
