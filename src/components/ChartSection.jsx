import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
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

import { validateChartData, createFallbackChartData } from '../utils/chartValidation';

// Register Chart.js components
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

const ChartSection = React.memo(function ChartSection({ chartData, title, description }) {
  // Validate and potentially fix chart data
  const validatedChartData = useMemo(() => {
    if (!chartData) {
      return null;
    }
    
    if (validateChartData(chartData)) {
      return chartData;
    }
    
    // If validation fails, use fallback data
    return createFallbackChartData(title);
  }, [chartData, title]);
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    // Mobile-optimized layout constraints
    layout: {
      padding: {
        top: 8,
        right: 8,
        bottom: 8,
        left: 8
      }
    },
    // Performance optimizations for mobile
    animation: {
      duration: 200, // Reduced animation for better mobile performance
    },
    // Optimize elements for mobile performance
    elements: {
      point: {
        radius: 0, // Hide points by default for better mobile performance
        hoverRadius: 4, // Smaller hover radius for mobile
      },
      line: {
        tension: 0.1,
        borderWidth: window.innerWidth < 640 ? 1.5 : 2, // Thinner lines on mobile
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
        cornerRadius: 6, // Smaller radius for mobile
        titleFont: {
          size: window.innerWidth < 640 ? 11 : 12
        },
        bodyFont: {
          size: window.innerWidth < 640 ? 10 : 11
        },
        displayColors: false,
        // Optimize tooltip for performance
        filter: function(tooltipItem) {
          return tooltipItem.dataIndex % Math.max(1, Math.floor(tooltipItem.dataset.data.length / 50)) === 0;
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
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: window.innerWidth < 640 ? 10 : 12
          },
          maxTicksLimit: window.innerWidth < 640 ? 6 : 10, // Fewer ticks on mobile
          autoSkip: true,
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
            size: window.innerWidth < 640 ? 10 : 12
          },
          maxTicksLimit: window.innerWidth < 640 ? 6 : 8, // Fewer ticks on mobile
          callback: function (value) {
            // Shorter format on mobile
            if (window.innerWidth < 640) {
              return '$' + (value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value.toLocaleString());
            }
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

  return (
    <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-700 p-4 sm:p-6 shadow-xl">
      <div className="mb-3 sm:mb-4">
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 truncate">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-400 truncate">{description}</p>
          </div>
          <div className="text-xs px-2 py-1 bg-green-600 text-green-100 rounded-full shrink-0">
            Binance API
          </div>
        </div>
      </div>
      {validatedChartData ? (
        <div className="h-48 sm:h-64 lg:h-80 max-h-80 overflow-hidden chart-container">
          <Line data={validatedChartData} options={chartOptions} />
        </div>
      ) : (
        <div className="h-48 sm:h-64 lg:h-80 max-h-80 flex items-center justify-center">
          <div className="text-gray-400 text-sm">No chart data available</div>
        </div>
      )}
    </div>
  );
});

export default ChartSection;
