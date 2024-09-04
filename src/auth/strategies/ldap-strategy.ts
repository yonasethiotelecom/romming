import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as ldap from 'ldapjs';
import { AuthService } from '../auth.service';
import { PrismaService } from '@/prisma/prisma.service';

const LDAP_DOMAIN = 'ethio.local';
const LDAP_BASE_DN = 'DC=ethio,DC=local';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(
    private readonly prisma: PrismaService,
    private authService: AuthService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const client = ldap.createClient({
      url: 'ldap://172.22.186.7',
      tlsOptions: {
        rejectUnauthorized: false, // Skip TLS certificate verification
      },
    });

    const response = new Promise((resolve, reject) => {
      const [user] = username.toLocaleLowerCase().trim().split('@');
      const email = user.concat('@ethio.local');

      client.bind(email, password, async (err, _res) => {
        if (err) {
          client.unbind();
          console.log(err);
          reject(err);
        }
        let employeeId = null;
        const filter = `(sAMAccountName=${user})`;
        const opts: ldap.SearchOptions = {
          filter,
          scope: 'sub',
          attributes: ['*'],
        };
        client.search(LDAP_BASE_DN, opts, (err, res) => {
          if (err) {
            client.unbind();
            reject(err);
          }
          res.on('searchEntry', (entry) => {
            const employee = entry?.attributes.find(
              (attr) => attr.type === 'employeeID',
            );
            employeeId = entry;
          });
          res.on('error', (err) => {
            client.unbind();
            reject(err);
          });
          res.on('end', async (result) => {
            if (result.status !== 0) {
              client.unbind();
              reject(new NotFoundException('Invalid credential.'));
            }

            const user = employeeId;
            console.log('user' + user);
            const users = {
              title: user.attributes[3].values[0],
              name: user.attributes[1].values[0],
              empId: user.attributes[24].values[0],
            };

            console.log(
              'employee' +
                JSON.stringify(user.attributes[3].values[0]) +
                JSON.stringify(user.attributes[1].values[0]),
            );
            //const user = await this.authService.validateLdapUser(employeeId);

            if (!user) {
              client.unbind();
              reject(new NotFoundException('Invalid credential.'));
            }
            client.unbind(); // Terminate the LDAP connection

         /*    await this.prisma.user.upsert({
              where: { empId: users.empId }, // or any unique field
              update: users,
              create: users,
            }); */

            resolve(users);
          });
        });
      });
    });

    return await response;
  }
}
