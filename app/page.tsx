'use client';

import { useState } from 'react';
import Image from 'next/image';

const PRESETS = [
  { amount: 300, label: '$3', emoji: '☕' },
  { amount: 500, label: '$5', emoji: '☕☕' },
  { amount: 1000, label: '$10', emoji: '🍕' },
  { amount: 2500, label: '$25', emoji: '🎉' },
];

export default function CoffeePage() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getAmount = () => {
    if (customAmount) {
      return Math.round(parseFloat(customAmount) * 100);
    }
    return selectedAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const amount = getAmount();
    if (amount < 100) {
      setError('Minimum is $1');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // Redirect to Stripe
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-4xl">
            🟠
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2">Support Imajin</h1>
          
          {/* Bio */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Building sovereign infrastructure for identity, payments, and presence. 
            No VC funding. No subscriptions. Just building.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Presets */}
            <div className="grid grid-cols-2 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(preset.amount);
                    setCustomAmount('');
                  }}
                  className={`p-4 rounded-xl font-semibold transition-all ${
                    selectedAmount === preset.amount && !customAmount
                      ? 'bg-orange-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-2xl block mb-1">{preset.emoji}</span>
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || getAmount() < 100}
              className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Redirecting...' : `☕ Buy me a coffee`}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Powered by <a href="https://imajin.ai" className="text-orange-500 hover:underline">Imajin</a>
          {' · '} 
          No platform fees
        </p>
      </div>
    </main>
  );
}
