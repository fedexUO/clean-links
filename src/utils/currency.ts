
export interface Currency {
  coins: number;
}

export interface CoinTransaction {
  id: string;
  amount: number;
  reason: string;
  timestamp: string;
}

const STORAGE_KEY_CURRENCY = 'user-currency';
const STORAGE_KEY_TRANSACTIONS = 'coin-transactions';

export const loadCurrency = (): Currency => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CURRENCY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading currency:', error);
  }
  
  const defaultCurrency = { coins: 0 };
  saveCurrency(defaultCurrency);
  return defaultCurrency;
};

export const saveCurrency = (currency: Currency): void => {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENCY, JSON.stringify(currency));
  } catch (error) {
    console.error('Error saving currency:', error);
  }
};

export const addCoins = (amount: number, reason: string): Currency => {
  const currency = loadCurrency();
  currency.coins += amount;
  
  // Salva transazione
  const transaction: CoinTransaction = {
    id: Date.now().toString(),
    amount,
    reason,
    timestamp: new Date().toISOString()
  };
  
  const transactions = loadTransactions();
  transactions.unshift(transaction);
  saveTransactions(transactions.slice(0, 50)); // Mantieni solo le ultime 50
  
  saveCurrency(currency);
  return currency;
};

export const loadTransactions = (): CoinTransaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading transactions:', error);
  }
  return [];
};

export const saveTransactions = (transactions: CoinTransaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};
