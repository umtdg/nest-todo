import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  INACTIVE = 'INACTIVE',
}

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ default: '' })
  description!: string;

  @Column({ type: 'varchar', default: TaskStatus.TODO })
  status!: TaskStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany('TaskEntity', 'parentTask')
  subTasks!: TaskEntity[];

  @Column()
  assigneeId!: string;

  @ManyToOne('UserEntity', 'tasks')
  assignee!: UserEntity;

  @Column()
  parentTaskId!: string;

  @ManyToOne('TaskEntity', 'subTasks')
  parentTask!: TaskEntity;
}
