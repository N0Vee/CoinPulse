// Binance symbol mapping and configuration

export const BINANCE_SYMBOLS = {
  'BTCUSDT': { name: 'Bitcoin', symbol: 'BTC', id: 'bitcoin' },
  'ETHUSDT': { name: 'Ethereum', symbol: 'ETH', id: 'ethereum' },
  'ADAUSDT': { name: 'Cardano', symbol: 'ADA', id: 'cardano' },
  'DOTUSDT': { name: 'Polkadot', symbol: 'DOT', id: 'polkadot' },
  'LINKUSDT': { name: 'Chainlink', symbol: 'LINK', id: 'chainlink' },
  'BNBUSDT': { name: 'BNB', symbol: 'BNB', id: 'binancecoin' },
  'SOLUSDT': { name: 'Solana', symbol: 'SOL', id: 'solana' },
  'MATICUSDT': { name: 'Polygon', symbol: 'MATIC', id: 'matic-network' },
  'AVAXUSDT': { name: 'Avalanche', symbol: 'AVAX', id: 'avalanche-2' },
  'LTCUSDT': { name: 'Litecoin', symbol: 'LTC', id: 'litecoin' },
  'UNIUSDT': { name: 'Uniswap', symbol: 'UNI', id: 'uniswap' },
  'XLMUSDT': { name: 'Stellar', symbol: 'XLM', id: 'stellar' },
  'ATOMUSDT': { name: 'Cosmos', symbol: 'ATOM', id: 'cosmos' },
  'ALGOUSDT': { name: 'Algorand', symbol: 'ALGO', id: 'algorand' },
  'VETUSDT': { name: 'VeChain', symbol: 'VET', id: 'vechain' }
};

export const CHART_CONFIGS = {
  bitcoin: {
    title: 'Bitcoin Price (7 Days)',
    id: 'bitcoin',
    color: 'orange'
  },
  ethereum: {
    title: 'Ethereum Price (7 Days)',
    id: 'ethereum',
    color: 'indigo'
  },
  binancecoin: {
    title: 'BNB Price (7 Days)',
    id: 'binancecoin',
    color: 'yellow'
  }
};
