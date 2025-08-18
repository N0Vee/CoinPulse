import React, { useState, useEffect, useMemo, useCallback } from 'react';

const AdvancedFilters = React.memo(function AdvancedFilters({ 
  cryptoData, 
  onFilteredDataChange, 
  searchTerm,
  onSearchChange 
}) {
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    marketCapRange: { min: '', max: '' },
    volumeRange: { min: '', max: '' },
    changeRange: { min: '', max: '' },
    selectedCategories: [],
    sortBy: 'marketCap',
    sortOrder: 'desc',
    showOnlyGainers: false,
    showOnlyLosers: false,
    minVolume: '',
    maxVolatility: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Category options
  const categories = [
    'DeFi', 'Layer 1', 'Layer 2', 'Meme', 'Gaming', 'AI', 'Privacy', 'Storage'
  ];

  // Sort options
  const sortOptions = [
    { value: 'marketCap', label: 'Market Cap' },
    { value: 'price', label: 'Price' },
    { value: 'volume24h', label: '24h Volume' },
    { value: 'change24h', label: '24h Change' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'rank', label: 'Rank' }
  ];

  // Quick filter presets
  const quickFilters = [
    { 
      name: 'Top Gainers', 
      icon: '📈',
      filters: { showOnlyGainers: true, sortBy: 'change24h', sortOrder: 'desc' }
    },
    { 
      name: 'Top Losers', 
      icon: '📉',
      filters: { showOnlyLosers: true, sortBy: 'change24h', sortOrder: 'asc' }
    },
    { 
      name: 'High Volume', 
      icon: '💰',
      filters: { sortBy: 'volume24h', sortOrder: 'desc', minVolume: '1000000' }
    },
    { 
      name: 'Large Cap', 
      icon: '🏛️',
      filters: { marketCapRange: { min: '1000000000', max: '' }, sortBy: 'marketCap', sortOrder: 'desc' }
    },
    { 
      name: 'Mid Cap', 
      icon: '🏢',
      filters: { marketCapRange: { min: '100000000', max: '1000000000' }, sortBy: 'marketCap', sortOrder: 'desc' }
    },
    { 
      name: 'Small Cap', 
      icon: '🏪',
      filters: { marketCapRange: { min: '10000000', max: '100000000' }, sortBy: 'marketCap', sortOrder: 'desc' }
    }
  ];

  // Count active filters
  useEffect(() => {
    let count = 0;
    
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.marketCapRange.min || filters.marketCapRange.max) count++;
    if (filters.volumeRange.min || filters.volumeRange.max) count++;
    if (filters.changeRange.min || filters.changeRange.max) count++;
    if (filters.selectedCategories.length > 0) count++;
    if (filters.showOnlyGainers || filters.showOnlyLosers) count++;
    if (filters.minVolume) count++;
    if (filters.maxVolatility) count++;
    if (searchTerm) count++;

    setActiveFiltersCount(count);
  }, [filters, searchTerm]);

  // Memoized filter application
  const applyFilters = useCallback(() => {
    if (!cryptoData || cryptoData.length === 0) return [];

    let filteredData = [...cryptoData];

    // Search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(crypto =>
        crypto.name.toLowerCase().includes(lowerSearchTerm) ||
        crypto.symbol.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Price range filter
    if (filters.priceRange.min) {
      filteredData = filteredData.filter(crypto => crypto.price >= parseFloat(filters.priceRange.min));
    }
    if (filters.priceRange.max) {
      filteredData = filteredData.filter(crypto => crypto.price <= parseFloat(filters.priceRange.max));
    }

    // Market cap range filter
    if (filters.marketCapRange.min) {
      filteredData = filteredData.filter(crypto => 
        (crypto.price * 1000000000) >= parseFloat(filters.marketCapRange.min)
      );
    }
    if (filters.marketCapRange.max) {
      filteredData = filteredData.filter(crypto => 
        (crypto.price * 1000000000) <= parseFloat(filters.marketCapRange.max)
      );
    }

    // Volume range filter
    if (filters.volumeRange.min) {
      filteredData = filteredData.filter(crypto => crypto.volume24h >= parseFloat(filters.volumeRange.min));
    }
    if (filters.volumeRange.max) {
      filteredData = filteredData.filter(crypto => crypto.volume24h <= parseFloat(filters.volumeRange.max));
    }

    // Change range filter
    if (filters.changeRange.min) {
      filteredData = filteredData.filter(crypto => crypto.change24h >= parseFloat(filters.changeRange.min));
    }
    if (filters.changeRange.max) {
      filteredData = filteredData.filter(crypto => crypto.change24h <= parseFloat(filters.changeRange.max));
    }

    // Gainers/Losers filter
    if (filters.showOnlyGainers) {
      filteredData = filteredData.filter(crypto => crypto.change24h > 0);
    }
    if (filters.showOnlyLosers) {
      filteredData = filteredData.filter(crypto => crypto.change24h < 0);
    }

    // Minimum volume filter
    if (filters.minVolume) {
      filteredData = filteredData.filter(crypto => crypto.volume24h >= parseFloat(filters.minVolume));
    }

    // Sort the filtered data
    filteredData.sort((a, b) => {
      let aVal, bVal;

      switch (filters.sortBy) {
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'volume24h':
          aVal = a.volume24h;
          bVal = b.volume24h;
          break;
        case 'change24h':
          aVal = a.change24h;
          bVal = b.change24h;
          break;
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          return filters.sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case 'rank':
          aVal = cryptoData.indexOf(a) + 1;
          bVal = cryptoData.indexOf(b) + 1;
          break;
        case 'marketCap':
        default:
          aVal = a.price * 1000000000; // Estimated market cap
          bVal = b.price * 1000000000;
          break;
      }

      return filters.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    onFilteredDataChange(filteredData);
  }, [filters, searchTerm]);

  // Apply filters to crypto data
  useEffect(() => {
    if (!cryptoData || cryptoData.length === 0) {
      onFilteredDataChange([]);
      return;
    }

    let filteredData = [...cryptoData];

    // Search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(crypto =>
        crypto.name.toLowerCase().includes(lowerSearchTerm) ||
        crypto.symbol.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Price range filter
    if (filters.priceRange.min) {
      const minPrice = parseFloat(filters.priceRange.min);
      filteredData = filteredData.filter(crypto => crypto.price >= minPrice);
    }
    if (filters.priceRange.max) {
      const maxPrice = parseFloat(filters.priceRange.max);
      filteredData = filteredData.filter(crypto => crypto.price <= maxPrice);
    }

    // Market cap range filter
    if (filters.marketCapRange.min) {
      const minMarketCap = parseFloat(filters.marketCapRange.min);
      filteredData = filteredData.filter(crypto => 
        (crypto.price * 1000000000) >= minMarketCap
      );
    }
    if (filters.marketCapRange.max) {
      const maxMarketCap = parseFloat(filters.marketCapRange.max);
      filteredData = filteredData.filter(crypto => 
        (crypto.price * 1000000000) <= maxMarketCap
      );
    }

    // Volume range filter
    if (filters.volumeRange.min) {
      const minVolume = parseFloat(filters.volumeRange.min);
      filteredData = filteredData.filter(crypto => crypto.volume24h >= minVolume);
    }
    if (filters.volumeRange.max) {
      const maxVolume = parseFloat(filters.volumeRange.max);
      filteredData = filteredData.filter(crypto => crypto.volume24h <= maxVolume);
    }

    // Change range filter
    if (filters.changeRange.min) {
      const minChange = parseFloat(filters.changeRange.min);
      filteredData = filteredData.filter(crypto => crypto.change24h >= minChange);
    }
    if (filters.changeRange.max) {
      const maxChange = parseFloat(filters.changeRange.max);
      filteredData = filteredData.filter(crypto => crypto.change24h <= maxChange);
    }

    // Gainers/Losers filter
    if (filters.showOnlyGainers) {
      filteredData = filteredData.filter(crypto => crypto.change24h > 0);
    }
    if (filters.showOnlyLosers) {
      filteredData = filteredData.filter(crypto => crypto.change24h < 0);
    }

    // Minimum volume filter
    if (filters.minVolume) {
      const minVolume = parseFloat(filters.minVolume);
      filteredData = filteredData.filter(crypto => crypto.volume24h >= minVolume);
    }

    // Sort the filtered data
    filteredData.sort((a, b) => {
      let aVal, bVal;

      switch (filters.sortBy) {
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'volume24h':
          aVal = a.volume24h;
          bVal = b.volume24h;
          break;
        case 'change24h':
          aVal = a.change24h;
          bVal = b.change24h;
          break;
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          return filters.sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case 'rank':
          aVal = cryptoData.indexOf(a) + 1;
          bVal = cryptoData.indexOf(b) + 1;
          break;
        case 'marketCap':
        default:
          aVal = a.price * 1000000000; // Estimated market cap
          bVal = b.price * 1000000000;
          break;
      }

      return filters.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    onFilteredDataChange(filteredData);
    console.log('Filtered data updated:', filteredData.length, 'items'); // Debug log
  }, [cryptoData, filters, searchTerm, onFilteredDataChange]);

  // Handle filter changes
  const handleRangeFilter = (filterType, rangeType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [rangeType]: value
      }
    }));
  };

  const handleQuickFilter = (quickFilter) => {
    setFilters(prev => ({
      ...prev,
      ...quickFilter.filters
    }));
  };

  const handleSort = (sortBy, sortOrder) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: { min: '', max: '' },
      marketCapRange: { min: '', max: '' },
      volumeRange: { min: '', max: '' },
      changeRange: { min: '', max: '' },
      selectedCategories: [],
      sortBy: 'marketCap',
      sortOrder: 'desc',
      showOnlyGainers: false,
      showOnlyLosers: false,
      minVolume: '',
      maxVolatility: ''
    });
    onSearchChange('');
  };

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
      {/* Header with Search and Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white">Filters & Search</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount} active
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            <svg className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>{isExpanded ? 'Hide' : 'Show'} Filters</span>
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickFilters.map((quickFilter, index) => (
          <button
            key={index}
            onClick={() => handleQuickFilter(quickFilter)}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm text-white transition-colors"
          >
            <span>{quickFilter.icon}</span>
            <span>{quickFilter.name}</span>
          </button>
        ))}
      </div>

      {/* Advanced Filters (Expandable) */}
      {isExpanded && (
        <div className="space-y-6 border-t border-gray-700 pt-6">
          {/* Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSort(e.target.value, filters.sortOrder)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSort(filters.sortBy, 'desc')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                    filters.sortOrder === 'desc' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  High to Low
                </button>
                <button
                  onClick={() => handleSort(filters.sortBy, 'asc')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                    filters.sortOrder === 'asc' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Low to High
                </button>
              </div>
            </div>
          </div>

          {/* Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price Range ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handleRangeFilter('priceRange', 'min', e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => handleRangeFilter('priceRange', 'max', e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Market Cap Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Market Cap Range ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min (e.g. 1000000000)"
                  value={filters.marketCapRange.min}
                  onChange={(e) => handleRangeFilter('marketCapRange', 'min', e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.marketCapRange.max}
                  onChange={(e) => handleRangeFilter('marketCapRange', 'max', e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Volume Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">24h Volume Range ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.volumeRange.min}
                  onChange={(e) => handleRangeFilter('volumeRange', 'min', e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.volumeRange.max}
                  onChange={(e) => handleRangeFilter('volumeRange', 'max', e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Change Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">24h Change Range (%)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min (e.g. -10)"
                  value={filters.changeRange.min}
                  onChange={(e) => handleRangeFilter('changeRange', 'min', e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max (e.g. 50)"
                  value={filters.changeRange.max}
                  onChange={(e) => handleRangeFilter('changeRange', 'max', e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Toggle Filters */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showOnlyGainers}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  showOnlyGainers: e.target.checked,
                  showOnlyLosers: e.target.checked ? false : prev.showOnlyLosers
                }))}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-green-400">Show Only Gainers</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showOnlyLosers}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  showOnlyLosers: e.target.checked,
                  showOnlyGainers: e.target.checked ? false : prev.showOnlyGainers
                }))}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-red-400">Show Only Losers</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdvancedFilters;
