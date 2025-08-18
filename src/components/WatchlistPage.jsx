import React, { useState, useMemo } from 'react';
import CryptoCard from './CryptoCard';
import FavoriteButton from './FavoriteButton';
import LoadingSpinner from './LoadingSpinner';

const WatchlistPage = React.memo(function WatchlistPage({ 
  favorites, 
  cryptoData, 
  onToggleFavorite, 
  isFavorite,
  onClearAll,
  isLoading 
}) {
  const [sortBy, setSortBy] = useState('addedAt'); // Default sort by when added
  const [sortOrder, setSortOrder] = useState('desc');

  // Get crypto data for favorites
  const favoritesCryptoData = useMemo(() => {
    if (!favorites || !cryptoData) return [];
    
    return favorites.map(favorite => {
      const cryptoInfo = cryptoData.find(crypto => 
        crypto.symbol === favorite.symbol || 
        crypto.id === favorite.id
      );
      
      return cryptoInfo ? {
        ...cryptoInfo,
        addedAt: favorite.addedAt
      } : {
        ...favorite,
        price: 0,
        change24h: 0,
        volume24h: 0,
        isUnavailable: true
      };
    }).filter(Boolean);
  }, [favorites, cryptoData]);

  // Sort favorites
  const sortedFavorites = useMemo(() => {
    const sorted = [...favoritesCryptoData];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'change24h':
          comparison = a.change24h - b.change24h;
          break;
        case 'volume24h':
          comparison = a.volume24h - b.volume24h;
          break;
        case 'addedAt':
          comparison = new Date(a.addedAt) - new Date(b.addedAt);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [favoritesCryptoData, sortBy, sortOrder]);

  const sortOptions = [
    { value: 'addedAt', label: 'Date Added' },
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'change24h', label: '24h Change' },
    { value: 'volume24h', label: '24h Volume' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                ⭐ My Watchlist
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                {favorites.length === 0 
                  ? 'No favorites yet. Add cryptocurrencies to track them easily!'
                  : `Tracking ${favorites.length} ${favorites.length === 1 ? 'cryptocurrency' : 'cryptocurrencies'}`
                }
              </p>
            </div>
            
            {favorites.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors touch-manipulation"
                title="Clear all favorites"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-6xl sm:text-8xl mb-4">📊</div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
              Your watchlist is empty
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
              Start building your personal cryptocurrency watchlist by clicking the star icon on any coin you want to track.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors touch-manipulation"
            >
              <span className="mr-2">🏠</span>
              Browse Cryptocurrencies
            </a>
          </div>
        ) : (
          <>
            {/* Sort Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
              <div className="flex items-center gap-2">
                <label htmlFor="sortBy" className="text-sm text-gray-400 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors touch-manipulation flex items-center gap-2"
              >
                <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                <span className="hidden sm:inline">
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </span>
              </button>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {sortedFavorites.map((crypto) => (
                <div key={crypto.symbol} className="relative">
                  <CryptoCard
                    crypto={crypto}
                    isUnavailable={crypto.isUnavailable}
                  />
                  
                  {/* Favorite Button Overlay */}
                  <div className="absolute top-2 right-2">
                    <FavoriteButton
                      crypto={crypto}
                      isFavorite={isFavorite(crypto.symbol)}
                      onToggle={onToggleFavorite}
                      size="sm"
                    />
                  </div>
                  
                  {crypto.isUnavailable && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-75 rounded-lg flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="text-yellow-500 text-2xl mb-2">⚠️</div>
                        <div className="text-sm text-gray-300">
                          Data temporarily unavailable
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 sm:mt-12 text-center">
              <div className="inline-flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="/"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors touch-manipulation flex items-center justify-center"
                >
                  <span className="mr-2">🏠</span>
                  Browse More Coins
                </a>
                
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors touch-manipulation flex items-center justify-center"
                >
                  <span className="mr-2">🔄</span>
                  Refresh Data
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default WatchlistPage;
