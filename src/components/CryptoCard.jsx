import React from 'react';
import { formatPrice, formatVolume, formatPercentage, calculatePriceRange } from '../utils/formatters';
import { useRouter } from 'next/navigation';

const CryptoCard = React.memo(function CryptoCard({ crypto, index }) {
  const { low, high } = calculatePriceRange(crypto.price, crypto.change24h);
  const router = useRouter();

  const handleViewChart = () => {
    router.push(`/coin/${crypto.symbol.toLowerCase()}`);
  };

  return (
    <div 
      className={`bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 group opacity-0`}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
      }}
    >
      {/* Header with Icon and Name */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br from-gray-700 to-gray-600 transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-600">
            <img
              src={`https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`}
              alt={crypto.name}
              className="w-8 h-8"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center text-white font-bold text-sm hidden">
              {crypto.symbol.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {crypto.name}
            </h3>
            <p className="text-sm text-gray-400 font-medium">{crypto.symbol}</p>
          </div>
        </div>

        {/* Rank Badge */}
        <div className="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
          #{index + 1}
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-4">
        <div className="text-2xl font-medium text-white mb-1">
          {formatPrice(crypto.price)}
        </div>
        <div className="flex items-center">
          <div className={`flex items-center text-sm px-2 py-1 rounded-full ${
            crypto.change24h >= 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            <svg className={`w-3 h-3 mr-1 ${crypto.change24h >= 0 ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {formatPercentage(crypto.change24h)}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-xl p-3">
          <div className="text-xs text-gray-400 font-medium mb-1">24h Volume</div>
          <div className="text-sm font-bold text-white">
            {formatVolume(crypto.volume24h)}
          </div>
        </div>
        <div className="bg-gray-700 rounded-xl p-3">
          <div className="text-xs text-gray-400 font-medium mb-1">Market Cap</div>
          <div className="text-sm font-bold text-white">
            {formatVolume(crypto.price * 1000000000)} {/* Estimated market cap */}
          </div>
        </div>
      </div>

      {/* Price Change Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">24h Range</span>
          <div className="flex items-center space-x-2">
            <span className="text-red-400 font-medium">
              {formatPrice(low)}
            </span>
            <div className="w-8 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full"></div>
            <span className="text-green-400 font-medium">
              {formatPrice(high)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-2">
        <button 
          onClick={handleViewChart}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-200 w-full"
        >
          View Chart
        </button>
      </div>
    </div>
  );
});

export default CryptoCard;
