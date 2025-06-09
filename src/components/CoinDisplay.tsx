
import React from 'react';
import { Currency } from '../utils/currency';

interface CoinDisplayProps {
  currency: Currency;
  showAnimation?: boolean;
}

const CoinDisplay: React.FC<CoinDisplayProps> = ({ currency, showAnimation = false }) => {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full border border-yellow-300 ${showAnimation ? 'coin-bounce' : ''}`}>
      <span className="text-yellow-600 text-sm">💰</span>
      <span className="text-yellow-800 font-bold text-sm">{currency.coins}</span>
    </div>
  );
};

export default CoinDisplay;
