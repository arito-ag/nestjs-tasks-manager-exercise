import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entitites/transaction.entity';
import { Repository } from 'typeorm';
import { TRANSACTION_TYPES } from './constants/types';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  create(type: string, description: string, userId: number) {
    const validateType = this.findTypeInConstant(type);

    if (!validateType)
      throw new BadRequestException(`Transaction Type ${type} not allowed`);

    const newTransaction = this.transactionRepository.create({
      type,
      description,
      userId,
    });

    return this.transactionRepository.save(newTransaction);
  }

  private findTypeInConstant(type: string): boolean {
    const keysUser = Object.values(TRANSACTION_TYPES.USER);
    const keysTask = Object.values(TRANSACTION_TYPES.TASK.COMPLETED);
    const keysTaskError = Object.values(TRANSACTION_TYPES.TASK.ERROR);

    const isValidUserTransaction = keysUser.includes(type);
    const isValidTaskTransaction = keysTask.includes(type);
    const isValidTaskErrorTransaction = keysTaskError.includes(type);

    return isValidUserTransaction
      ? isValidUserTransaction
      : isValidTaskTransaction
        ? isValidTaskTransaction
        : isValidTaskErrorTransaction;
  }
}
