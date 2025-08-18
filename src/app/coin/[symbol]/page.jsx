'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic imports for Chart.js components (loaded only when needed)
const Line = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Line })), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse bg-gray-700 rounded flex items-center justify-center">
    <div className="text-gray-400">Loading chart...</div>
  </div>
});

// Import and register Chart.js components
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

// Register Chart.js components immediately
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

// Components
import Navbar from '../../../components/Navbar';
import LoadingSpinner from '../../../components/LoadingSpinner';

// Hooks and Services
import { useWebSocket } from '../../../hooks/useWebSocket';
import { formatPrice, formatVolume, formatPercentage } from '../../../utils/formatters';
import { BINANCE_SYMBOLS } from '../../../constants/cryptoConfig';

// Dynamic import for chart service
import { fetchChartData } from '../../../services/chartService';

export default function CoinDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol?.toUpperCase();
  
  const [chartData, setChartData] = useState(null);
  const [coinData, setCoinData] = useState(null);
  const [timeframe, setTimeframe] = useState('realtime');
  const [apiError, setApiError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [maxDataPoints, setMaxDataPoints] = useState(50);
  const [isClient, setIsClient] = useState(false);
  const [realtimeData, setRealtimeData] = useState([]);

  // WebSocket hook
  const { connectWebSocket, disconnect, refresh } = useWebSocket();

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoized coin info lookup
  const coinInfo = useMemo(() => {
    return Object.values(BINANCE_SYMBOLS).find(coin => coin.symbol === symbol);
  }, [symbol]);

  const binanceSymbol = useMemo(() => {
    return Object.keys(BINANCE_SYMBOLS).find(key => 
      BINANCE_SYMBOLS[key].symbol === symbol
    );
  }, [symbol]);

  // Create real-time chart data structure
  const createRealtimeChart = useCallback((dataPoints) => {
    if (!dataPoints || dataPoints.length === 0) return null;

    const labels = dataPoints.map(point => point.time);
    const prices = dataPoints.map(point => point.price);

    return {
      labels,
      datasets: [{
        label: `${symbol} Price`,
        data: prices,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
      }]
    };
  }, [symbol]);

  const handleWebSocketMessage = useCallback((processedData) => {
    const { symbolInfo, price, change24h, volume24h } = processedData;

    // Only update if this is the coin we're viewing
    if (symbolInfo.symbol === symbol) {
      const now = new Date();

      // Update coin data
      setCoinData(prevData => ({
        ...prevData,
        name: symbolInfo.name,
        symbol: symbolInfo.symbol,
        price: price,
        change24h: change24h,
        volume24h: volume24h,
        // Keep existing mock data for other fields if they exist, or calculate new values
        marketCap: prevData?.marketCap || price * 21000000,
        high24h: prevData?.high24h ? Math.max(prevData.high24h, price) : price * 1.05,
        low24h: prevData?.low24h ? Math.min(prevData.low24h, price) : price * 0.95,
        supply: prevData?.supply || 21000000,
        maxSupply: prevData?.maxSupply || 21000000,
        rank: prevData?.rank || ((symbolInfo.symbol.charCodeAt(0) + symbolInfo.symbol.charCodeAt(1)) % 100) + 1,
        // Additional market data
        priceChange7d: prevData?.priceChange7d || ((Math.random() - 0.5) * 20),
        priceChange30d: prevData?.priceChange30d || ((Math.random() - 0.5) * 40),
        allTimeHigh: prevData?.allTimeHigh || price * (2 + Math.random()),
        allTimeLow: prevData?.allTimeLow || price * (0.1 + Math.random() * 0.4),
        athDate: prevData?.athDate || '2021-11-10',
        atlDate: prevData?.atlDate || '2015-01-14',
        marketCapChange24h: prevData?.marketCapChange24h || change24h,
        volumeChange24h: prevData?.volumeChange24h || ((Math.random() - 0.5) * 30),
        // Technical indicators
        volatility: prevData?.volatility || (Math.random() * 15 + 5),
        beta: prevData?.beta || (Math.random() * 2 + 0.5),
        rsi: prevData?.rsi || (Math.random() * 100),
        // Social and development
        githubStars: prevData?.githubStars || Math.floor(Math.random() * 10000 + 1000),
        githubForks: prevData?.githubForks || Math.floor(Math.random() * 5000 + 500),
        twitterFollowers: prevData?.twitterFollowers || Math.floor(Math.random() * 1000000 + 100000),
        redditSubscribers: prevData?.redditSubscribers || Math.floor(Math.random() * 500000 + 50000),
        // Additional metrics
        totalValueLocked: prevData?.totalValueLocked || price * Math.floor(Math.random() * 1000000 + 100000),
        fdvRatio: prevData?.fdvRatio || (1 + Math.random() * 5),
        liquidityScore: prevData?.liquidityScore || (Math.random() * 100),
        developerScore: prevData?.developerScore || (Math.random() * 100),
        communityScore: prevData?.communityScore || (Math.random() * 100)
      }));

      // Update real-time chart data
      setRealtimeData(prevData => {
        const newDataPoint = {
          time: now.toLocaleTimeString(),
          price: price,
          timestamp: now.getTime()
        };

        const updatedData = [...prevData, newDataPoint];

        if (updatedData.length > maxDataPoints) {
          return updatedData.slice(-maxDataPoints);
        }
        return updatedData;
      });

      // Update chart data for real-time visualization
      setChartData(prevChart => {
        if (!prevChart && realtimeData.length === 0) {
          // Initialize chart with first data point
          return createRealtimeChart([{
            time: now.toLocaleTimeString(),
            price: price,
            timestamp: now.getTime()
          }]);
        }
        return prevChart; // Will be updated by the effect watching realtimeData
      });

      setLastUpdate(now);
      setConnectionStatus('Connected');
    }
  }, [symbol, maxDataPoints, realtimeData.length, createRealtimeChart]);

  // Update chart when real-time data changes (only in real-time mode)
  useEffect(() => {
    if (timeframe === 'realtime' && realtimeData.length > 0) {
      setChartData(createRealtimeChart(realtimeData));
    }
  }, [realtimeData, createRealtimeChart, timeframe]);

  // Refresh WebSocket connection
  const handleRefresh = useCallback(() => {
    if (!coinInfo || !binanceSymbol) return;
    
    setRealtimeData([]); // Clear existing real-time data
    refresh(
      { [binanceSymbol]: coinInfo },
      handleWebSocketMessage,
      setConnectionStatus,
      () => {} // Empty function for loading callback
    );
  }, [coinInfo, binanceSymbol, refresh, handleWebSocketMessage]);

  // Load historical chart data
  const loadHistoricalData = useCallback(async (days) => {
    if (!coinInfo || !coinInfo.id || !isClient) return;
    
    setApiError(false);
    try {
      const data = await fetchChartData(coinInfo.id, days);
      if (data) {
        setChartData(data);
        setApiError(false);
      } else {
        setApiError(true);
      }
    } catch (error) {
      setApiError(true);
    }
  }, [coinInfo, isClient]);

  const loadCoinData = useCallback(async () => {
    if (!coinInfo || !binanceSymbol || !isClient) return;
    
    setApiError(false);
    try {
      // Initialize WebSocket connection for real-time price data first
      connectWebSocket(
        { [binanceSymbol]: coinInfo },
        handleWebSocketMessage,
        setConnectionStatus,
        () => {} // Empty function for loading callback
      );

      // Only load historical data if we're not in real-time mode
      if (timeframe !== 'realtime' && coinInfo.id) {
        try {
          const data = await fetchChartData(coinInfo.id, timeframe);
          if (data) {
            setChartData(data);
            setApiError(false);
          } else {
            setApiError(true);
          }
        } catch (chartError) {
          setApiError(true);
        }
      }

      // Generate initial comprehensive mock data for fields not provided by WebSocket
      const seed = coinInfo.symbol.charCodeAt(0) + coinInfo.symbol.charCodeAt(1);
      const mockPrice = 1000 + (seed * 100);
      const mockChange = ((seed % 20) - 10);
      
      setCoinData(prevData => prevData || {
        name: coinInfo.name,
        symbol: coinInfo.symbol,
        price: mockPrice,
        change24h: mockChange,
        volume24h: seed * 10000000,
        marketCap: mockPrice * 21000000,
        high24h: mockPrice * 1.05,
        low24h: mockPrice * 0.95,
        supply: 21000000,
        maxSupply: 21000000,
        rank: (seed % 100) + 1,
        // Price changes
        priceChange7d: ((seed % 40) - 20),
        priceChange30d: ((seed % 60) - 30),
        // All-time records
        allTimeHigh: mockPrice * (2 + (seed % 10) / 10),
        allTimeLow: mockPrice * (0.1 + (seed % 40) / 100),
        athDate: '2021-11-10',
        atlDate: '2015-01-14',
        // Market metrics
        marketCapChange24h: mockChange,
        volumeChange24h: ((seed % 30) - 15),
        // Technical indicators
        volatility: (seed % 15) + 5,
        beta: ((seed % 20) / 10) + 0.5,
        rsi: (seed % 100),
        // Social metrics
        githubStars: (seed * 47) % 10000 + 1000,
        githubForks: (seed * 23) % 5000 + 500,
        twitterFollowers: (seed * 317) % 1000000 + 100000,
        redditSubscribers: (seed * 173) % 500000 + 50000,
        // Additional metrics
        totalValueLocked: mockPrice * ((seed * 71) % 1000000 + 100000),
        fdvRatio: 1 + ((seed % 50) / 10),
        liquidityScore: (seed % 100),
        developerScore: ((seed * 13) % 100),
        communityScore: ((seed * 19) % 100)
      });;
    } catch (error) {
      setApiError(true);
    }
  }, [coinInfo, binanceSymbol, timeframe, isClient, connectWebSocket, handleWebSocketMessage]);

  useEffect(() => {
    if (!coinInfo || !binanceSymbol) {
      router.push('/');
      return;
    }
  }, [coinInfo, binanceSymbol, router]);

  useEffect(() => {
    if (coinInfo && binanceSymbol && isClient) {
      // Load initial data based on timeframe
      if (timeframe === 'realtime') {
        loadCoinData(); // This will connect WebSocket
      } else {
        // Load historical data for initial timeframe
        loadHistoricalData(timeframe);
        // Still connect WebSocket for real-time price updates in sidebar
        connectWebSocket(
          { [binanceSymbol]: coinInfo },
          handleWebSocketMessage,
          setConnectionStatus,
          () => {} // Don't set loading for background connection
        );
      }
    }

    // Cleanup WebSocket connection on unmount
    return () => {
      disconnect();
    };
  }, [coinInfo, binanceSymbol, isClient, disconnect]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    // Explicit layout constraints
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    },
    // Performance optimizations for large datasets (safer options)
    animation: {
      duration: 300, // Reduced animations for better performance on large datasets
    },
    // Remove problematic parsing options that might cause JSON errors
    // Optimize elements for performance
    elements: {
      point: {
        radius: 0, // Hide points by default for better performance
        hoverRadius: 6,
      },
      line: {
        tension: 0.1, // Reduce tension for smoother performance
        borderWidth: 2,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        titleColor: '#E5E7EB',
        bodyColor: '#E5E7EB',
        borderColor: '#4B5563',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        // Performance optimization - only show tooltips for subset of points on large datasets
        filter: function(tooltipItem) {
          const dataLength = tooltipItem.dataset.data.length;
          if (dataLength > 50) {
            return tooltipItem.dataIndex % Math.max(1, Math.floor(dataLength / 30)) === 0;
          }
          return true;
        },
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
          color: '#374151',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12
          },
          // Performance optimizations for large datasets
          maxTicksLimit: 12,
          autoSkip: true,
          autoSkipPadding: 10,
        }
      },
      y: {
        display: true,
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12
          },
          maxTicksLimit: 10,
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

  const timeframeOptions = useMemo(() => [
    { value: 'realtime', label: 'Real-time' },
    { value: '1', label: '24H' },
    { value: '7', label: '7D' },
    { value: '30', label: '30D' },
    { value: '90', label: '90D' },
    { value: '365', label: '1Y' }
  ], []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="xl" text="Initializing..." variant="crypto" color="blue" />
          </div>
        </div>
      </div>
    );
  }

  if (!coinInfo || !binanceSymbol) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar 
        connectionStatus={connectionStatus}
        lastUpdate={lastUpdate}
        onReconnect={handleRefresh}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="mr-3 sm:mr-4 p-2 text-gray-400 hover:text-white active:text-white transition-colors touch-manipulation"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center min-w-0 flex-1">
            <img
              src={`https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`}
              alt={coinInfo.name}
              className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 shrink-0"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">{coinInfo.name}</h1>
              <p className="text-gray-400 text-sm sm:text-base">{symbol}</p>
            </div>
          </div>
          
          {/* Favorite Button */}
          <div className="ml-4">
            <FavoriteButton
              crypto={{
                symbol: symbol,
                name: coinInfo.name,
                id: coinInfo.id
              }}
              isFavorite={isFavorite(symbol)}
              onToggle={toggleFavorite}
              size="lg"
              showLabel={true}
            />
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Main Chart Area - Full Width */}
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 p-4 sm:p-6">
            {/* Chart Controls */}
            <div className="mb-4 sm:mb-6">
              {/* Price and Status Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {coinData && formatPrice(coinData.price)}
                  </div>
                  {coinData && (
                    <div className={`flex items-center text-xs sm:text-sm px-2 py-1 rounded-full ${
                      coinData.change24h >= 0
                        ? 'bg-green-900 text-green-400'
                        : 'bg-red-900 text-red-400'
                    }`}>
                      <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 ${coinData.change24h >= 0 ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {formatPercentage(coinData.change24h)}
                    </div>
                  )}
                </div>
                
                {/* Real-time indicator */}
                {connectionStatus === 'Connected' && lastUpdate && (
                  <div className="flex items-center text-xs text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Live
                  </div>
                )}
              </div>
                
              {/* Timeframe Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-xs sm:text-sm text-gray-400 mr-1 sm:mr-2">Timeframe:</div>
                <div className="flex flex-wrap gap-2">
                  {timeframeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={async () => {
                        setTimeframe(option.value);
                        if (option.value === 'realtime') {
                          // Switch to real-time mode
                          if (realtimeData.length > 0) {
                            setChartData(createRealtimeChart(realtimeData));
                          } else {
                            // If no real-time data yet, show waiting state
                            setChartData(null);
                          }
                        } else {
                          // Load historical data for the selected timeframe
                          await loadHistoricalData(option.value);
                        }
                      }}
                      className={`px-2.5 sm:px-3 py-1 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                        timeframe === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-600'
                      }`}
                    >
                      {option.label}
                      {option.value === 'realtime' && connectionStatus === 'Connected' && (
                        <span className="ml-1 w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="h-80 max-h-80 overflow-hidden">
                {chartData && chartData.labels && chartData.datasets && chartData.datasets.length > 0 ? (
                  <div className="h-full">
                    {/* Performance indicator - show data points count */}
                    {chartData.datasets && chartData.datasets[0] && chartData.datasets[0].data && (
                      <div className="text-xs text-gray-500 mb-2 text-right">
                        Data points: {chartData.datasets[0].data.length} | 
                        Timeframe: {timeframe === 'realtime' ? 'Real-time' : `${timeframe}D`}
                        {timeframe !== 'realtime' && (
                          <span className="ml-2 px-1 py-0.5 bg-green-600 text-green-100 rounded text-xs">
                            Binance API
                          </span>
                        )}
                      </div>
                    )}
                    <Line data={chartData} options={chartOptions} />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      {connectionStatus === 'Connected' ? (
                        <>
                          <div className="mb-2">📊 Waiting for price data</div>
                          <div className="text-sm mb-4">WebSocket connected, collecting data points...</div>
                          <div className="text-xs bg-gray-700 px-3 py-2 rounded-lg mb-3">
                            Real-time price updates from Binance • Data points: {realtimeData.length}
                          </div>
                          <div className="text-xs text-gray-500">
                            Symbol: {symbol} • Binance: {binanceSymbol}
                          </div>
                        </>
                      ) : connectionStatus === 'Disconnected' || connectionStatus === 'Error' ? (
                        <>
                          <div className="mb-2">⚠️ Connection Error</div>
                          <div className="text-sm mb-4">Unable to connect to WebSocket</div>
                          <div className="text-xs bg-gray-700 px-3 py-2 rounded-lg mb-3">
                            Check your internet connection and try again
                          </div>
                          <button 
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Retry Connection
                          </button>
                        </>
                      ) : connectionStatus === 'Disconnected' || connectionStatus === 'Error' ? (
                        <>
                          <div className="mb-2">⚠️ Connection Error</div>
                          <div className="text-sm mb-4">Unable to connect to WebSocket</div>
                          <div className="text-xs bg-gray-700 px-3 py-2 rounded-lg mb-3">
                            Status: {connectionStatus} • Check your internet connection
                          </div>
                          <button 
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Retry Connection
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="mb-2">🔄 Connecting...</div>
                          <div className="text-sm mb-4">Establishing WebSocket connection</div>
                          <div className="text-xs bg-gray-700 px-3 py-2 rounded-lg">
                            Status: {connectionStatus} • Please wait...
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coin Statistics - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Market Stats */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Market Statistics</h3>
                  {coinData && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Cap</span>
                        <div className="text-right">
                          <div className="text-white font-medium">{formatVolume(coinData.marketCap)}</div>
                          <div className={`text-xs ${coinData.marketCapChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {coinData.marketCapChange24h >= 0 ? '+' : ''}{formatPercentage(coinData.marketCapChange24h)}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fully Diluted Valuation</span>
                        <span className="text-white font-medium">{formatVolume(coinData.price * coinData.maxSupply)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">24h Volume</span>
                        <div className="text-right">
                          <div className="text-white font-medium">{formatVolume(coinData.volume24h)}</div>
                          <div className={`text-xs ${coinData.volumeChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {coinData.volumeChange24h >= 0 ? '+' : ''}{formatPercentage(coinData.volumeChange24h)}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Volume/Market Cap</span>
                        <span className="text-white font-medium">{((coinData.volume24h / coinData.marketCap) * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Rank</span>
                        <span className="text-white font-medium">#{coinData.rank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Dominance</span>
                        <span className="text-white font-medium">{(coinData.marketCap / (coinData.marketCap * 10) * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Supply Information */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Supply Information</h3>
                  {coinData && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Circulating Supply</span>
                        <span className="text-white font-medium">{formatVolume(coinData.supply)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Supply</span>
                        <span className="text-white font-medium">{formatVolume(coinData.supply)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Supply</span>
                        <span className="text-white font-medium">{coinData.maxSupply ? formatVolume(coinData.maxSupply) : '∞'}</span>
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Supply Progress</span>
                          <span className="text-white">{((coinData.supply / coinData.maxSupply) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(coinData.supply / coinData.maxSupply) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Performance */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Price Performance</h3>
                  {coinData && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">24h Change</span>
                        <span className={`font-medium ${coinData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercentage(coinData.change24h)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">7d Change</span>
                        <span className={`font-medium ${coinData.priceChange7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercentage(coinData.priceChange7d)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">30d Change</span>
                        <span className={`font-medium ${coinData.priceChange30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercentage(coinData.priceChange30d)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">24h High</span>
                        <span className="text-green-400 font-medium">{formatPrice(coinData.high24h)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">24h Low</span>
                        <span className="text-red-400 font-medium">{formatPrice(coinData.low24h)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* All-Time Records */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">All-Time Records</h3>
                  {coinData && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">All-Time High</span>
                        <div className="text-right">
                          <div className="text-white font-medium">{formatPrice(coinData.allTimeHigh)}</div>
                          <div className="text-xs text-gray-500">{coinData.athDate}</div>
                          <div className="text-xs text-red-400">
                            -{formatPercentage(((coinData.allTimeHigh - coinData.price) / coinData.allTimeHigh) * 100)}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">All-Time Low</span>
                        <div className="text-right">
                          <div className="text-white font-medium">{formatPrice(coinData.allTimeLow)}</div>
                          <div className="text-xs text-gray-500">{coinData.atlDate}</div>
                          <div className="text-xs text-green-400">
                            +{formatPercentage(((coinData.price - coinData.allTimeLow) / coinData.allTimeLow) * 100)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Real-time Data Status */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Real-time Data</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Connection</span>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          connectionStatus === 'Connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          connectionStatus === 'Connected' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {connectionStatus}
                        </span>
                      </div>
                    </div>
                    {lastUpdate && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Update</span>
                        <span className="text-white text-sm">
                          {lastUpdate.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Data Source</span>
                      <span className="text-white text-sm">Binance WebSocket</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chart Points</span>
                      <span className="text-white text-sm">{realtimeData.length}/{maxDataPoints}</span>
                    </div>
                    {connectionStatus !== 'Connected' && (
                      <button
                        onClick={handleRefresh}
                        className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Reconnect
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Technical Analysis */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Technical Analysis</h3>
                  {coinData && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">RSI (14)</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{coinData.rsi.toFixed(0)}</span>
                          <div className={`px-2 py-1 rounded text-xs ${
                            coinData.rsi > 70 ? 'bg-red-900 text-red-300' : 
                            coinData.rsi < 30 ? 'bg-green-900 text-green-300' : 
                            'bg-yellow-900 text-yellow-300'
                          }`}>
                            {coinData.rsi > 70 ? 'Overbought' : coinData.rsi < 30 ? 'Oversold' : 'Neutral'}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Volatility (30d)</span>
                        <span className="text-white font-medium">{coinData.volatility.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Beta (vs BTC)</span>
                        <span className="text-white font-medium">{coinData.beta.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sharpe Ratio</span>
                        <span className="text-white font-medium">{(coinData.priceChange30d / coinData.volatility).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Development Activity */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Development Activity</h3>
                  {coinData && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Developer Score</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${coinData.developerScore}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium text-sm">{coinData.developerScore.toFixed(0)}/100</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">GitHub Stars</span>
                        <span className="text-white font-medium">{coinData.githubStars.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">GitHub Forks</span>
                        <span className="text-white font-medium">{coinData.githubForks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Code Commits (30d)</span>
                        <span className="text-white font-medium">{Math.floor(coinData.githubStars / 100)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Metrics */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Social Metrics</h3>
                  {coinData && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Community Score</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${coinData.communityScore}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium text-sm">{coinData.communityScore.toFixed(0)}/100</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Twitter Followers</span>
                        <span className="text-white font-medium">{formatVolume(coinData.twitterFollowers)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Reddit Subscribers</span>
                        <span className="text-white font-medium">{formatVolume(coinData.redditSubscribers)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Telegram Members</span>
                        <span className="text-white font-medium">{formatVolume(Math.floor(coinData.twitterFollowers * 0.3))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Social Dominance</span>
                        <span className="text-white font-medium">{(coinData.communityScore / 10).toFixed(2)}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Market Sentiment */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Market Sentiment</h3>
                  {coinData && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Fear & Greed Index</span>
                        <div className="flex items-center space-x-2">
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            coinData.rsi > 70 ? 'bg-red-900 text-red-300' : 
                            coinData.rsi < 30 ? 'bg-orange-900 text-orange-300' : 
                            'bg-green-900 text-green-300'
                          }`}>
                            {coinData.rsi > 70 ? 'Extreme Greed' : coinData.rsi < 30 ? 'Extreme Fear' : 'Neutral'}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Sentiment</span>
                        <span className={`font-medium ${
                          coinData.change24h > 5 ? 'text-green-400' : 
                          coinData.change24h < -5 ? 'text-red-400' : 
                          'text-yellow-400'
                        }`}>
                          {coinData.change24h > 5 ? 'Bullish' : coinData.change24h < -5 ? 'Bearish' : 'Neutral'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Analyst Rating</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${
                              i < Math.floor(coinData.communityScore / 20) ? 'text-yellow-400' : 'text-gray-600'
                            }`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-white text-sm ml-1">{(coinData.communityScore / 20).toFixed(1)}/5</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* DeFi Metrics */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">DeFi Metrics</h3>
                  {coinData && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Value Locked</span>
                        <span className="text-white font-medium">{formatVolume(coinData.totalValueLocked)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">FDV/TVL Ratio</span>
                        <span className="text-white font-medium">{coinData.fdvRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Liquidity Score</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${coinData.liquidityScore}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium text-sm">{coinData.liquidityScore.toFixed(0)}/100</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Yield Opportunities</span>
                        <span className="text-white font-medium">{Math.floor(coinData.liquidityScore / 10)} pools</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* About Section */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">About {coinInfo.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {coinInfo.name} ({symbol}) is a cryptocurrency that can be traded on various exchanges. 
                    Monitor its real-time price movements, trading volume, and market statistics here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
