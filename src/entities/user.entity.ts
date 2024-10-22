import { Field, ID } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Files } from './file.entity';
import { Folders } from './folder.entity';
import { AccessList } from './accessList.entity';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'A unique identifier for the user' })
  id: number;

  @Column('varchar')
  @Exclude()
  email: string;

  @Column('varchar', { nullable: true })
  @Exclude()
  refreshToken: string;

  @CreateDateColumn()
  @Field({ description: 'The date this user was created' })
  createdAt: Date;

  @OneToMany(() => Files, (file) => file.user)
  files: Files[];

  @OneToMany(() => Files, (folder) => folder.user)
  folders: Folders[];

  @OneToMany(() => AccessList, (accesList) => accesList.user)
  accesList: AccessList[];
}
