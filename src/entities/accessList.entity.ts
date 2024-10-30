import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Field, ID } from '@nestjs/graphql';
import { AccessEnum } from 'src/enums/access.enum';
import { Folder } from './folder.entity';
import { File } from './file.entity';

@Entity()
export class AccessList extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'A unique identifier for log' })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int')
  userId: number;

  @ManyToOne(() => User, (user) => user.accesList)
  user: User;

  @Column('int', { nullable: true })
  fileId: number;

  @ManyToOne(() => User, (user) => user.accesList, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  file: File;

  @Column('int', { nullable: true })
  folderId: number;

  @ManyToOne(() => User, (user) => user.accesList, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  folder: Folder;

  @Column({ type: 'enum', enum: AccessEnum, default: AccessEnum.VIEW })
  accessType: string;

  @Column('varchar', { nullable: true })
  path?: string;

  @Column('int', { nullable: true })
  parentAccessFolderId: number;
}
