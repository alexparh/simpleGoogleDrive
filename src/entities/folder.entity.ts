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
import { Field, ID } from '@nestjs/graphql';
import { File } from './file.entity';

@Entity()
export class Folder extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'A unique identifier for log' })
  id: number;

  @Column('int', { nullable: true })
  parentFolderId: number;

  @Column('varchar')
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int')
  userId: number;

  @Column('varchar')
  path: string;

  @OneToMany(() => File, (file) => file.folder, { cascade: true })
  files: File[];

  @ManyToOne(() => User, (user) => user.folders)
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.subfolders, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  parentFolder: Folder;

  @OneToMany(() => Folder, (folder) => folder.parentFolder, { cascade: true })
  subfolders: Folder[];
}
