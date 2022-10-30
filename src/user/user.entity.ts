import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class UserEntity {

 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 username: string;
 
 @Column()
 password: string;

 @Column()
 roles: string[]
}
