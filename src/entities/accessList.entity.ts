import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Field, ID } from '@nestjs/graphql';
import { AccessEnum } from 'src/enums/access.enum';

@Entity()
export class AccessList extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'A unique identifier for log' })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int')
  userId: number;

  @ManyToOne(() => Users, (user) => user.accesList)
  user: Users;

  @Column({ type: 'enum', enum: AccessEnum })
  accessType: string;

  @Column('varchar')
  path: string;
}
