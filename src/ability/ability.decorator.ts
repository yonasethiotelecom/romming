import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from './ability.factory';


export interface RequiredRule {
  action: Action;
  subject: Subjects | string;
}
export const CHECK_ABILITY = 'chack_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);

export class userAblility implements RequiredRule {
  action = Action.Manage;
  subject = 'User';
}

export class adminAblility implements RequiredRule {
  action = Action.Manage;
  subject = 'Administrator';
}
