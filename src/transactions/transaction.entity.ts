import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  // ToDo: Relation with User
  /**
   * @ManyToOne()
   */

  // ToDo: Define MOVEMENTS constants
  @Column({ nullable: false })
  movement: string;

  @Column()
  description: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
