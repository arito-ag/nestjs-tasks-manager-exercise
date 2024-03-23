import { User } from 'src/auth/user.entity';
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

  @Column({ nullable: true })
  comments: string;

  @Column({ nullable: true })
  tags: string;

  // FILE PATH FROM BUCKET
  @Column({ nullable: true })
  file: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
