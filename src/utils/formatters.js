// Utility functions for formatting data

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatVolume = (volume) => {
  if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(1)}B`;
  } else if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(1)}M`;
  }
  return `$${volume?.toFixed(0)}`;
};

export const formatPercentage = (percentage) => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage?.toFixed(2)}%`;
};

export const calculatePriceRange = (price, changePercent) => {
  const absChange = Math.abs(changePercent) / 100;
  return {
    low: price * (1 - absChange),
    high: price * (1 + absChange)
  };
};
