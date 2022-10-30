import { Injectable } from '@nestjs/common';
import { User } from './user';
import { Role } from "./entities/role.enum";

@Injectable()
export class UserService {
   private users: User[] = [
       new User(1, "admin", "admin", [Role.LECTURA,Role.SOLOLECTURA, Role.ESCRITURA, Role.BORRADO ]),
       new User(2, "user1", "user1", [Role.LECTURA]),
       new User(3, "user2", "user2", [Role.SOLOLECTURA]),
       new User(4, "user3", "user3", [Role.ESCRITURA]),
       new User(5, "user4", "user4", [Role.BORRADO])
   ];

   async findOne(username: string): Promise<User | undefined> {
       return this.users.find(user => user.username === username);
   }

   async findById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
}
}