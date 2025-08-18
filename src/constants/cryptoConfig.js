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
  'VETUSDT': { name: 'VeChain', symbol: 'VET', id: 'vechain' },
  'XRPUSDT': { name: 'Ripple', symbol: 'XRP', id: 'ripple' },
  'TRXUSDT': { name: 'Tron', symbol: 'TRX', id: 'tron' },
  'FTMUSDT': { name: 'Fantom', symbol: 'FTM', id: 'fantom' },
  'NEARUSDT': { name: 'NEAR Protocol', symbol: 'NEAR', id: 'near' },
  'APTUSDT': { name: 'Aptos', symbol: 'APT', id: 'aptos' },
  'OPUSDT': { name: 'Optimism', symbol: 'OP', id: 'optimism' },
  'ARBUSDT': { name: 'Arbitrum', symbol: 'ARB', id: 'arbitrum' },
  'LDOUSDT': { name: 'Lido DAO', symbol: 'LDO', id: 'lido-dao' },
  'FILUSDT': { name: 'Filecoin', symbol: 'FIL', id: 'filecoin' },
  'APEUSDT': { name: 'ApeCoin', symbol: 'APE', id: 'apecoin' },
  'SANDUSDT': { name: 'The Sandbox', symbol: 'SAND', id: 'the-sandbox' },
  'MANAUSDT': { name: 'Decentraland', symbol: 'MANA', id: 'decentraland' },
  'CRVUSDT': { name: 'Curve DAO', symbol: 'CRV', id: 'curve-dao-token' },
  'AAVEUSDT': { name: 'Aave', symbol: 'AAVE', id: 'aave' },
  'COMPUSDT': { name: 'Compound', symbol: 'COMP', id: 'compound-governance-token' },
  'SUSHIUSDT': { name: 'SushiSwap', symbol: 'SUSHI', id: 'sushi' },
  'MKRUSDT': { name: 'Maker', symbol: 'MKR', id: 'maker' },
  'SNXUSDT': { name: 'Synthetix', symbol: 'SNX', id: 'havven' },
  'YFIUSDT': { name: 'yearn.finance', symbol: 'YFI', id: 'yearn-finance' },
  '1INCHUSDT': { name: '1inch', symbol: '1INCH', id: '1inch' },
  'ENJUSDT': { name: 'Enjin Coin', symbol: 'ENJ', id: 'enjincoin' },
  'CHZUSDT': { name: 'Chiliz', symbol: 'CHZ', id: 'chiliz' },
  'BATUSDT': { name: 'Basic Attention', symbol: 'BAT', id: 'basic-attention-token' },
  'ZRXUSDT': { name: '0x Protocol', symbol: 'ZRX', id: '0x' },
  'OMGUSDT': { name: 'OMG Network', symbol: 'OMG', id: 'omisego' },
  'LRCUSDT': { name: 'Loopring', symbol: 'LRC', id: 'loopring' }
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
