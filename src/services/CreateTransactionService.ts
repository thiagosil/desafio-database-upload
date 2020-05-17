import { getRepository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    let categoryEntity = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryEntity) {
      categoryEntity = categoryRepository.create({ title: category });

      await categoryRepository.save(categoryEntity);
    }
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const currentBalance = await transactionsRepository.getBalance();

      if (value > currentBalance.total) {
        throw new AppError('Balance should be greater then the outcome');
      }
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryEntity.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
