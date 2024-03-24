import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  // ToDo: Define STATUSES constants
  @Column({ nullable: false })
  status: string;

  @Column({ type: 'date', nullable: false })
  deadline: Date;

  @Column()
  comments: string;

  @Column()
  tags: string;

  // FILE PATH FROM BUCKET
  @Column()
  file: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
