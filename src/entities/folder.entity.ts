import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Field, ID } from '@nestjs/graphql';

@Entity()
export class Folders extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'A unique identifier for log' })
  id: number;

  @Column('int')
  folderId: number;

  @Column('varchar')
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int')
  userId: number;

  @Column('varchar')
  path: string;

  @ManyToOne(() => Users, (user) => user.folders)
  user: Users;

  @ManyToOne(() => Folders, (folder) => folder.folder)
  folder: Folders;
}
