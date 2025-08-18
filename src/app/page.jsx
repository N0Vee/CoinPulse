'use client';

import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const ChartSection = lazy(() => import('../components/ChartSection'));
const AdvancedFilters = dynamic(() => import('../components/AdvancedFilters'), {
  ssr: false,
  loading: () => <div className="h-16 animate-pulse bg-gray-800 rounded-lg"></div>
});

// Components
import Navbar from '../components/Navbar';
import CryptoCard from '../components/CryptoCard';
import CryptoCardSkeleton from '../components/CryptoCardSkeleton';
import LoadingSpinner from '../components/LoadingSpinner';

// Hooks and Services
import { useWebSocket } from '../hooks/useWebSocket';

// Constants
import { BINANCE_SYMBOLS } from '../constants/cryptoConfig';

// Dynamic import for chart service (only when needed)
const fetchAllChartsData = () => import('../services/chartService').then(mod => mod.fetchAllChartsData);

// Register Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Home() {
    const [cryptoData, setCryptoData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [bitcoinChart, setBitcoinChart] = useState(null);
    const [ethereumChart, setEthereumChart] = useState(null);
    const [bnbChart, setBnbChart] = useState(null);
    const [selectedChart, setSelectedChart] = useState('bitcoin');
    const [lastUpdate, setLastUpdate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('price');
    const [sortOrder, setSortOrder] = useState('desc');
    const [isClient, setIsClient] = useState(false);

    const { connectWebSocket, disconnect, refresh } = useWebSocket();

    // Memoized chart data initialization
    const initializeChartData = useCallback(async () => {
        try {
            const chartDataLoader = await fetchAllChartsData();
            const chartData = await chartDataLoader();
            setBitcoinChart(chartData.bitcoin);
            setEthereumChart(chartData.ethereum);
            setBnbChart(chartData.binancecoin);
        } catch (error) {
            // Handle error silently with fallback
        }
    }, []);

    // Memoized WebSocket message handler
    const handleWebSocketMessage = useCallback((processedData) => {
        const { symbolInfo, price, change24h, volume24h } = processedData;

        setCryptoData(prevData => {
            const existingIndex = prevData.findIndex(item => item.id === symbolInfo.id);
            
            const updatedItem = {
                id: symbolInfo.id,
                name: symbolInfo.name,
                symbol: symbolInfo.symbol,
                price: price,
                change24h: change24h,
                volume24h: volume24h
            };

            if (existingIndex >= 0) {
                const newData = [...prevData];
                newData[existingIndex] = updatedItem;
                return newData;
            }
            
            const newData = [...prevData, updatedItem];
            return newData;
        });

        setLastUpdate(new Date());
    }, []);

    // Memoized refresh handler
    const handleRefresh = useCallback(() => {
        refresh(
            BINANCE_SYMBOLS,
            handleWebSocketMessage,
            setConnectionStatus,
            setLoading
        );
    }, [refresh, handleWebSocketMessage]);

    useEffect(() => {
        setIsClient(true);
        setLastUpdate(new Date());
        initializeChartData();

        setLoading(true);
        connectWebSocket(
            BINANCE_SYMBOLS,
            handleWebSocketMessage,
            setConnectionStatus,
            setLoading
        );

        return () => {
            disconnect();
        };
    }, [connectWebSocket, disconnect, handleWebSocketMessage, initializeChartData]);

    // Initialize filtered data when cryptoData changes
    useEffect(() => {
        if (cryptoData.length > 0 && filteredData.length === 0) {
            setFilteredData(cryptoData);
        }
    }, [cryptoData, filteredData.length]);

    // Handle sorting (now handled by AdvancedFilters)
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Memoized chart data and title getters
    const getCurrentChart = useMemo(() => {
        switch (selectedChart) {
            case 'ethereum':
                return ethereumChart;
            case 'binancecoin':
                return bnbChart;
            default:
                return bitcoinChart;
        }
    }, [selectedChart, bitcoinChart, ethereumChart, bnbChart]);

    const getChartTitle = useMemo(() => {
        switch (selectedChart) {
            case 'ethereum':
                return 'Ethereum Price (7 Days)';
            case 'binancecoin':
                return 'BNB Price (7 Days)';
            default:
                return 'Bitcoin Price (7 Days)';
        }
    }, [selectedChart]);

    // Memoized chart options
    const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12
          }
        }
      },
      y: {
        display: true,
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12
          },
          callback: function (value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  }), []);

  // Early return for SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Initializing..." variant="crypto" color="blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <Navbar
        connectionStatus={connectionStatus}
        lastUpdate={lastUpdate}
        onReconnect={handleRefresh}
        loading={loading}
      />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <div className="mb-8">
              <h1 className="text-5xl lg:text-6xl font-light text-white mb-6">
                Track Crypto<br />
                <span className="font-semibold text-blue-400">In Real-Time</span>
              </h1>
              <p className="text-xl text-gray-300 font-light mb-8 leading-relaxed">
                View live charts and prices for Bitcoin, Ethereum, and more. Clear design, real-time updates.
              </p>
            </div>
          </div>

          {/* Right Column - Dynamic Chart */}
          <Suspense fallback={
            <div className="h-96 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700">
              <LoadingSpinner size="lg" text="Loading chart..." variant="pulse" color="blue" />
            </div>
          }>
            <ChartSection
              title={getChartTitle}
              chartData={getCurrentChart}
              chartOptions={chartOptions}
            />
          </Suspense>
        </div>
      </div>

      {/* Live Prices Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-white mb-2">Live Prices</h2>
          <p className="text-gray-400 mb-6">Real-time cryptocurrency data via Binance WebSocket</p>

          {/* Advanced Filters */}
          <AdvancedFilters
            cryptoData={cryptoData}
            onFilteredDataChange={setFilteredData}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Crypto Table */}
        {loading && cryptoData.length === 0 ? (
          <div className="space-y-4">
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner 
                size="lg" 
                text="Loading cryptocurrency data..." 
                variant="crypto"
                color="blue"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <CryptoCardSkeleton key={index} index={index} />
              ))}
            </div>
          </div>
        ) : cryptoData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-400 text-center">
              <div className="mb-2">No data received yet</div>
              <div className="text-sm">Waiting for WebSocket data...</div>
            </div>
          </div>
        ) : filteredData.length === 0 && searchTerm ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-400 text-center">
              <div className="mb-2">No cryptocurrencies found</div>
              <div className="text-sm">Try adjusting your search term or filters</div>
            </div>
          </div>
        ) : (
          <div>
            {/* Results Counter */}
            {filteredData.length > 0 && (
              <div className="flex justify-between items-center mb-6">
                <div className="text-gray-400">
                  Showing {filteredData.length} of {cryptoData.length} cryptocurrencies
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredData.map((crypto, index) => (
                <CryptoCard
                  key={crypto.id}
                  crypto={crypto}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}


      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-400 text-sm">
            Real-time data powered by Binance WebSocket • Charts by CoinGecko API
          </p>
        </div>
      </footer>
    </div>
  );
}
