import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Could not find transaction', 401);
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
