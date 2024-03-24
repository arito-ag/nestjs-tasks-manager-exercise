import { Task } from 'src/tasks/entities/task.entity';
import { Transaction } from 'src/transactions/entitites/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
