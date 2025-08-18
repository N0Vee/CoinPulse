'use client';

import { useState, useEffect, useCallback } from 'react';
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

// Components
import Navbar from '../components/Navbar';
import ChartSection from '../components/ChartSection';
import SearchAndSort from '../components/SearchAndSort';
import CryptoCard from '../components/CryptoCard';

// Hooks and Services
import { useWebSocket } from '../hooks/useWebSocket';
import { fetchAllChartsData } from '../services/chartService';

// Constants
import { BINANCE_SYMBOLS, CHART_CONFIGS } from '../constants/cryptoConfig';

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

    const { connectWebSocket, disconnect, refresh } = useWebSocket();

    const initializeChartData = async () => {
        try {
            const chartData = await fetchAllChartsData();
            setBitcoinChart(chartData.bitcoin);
            setEthereumChart(chartData.ethereum);
            setBnbChart(chartData.binancecoin);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    const handleWebSocketMessage = useCallback((processedData) => {
        const { symbolInfo, price, change24h, volume24h } = processedData;

        setCryptoData(prevData => {
            const newData = [...prevData];
            const existingIndex = newData.findIndex(item => item.id === symbolInfo.id);

            const updatedItem = {
                id: symbolInfo.id,
                name: symbolInfo.name,
                symbol: symbolInfo.symbol,
                price: price,
                change24h: change24h,
                volume24h: volume24h
            };

            if (existingIndex >= 0) {
                newData[existingIndex] = updatedItem;
            } else {
                newData.push(updatedItem);
            }

            return newData;
        });

        setLastUpdate(new Date());
    }, []);

    const handleRefresh = useCallback(() => {
        refresh(
            BINANCE_SYMBOLS,
            handleWebSocketMessage,
            setConnectionStatus,
            setLoading
        );
    }, [refresh, handleWebSocketMessage]);

    useEffect(() => {
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
    }, [connectWebSocket, disconnect, handleWebSocketMessage]);

    // Filter and sort crypto data
    const filteredAndSortedData = cryptoData
        .filter(crypto =>
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'price':
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case 'change':
                    aValue = a.change24h;
                    bValue = b.change24h;
                    break;
                case 'volume':
                    aValue = a.volume24h;
                    bValue = b.volume24h;
                    break;
                default:
                    return 0;
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Get current chart data based on selected crypto
    const getCurrentChart = () => {
        switch (selectedChart) {
            case 'ethereum':
                return ethereumChart;
            case 'binancecoin':
                return bnbChart;
            default:
                return bitcoinChart;
        }
    };

    // Get chart title based on selected crypto
    const getChartTitle = () => {
        switch (selectedChart) {
            case 'ethereum':
                return 'Ethereum Price (7 Days)';
            case 'binancecoin':
                return 'BNB Price (7 Days)';
            default:
                return 'Bitcoin Price (7 Days)';
        }
    };

    const chartOptions = {
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
  };

  return (
    <div className="min-h-screen bg-white">
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
              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6">
                Track Crypto<br />
                <span className="font-semibold text-blue-500">In Real-Time</span>
              </h1>
              <p className="text-xl text-gray-600 font-light mb-8 leading-relaxed">
                View live charts and prices for Bitcoin, Ethereum, and more. Clear design, real-time updates.
              </p>
            </div>
          </div>

          {/* Right Column - Dynamic Chart */}
          <ChartSection
            title={getChartTitle()}
            chartData={getCurrentChart()}
            chartOptions={chartOptions}
          />
        </div>
      </div>

      {/* Live Prices Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Live Prices</h2>
          <p className="text-gray-500 mb-6">Real-time cryptocurrency data via Binance WebSocket</p>

          {/* Search and Sort Controls */}
          <SearchAndSort
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>

        {/* Crypto Table */}
        {loading && cryptoData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center text-blue-500">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              Loading prices...
            </div>
          </div>
        ) : cryptoData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 text-center">
              <div className="mb-2">No data received yet</div>
              <div className="text-sm">Waiting for WebSocket data...</div>
            </div>
          </div>
        ) : filteredAndSortedData.length === 0 && searchTerm ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 text-center">
              <div className="mb-2">No cryptocurrencies found</div>
              <div className="text-sm">Try adjusting your search term</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedData.map((crypto, index) => (
              <CryptoCard
                key={crypto.id}
                crypto={crypto}
                index={index}
              />
            ))}
          </div>
        )}


      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-400 text-sm">
            Real-time data powered by Binance WebSocket • Charts by CoinGecko API
          </p>
        </div>
      </footer>
    </div>
  );
}
