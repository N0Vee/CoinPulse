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
    // Explicit layout constraints
    layout: {
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      }
    },
    // Performance optimizations (safer options)
    animation: {
      duration: 300, // Reduced animation for better performance
    },
    // Remove problematic parsing options
    // Optimize for large datasets
    elements: {
      point: {
        radius: 0, // Hide points by default for better performance
        hoverRadius: 6,
      },
      line: {
        tension: 0.1, // Reduce tension for better performance
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
            size: 12
          },
          // Optimize tick display for large datasets
          maxTicksLimit: 10,
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
            size: 12
          },
          maxTicksLimit: 8,
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

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
          <div className="text-xs px-2 py-1 bg-green-600 text-green-100 rounded-full">
            Binance API
          </div>
        </div>
      </div>
      {validatedChartData ? (
        <div className="h-64 max-h-64 overflow-hidden">
          <Line data={validatedChartData} options={chartOptions} />
        </div>
      ) : (
        <div className="h-64 max-h-64 flex items-center justify-center">
          <div className="text-gray-400">No chart data available</div>
        </div>
      )}
    </div>
  );
});

export default ChartSection;
