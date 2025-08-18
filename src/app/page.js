'use client';

import { useState, useEffect } from 'react';
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
import { Line } from 'react-chartjs-2';
import Navbar from '../components/Navbar';

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
    const [showLanding, setShowLanding] = useState(true);
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [bitcoinChart, setBitcoinChart] = useState(null);
    const [currentBitcoinPrice, setCurrentBitcoinPrice] = useState(null);

    const fetchBitcoinChart = async () => {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily'
            );
            const data = await response.json();

            const prices = data.prices.map(([timestamp, price]) => ({
                time: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                price: price
            }));

            const currentPrice = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
            );
            const currentData = await currentPrice.json();
            setCurrentBitcoinPrice(currentData.bitcoin);

            setBitcoinChart({
                labels: prices.map(p => p.time),
                datasets: [
                    {
                        label: 'Bitcoin Price (USD)',
                        data: prices.map(p => p.price),
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        borderWidth: 2,
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching Bitcoin chart:', error);
        }
    };

    const fetchCryptoData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,polkadot,chainlink&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true'
            );
            const data = await response.json();

            const formattedData = Object.entries(data).map(([id, values]) => ({
                id,
                name: id.charAt(0).toUpperCase() + id.slice(1),
                symbol: id === 'bitcoin' ? 'BTC' : id === 'ethereum' ? 'ETH' : id === 'cardano' ? 'ADA' : id === 'polkadot' ? 'DOT' : 'LINK',
                price: values.usd,
                change24h: values.usd_24h_change,
                volume24h: values.usd_24h_vol
            }));

            setCryptoData(formattedData);
            setLastUpdate(new Date());
            setLoading(false);
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch Bitcoin chart data for landing page
        fetchBitcoinChart();

        if (!showLanding) {
            fetchCryptoData();
            const interval = setInterval(fetchCryptoData, 30000);
            return () => clearInterval(interval);
        }
    }, [showLanding]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    const formatVolume = (volume) => {
        if (volume >= 1e9) {
            return `$${(volume / 1e9).toFixed(1)}B`;
        } else if (volume >= 1e6) {
            return `$${(volume / 1e6).toFixed(1)}M`;
        }
        return `$${volume?.toFixed(0)}`;
    };

    const enterApp = () => {
        setShowLanding(false);
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

    if (showLanding) {
        return (
            <div className="min-h-screen bg-white">
                {/* Navbar */}
                <Navbar onStartTracking={enterApp} />

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

                                {/* Current Bitcoin Price */}
                                {currentBitcoinPrice && (
                                    <div className="bg-blue-50 rounded-lg p-4 mb-8 inline-block">
                                        <div className="text-sm text-gray-600 mb-1">Bitcoin (BTC)</div>
                                        <div className="text-2xl font-semibold text-gray-900">
                                            ${currentBitcoinPrice.usd.toLocaleString()}
                                        </div>
                                        <div className={`text-sm font-medium ${currentBitcoinPrice.usd_24h_change >= 0 ? 'text-green-600' : 'text-red-500'
                                            }`}>
                                            {currentBitcoinPrice.usd_24h_change >= 0 ? '+' : ''}
                                            {currentBitcoinPrice.usd_24h_change?.toFixed(2)}% (24h)
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={enterApp}
                                className="bg-blue-500 text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-blue-600 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                            >
                                Start Tracking →
                            </button>
                        </div>

                        {/* Right Column - Bitcoin Chart */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bitcoin Price (7 Days)</h3>
                                <p className="text-sm text-gray-500">Live market data preview</p>
                            </div>
                            {bitcoinChart ? (
                                <div className="h-64">
                                    <Line data={bitcoinChart} options={chartOptions} />
                                </div>
                            ) : (
                                <div className="h-64 flex items-center justify-center">
                                    <div className="flex items-center text-blue-500">
                                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                                        Loading chart...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-50 border-t border-gray-100 mt-16">
                    <div className="max-w-7xl mx-auto px-6 py-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Data powered by CoinGecko API • Real-time cryptocurrency tracking
                        </p>
                    </div>
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <h1 className="text-2xl font-light text-gray-900">
                            Coin<span className="font-semibold text-blue-500">Pulse</span>
                        </h1>
                    </div>
                    <div className="text-sm text-gray-500">
                        {lastUpdate.toLocaleTimeString()}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Overview */}
                <div className="mb-8">
                    <h2 className="text-3xl font-light text-gray-900 mb-2">Live Prices</h2>
                    <p className="text-gray-500">Real-time cryptocurrency market data</p>
                </div>

                {/* Crypto Table */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex items-center text-blue-500">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                            Loading prices...
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                        {cryptoData.map((crypto, index) => (
                            <div
                                key={crypto.id}
                                className={`flex items-center justify-between p-6 hover:bg-blue-50 transition-colors duration-200 ${index !== cryptoData.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-blue-600 font-semibold text-sm">
                                            {crypto.symbol}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{crypto.name}</h3>
                                        <p className="text-sm text-gray-500">{crypto.symbol}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-light text-gray-900">
                                        {formatPrice(crypto.price)}
                                    </div>
                                    <div className={`text-sm font-medium ${crypto.change24h >= 0 ? 'text-green-600' : 'text-red-500'
                                        }`}>
                                        {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h?.toFixed(2)}%
                                    </div>
                                </div>

                                <div className="text-right min-w-[120px]">
                                    <div className="text-sm text-gray-500">24h Volume</div>
                                    <div className="text-lg font-light text-gray-900">
                                        {formatVolume(crypto.volume24h)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Refresh Section */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={fetchCryptoData}
                        disabled={loading}
                        className="bg-blue-500 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200"
                    >
                        {loading ? 'Updating...' : 'Refresh Data'}
                    </button>
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center border-t border-gray-100 pt-8">
                    <p className="text-gray-400 text-sm">
                        Data updates every 30 seconds • Powered by CoinGecko
                    </p>
                </footer>
            </div>
        </div>
    );
}
