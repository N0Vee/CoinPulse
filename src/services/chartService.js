// Service for fetching chart data from CoinGecko API

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export const fetchCoinChart = async (coinId, days = 7) => {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    );
    const data = await response.json();

    const prices = data.prices.map(([timestamp, price]) => ({
      time: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: price
    }));

    return prices;
  } catch (error) {
    console.error(`Error fetching chart data for ${coinId}:`, error);
    return null;
  }
};

export const createChartData = (prices, label, borderColor, backgroundColor) => {
  return {
    labels: prices.map(p => p.time),
    datasets: [
      {
        label: label,
        data: prices.map(p => p.price),
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      }
    ]
  };
};

export const fetchAllChartsData = async () => {
  try {
    const [bitcoinPrices, ethereumPrices, bnbPrices] = await Promise.all([
      fetchCoinChart('bitcoin'),
      fetchCoinChart('ethereum'),
      fetchCoinChart('binancecoin')
    ]);

    const charts = {};

    if (bitcoinPrices) {
      charts.bitcoin = createChartData(
        bitcoinPrices,
        'Bitcoin Price (USD)',
        '#F7931A',
        'rgba(247, 147, 26, 0.1)'
      );
    }

    if (ethereumPrices) {
      charts.ethereum = createChartData(
        ethereumPrices,
        'Ethereum Price (USD)',
        '#627EEA',
        'rgba(98, 126, 234, 0.1)'
      );
    }

    if (bnbPrices) {
      charts.binancecoin = createChartData(
        bnbPrices,
        'BNB Price (USD)',
        '#F3BA2F',
        'rgba(243, 186, 47, 0.1)'
      );
    }

    return charts;
  } catch (error) {
    console.error('Error fetching all charts data:', error);
    return {};
  }
};
