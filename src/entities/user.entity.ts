import { Field, ID } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from './file.entity';
import { Folder } from './folder.entity';
import { AccessList } from './accessList.entity';

@Entity()
export class User extends BaseEntity {
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

  @OneToMany(() => File, (file) => file.user)
  files: File[];

  @OneToMany(() => Folder, (folder) => folder.user)
  folders: Folder[];

  @OneToMany(() => AccessList, (accesList) => accesList.user)
  accesList: AccessList[];

  @OneToOne(() => Folder, (folder) => folder.id)
  rootFolderId: number;
}
