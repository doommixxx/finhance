import { transactionCategories } from './transactionCategories';
import type { ExpenseLimit } from './types';

export const expenseLimitsStorageKey = 'finhance-expense-limits';

export function expenseLimitPeriodKey({ category, month, year }: Omit<ExpenseLimit, 'id' | 'amount'>) {
  return `${year}-${month}-${category}`;
}

export function validateExpenseLimit({ category, month, year, amount }: Omit<ExpenseLimit, 'id'>) {
  if (!transactionCategories.includes(category)) {
    return 'Выберите категорию.';
  }
  if (!Number.isInteger(month) || month < 1 || month > 12 ||
      !Number.isInteger(year) || year < 1 || year > 9999) {
    return 'Укажите месяц и год от 1 до 9999.';
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Введите сумму больше нуля.';
  }
  return null;
}

export function isExpenseLimitBackup(value: unknown): value is ExpenseLimit[] {
  if (!Array.isArray(value)) return false;

  const ids = new Set<number>();
  const periods = new Set<string>();
  return value.every(limit => {
    if (!limit || !Number.isFinite(limit.id) || validateExpenseLimit(limit)) return false;
    const period = expenseLimitPeriodKey(limit);
    if (ids.has(limit.id) || periods.has(period)) return false;
    ids.add(limit.id);
    periods.add(period);
    return true;
  });
}
