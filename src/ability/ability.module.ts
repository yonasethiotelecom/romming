import { Module } from '@nestjs/common';


import { UsersService } from '@/users/users.service';
import { AbilityFactory } from './ability.factory';

@Module({
  providers: [UsersService, AbilityFactory],
  exports: [AbilityFactory],
})
export class AbilityModule {}
