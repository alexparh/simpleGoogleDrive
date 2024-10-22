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
import { ViewEnum } from 'src/enums/view.enum';

@Entity()
export class Files extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'A unique identifier for log' })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column('varchar')
  name: string;

  @Column('int')
  userId: number;

  @Column({ type: 'enum', enum: ViewEnum })
  viewType: string;

  @Column('varchar')
  path: string;

  @ManyToOne(() => Users, (user) => user.files)
  user: Users;
}
