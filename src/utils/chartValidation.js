// Chart data validation utility

export const validateChartData = (chartData) => {
  if (!chartData) {
    return false;
  }

  if (!chartData.labels || !Array.isArray(chartData.labels)) {
    return false;
  }

  if (!chartData.datasets || !Array.isArray(chartData.datasets)) {
    return false;
  }

  if (chartData.datasets.length === 0) {
    return false;
  }

  const dataset = chartData.datasets[0];
  if (!dataset.data || !Array.isArray(dataset.data)) {
    return false;
  }

  if (dataset.data.length === 0) {
    return false;
  }

  if (chartData.labels.length !== dataset.data.length) {
    return false;
  }

  // Check for NaN or invalid values
  const hasInvalidData = dataset.data.some(value => 
    value === null || value === undefined || isNaN(value) || !isFinite(value)
  );

  if (hasInvalidData) {
    return false;
  }

  return true;
};

export const createFallbackChartData = (coinName = 'Crypto') => {
  const labels = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const data = [45000, 45500, 45200, 46000, 45800, 46200];

  return {
    labels,
    datasets: [{
      label: `${coinName} Price`,
      data,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
    }]
  };
};
