import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { CreateRolDto } from './dto/ability.dto';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<typeof CreateRolDto>
  | 'all'
  | 'User'
  | 'Administrator'
  | 'Gust';

@Injectable()
export class AbilityFactory {
  defineAbility(role: CreateRolDto) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    console.log('role' + role.abilities[0].action[0]);
    console.log('66666666' + role.jobRole);

    if (/* list.slice(1).includes(role.jobRole) */ role.jobRole != 'Gust') {
      role.abilities.forEach((userAbility: { subject: any; action: any }) => {
        const { subject, action } = userAbility;
        action.forEach((a: string | string[]) => can(a, subject));
      });
      can(Action.Read, 'all');
    } else {
      can(Action.Read, 'all');
      console.log('66666666' + role.jobRole); // read-only access to everything
      cannot(Action.Create, 'all').because(
        'your special message: only admins!!!',
      );
      cannot(Action.Delete, 'all').because("you just can't");
    }

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
