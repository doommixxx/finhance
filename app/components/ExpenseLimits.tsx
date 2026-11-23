'use client';

import { useState, type FormEvent } from 'react';
import { expenseLimitPeriodKey, expenseLimitsStorageKey, validateExpenseLimit } from '../expenseLimits';
import { useLocalStorageArray } from '../hooks/useLocalStorage';
import { transactionCategories } from '../transactionCategories';
import type { ExpenseLimit } from '../types';

type LimitForm = Omit<ExpenseLimit, 'id' | 'year' | 'amount'> & {
  id?: number;
  year: string;
  amount: string;
};

const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long', timeZone: 'UTC' });
const monthNames = Array.from({ length: 12 }, (_, month) =>
  monthFormatter.format(Date.UTC(2000, month, 1))
);

export default function ExpenseLimits({ isDarkTheme }: { isDarkTheme: boolean }) {
  const { items, addItem, updateItem, removeItem } = useLocalStorageArray<ExpenseLimit>(expenseLimitsStorageKey);
  const [form, setForm] = useState<LimitForm | null>(null);
  const [error, setError] = useState('');

  const muted = isDarkTheme ? 'text-gray-400' : 'text-gray-600';
  const border = isDarkTheme ? 'border-gray-700' : 'border-gray-200';
  const field = `mt-1 w-full rounded-xl border px-3 py-2.5 ${border} ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`;
  const action = 'rounded-xl px-4 py-2 text-sm font-semibold';
  const primaryAction = `${action} bg-yellow-400 text-gray-900 hover:bg-yellow-300`;
  const secondaryAction = `${action} border ${border} ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`;
  const sortedLimits = [...items].sort((a, b) =>
    b.year - a.year || b.month - a.month || a.category.localeCompare(b.category, 'ru')
  );

  function startAdding() {
    const now = new Date();
    setForm({ category: transactionCategories[0], month: now.getMonth() + 1, year: String(now.getFullYear()), amount: '' });
    setError('');
  }

  function startEditing(limit: ExpenseLimit) {
    setForm({ ...limit, year: String(limit.year), amount: String(limit.amount) });
    setError('');
  }

  function closeForm() {
    setForm(null);
    setError('');
  }

  function saveLimit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    const limit = { category: form.category, month: form.month, year: Number(form.year), amount: Number(form.amount) };
    const validationError = validateExpenseLimit(limit);
    if (validationError) {
      setError(validationError);
      return;
    }

    const period = expenseLimitPeriodKey(limit);
    if (items.some(item => item.id !== form.id && expenseLimitPeriodKey(item) === period)) {
      setError('На эту категорию уже есть лимит в выбранном месяце.');
      return;
    }

    if (form.id === undefined) {
      addItem(limit);
    } else {
      updateItem(form.id, limit);
    }
    closeForm();
  }

  return (
    <section aria-labelledby="expense-limits-title" className={`dashboard-card space-y-5 rounded-3xl p-6 shadow-lg md:p-8 ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="expense-limits-title" className="text-xl font-bold">Лимиты расходов</h3>
        {form === null && (
          <button type="button" className={primaryAction} onClick={startAdding}>Добавить лимит</button>
        )}
      </div>

      {form && (
        <form onSubmit={saveLimit} noValidate aria-label={form.id === undefined ? 'Новый лимит расходов' : 'Редактирование лимита расходов'} className={`space-y-4 rounded-2xl border p-4 ${border}`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-medium">
              Категория
              <select className={field} value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>
                {transactionCategories.map(category => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium">
              Месяц
              <select className={field} value={form.month} onChange={event => setForm({ ...form, month: Number(event.target.value) })}>
                {monthNames.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium">
              Год
              <input className={field} type="number" inputMode="numeric" min="1" max="9999" step="1" required value={form.year} onChange={event => setForm({ ...form, year: event.target.value })} />
            </label>
            <label className="text-sm font-medium">
              Сумма, ₽
              <input className={field} type="number" inputMode="decimal" step="any" required value={form.amount} onChange={event => setForm({ ...form, amount: event.target.value })} />
            </label>
          </div>
          {error && <p role="alert" className={`text-sm ${isDarkTheme ? 'text-red-300' : 'text-red-700'}`}>{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" className={primaryAction}>Сохранить лимит</button>
            <button type="button" className={secondaryAction} onClick={closeForm}>Отмена</button>
          </div>
        </form>
      )}

      {sortedLimits.length === 0 ? (
        <p className={`text-sm ${muted}`}>Лимиты пока не заданы.</p>
      ) : (
        <ul className="space-y-2">
          {sortedLimits.map(limit => (
            <li key={limit.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${border}`}>
              <div>
                <p className="font-semibold">{limit.category} · {limit.amount.toLocaleString('ru-RU', { maximumSignificantDigits: 16 })} ₽</p>
                <p className={`text-sm ${muted}`}>{monthNames[limit.month - 1]} {limit.year}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={secondaryAction} onClick={() => startEditing(limit)}>Изменить</button>
                <button type="button" className={`${secondaryAction} ${isDarkTheme ? 'text-red-300' : 'text-red-700'}`} onClick={() => {
                  removeItem(limit.id);
                  if (form?.id === limit.id) closeForm();
                }}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
