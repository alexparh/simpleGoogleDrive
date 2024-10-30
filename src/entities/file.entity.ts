import {
  AfterLoad,
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
import { AccessList } from './accessList.entity';
import config from '../config';
import { Exclude } from 'class-transformer';

const {
  storage: { tempFolder },
  system: { host },
} = config();

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

  @Column('varchar')
  @Exclude()
  publicHash: string;

  publicUrl: string;

  @Column('varchar')
  path: string;

  @ManyToOne(() => User, (user) => user.files)
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.files, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  folder: Folder;

  @OneToMany(() => AccessList, (accesList) => accesList.file, { cascade: true })
  accesList: AccessList[];

  @AfterLoad()
  private setPublicUrl() {
    this.publicUrl = `${host}/${tempFolder}/${this.publicHash}`;
  }
}
