// Service for fetching chart data from CoinGecko API

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Retry mechanism with exponential backoff
const fetchWithRetry = async (url, options = {}, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff: wait 1s, then 2s, then 4s
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`Fetch attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export const fetchCoinChart = async (coinId, days = 7) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetchWithRetry(
      `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CoinPulse/1.0'
        }
      },
      1 // Only 1 retry for basic charts
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`CoinGecko API error (${response.status}), using mock data for ${coinId}`);
      return generateMockPrices(coinId, days);
    }
    
    const data = await response.json();

    if (!data || !data.prices || !Array.isArray(data.prices)) {
      console.warn('Invalid data structure from API, using mock data');
      return generateMockPrices(coinId, days);
    }

    const prices = data.prices.map(([timestamp, price]) => ({
      time: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: price
    }));

    return prices;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`Request timeout for ${coinId}, using mock data`);
    } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn(`Network error for ${coinId}, using mock data`);
    } else {
      console.error(`Error fetching chart data for ${coinId}:`, error);
    }
    return generateMockPrices(coinId, days);
  }
};

// Generate mock price data for fallback
const generateMockPrices = (coinId, days = 7) => {
  const basePrice = getBasePriceForCoin(coinId);
  const prices = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movement
    const variation = (Math.sin(i * 0.3) + Math.random() * 0.2 - 0.1) * 0.08;
    const price = basePrice * (1 + variation);
    
    prices.push({
      time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: price
    });
  }
  
  return prices;
};

// New function for detailed chart data with more options
export const fetchChartData = async (coinId, days = 7) => {
  try {
    let interval = 'daily';
    if (days <= 1) interval = 'hourly';
    else if (days <= 7) interval = 'hourly';
    else if (days <= 30) interval = 'daily';
    else interval = 'daily';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for detailed data

    const response = await fetchWithRetry(
      `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`,
      { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CoinPulse/1.0'
        }
      },
      2 // 2 retries for detailed charts
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // If API fails (401, rate limit, etc), generate mock data
      console.warn(`CoinGecko API error (${response.status}) for ${coinId}, using mock data`);
      return generateMockChartData(coinId, days);
    }
    
    const data = await response.json();

    // Check if data structure is valid
    if (!data || !data.prices || !Array.isArray(data.prices)) {
      console.warn('Invalid data structure from API, using mock data');
      return generateMockChartData(coinId, days);
    }

    const prices = data.prices.map(([timestamp, price]) => {
      const date = new Date(timestamp);
      let timeLabel;
      
      if (days <= 1) {
        timeLabel = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (days <= 7) {
        timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
      } else {
        timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      return {
        time: timeLabel,
        price: price
      };
    });

    // Create chart data
    return createChartData(prices, `${coinId} Price (USD)`, '#3B82F6', 'rgba(59, 130, 246, 0.1)');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`Request timeout for ${coinId} detailed chart, using mock data`);
    } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn(`Network error for ${coinId} detailed chart, using mock data`);
    } else {
      console.error(`Error fetching detailed chart data for ${coinId}:`, error);
    }
    // Fallback to mock data on any error
    return generateMockChartData(coinId, days);
  }
};

// Generate mock chart data as fallback
const generateMockChartData = (coinId, days) => {
  const dataPoints = Math.min(days * 4, 100); // Limit data points
  const basePrice = getBasePriceForCoin(coinId);
  
  const prices = [];
  const now = new Date();
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date(now - i * (24 * 60 * 60 * 1000) / (dataPoints / days));
    let timeLabel;
    
    if (days <= 1) {
      timeLabel = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days <= 7) {
      timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
    } else {
      timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    // Generate realistic price movement
    const variation = (Math.sin(i * 0.2) + Math.random() * 0.4 - 0.2) * 0.1;
    const price = basePrice * (1 + variation);
    
    prices.push({
      time: timeLabel,
      price: price
    });
  }
  
  return createChartData(prices, `${coinId} Price (USD)`, '#3B82F6', 'rgba(59, 130, 246, 0.1)');
};

// Get realistic base prices for different coins
const getBasePriceForCoin = (coinId) => {
  const basePrices = {
    'bitcoin': 45000,
    'ethereum': 2500,
    'binancecoin': 300,
    'cardano': 0.45,
    'polkadot': 12,
    'chainlink': 15,
    'solana': 100,
    'matic-network': 0.85,
    'avalanche-2': 25,
    'litecoin': 90,
    'uniswap': 8,
    'stellar': 0.12,
    'cosmos': 9,
    'algorand': 0.25,
    'vechain': 0.035,
    'ripple': 0.55,
    'tron': 0.08,
    'fantom': 0.45,
    'near': 3.5,
    'aptos': 8.5,
    'optimism': 2.1,
    'arbitrum': 1.2,
    'lido-dao': 2.8,
    'filecoin': 5.5,
    'apecoin': 4.2,
    'the-sandbox': 0.85,
    'decentraland': 0.62,
    'curve-dao-token': 0.95,
    'aave': 85,
    'compound-governance-token': 45,
    'sushi': 1.1,
    'maker': 1200,
    'havven': 2.8,
    'yearn-finance': 8500,
    '1inch': 0.45,
    'enjincoin': 0.38,
    'chiliz': 0.095,
    'basic-attention-token': 0.22,
    '0x': 0.35,
    'omisego': 1.8,
    'loopring': 0.28
  };
  
  return basePrices[coinId] || 100; // Default fallback price
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

    // Always create charts, even with mock data
    if (bitcoinPrices && bitcoinPrices.length > 0) {
      charts.bitcoin = createChartData(
        bitcoinPrices,
        'Bitcoin Price (USD)',
        '#F7931A',
        'rgba(247, 147, 26, 0.1)'
      );
    }

    if (ethereumPrices && ethereumPrices.length > 0) {
      charts.ethereum = createChartData(
        ethereumPrices,
        'Ethereum Price (USD)',
        '#627EEA',
        'rgba(98, 126, 234, 0.1)'
      );
    }

    if (bnbPrices && bnbPrices.length > 0) {
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
    // Return charts with mock data as fallback
    return {
      bitcoin: createChartData(
        generateMockPrices('bitcoin', 7),
        'Bitcoin Price (USD)',
        '#F7931A',
        'rgba(247, 147, 26, 0.1)'
      ),
      ethereum: createChartData(
        generateMockPrices('ethereum', 7),
        'Ethereum Price (USD)',
        '#627EEA',
        'rgba(98, 126, 234, 0.1)'
      ),
      binancecoin: createChartData(
        generateMockPrices('binancecoin', 7),
        'BNB Price (USD)',
        '#F3BA2F',
        'rgba(243, 186, 47, 0.1)'
      )
    };
  }
};
