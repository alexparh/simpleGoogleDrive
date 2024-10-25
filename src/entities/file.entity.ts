import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Folder } from './folder.entity';
import { Field, ID } from '@nestjs/graphql';
import { ViewEnum } from 'src/enums/view.enum';

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'A unique identifier for log' })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column('varchar')
  name: string;

  @Column('int')
  userId: number;

  @Column('int')
  folderId: number;

  @Column({ type: 'enum', enum: ViewEnum, default: ViewEnum.PRIVATE })
  viewType: string;

  @Column('varchar')
  path: string;

  @ManyToOne(() => User, (user) => user.files)
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.files, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  folder: Folder;
}
