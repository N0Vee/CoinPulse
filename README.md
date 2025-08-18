# 📊 Coin Pulse

**Real-time cryptocurrency price monitoring with a clean, minimalist interface.**

Coin Pulse is a modern crypto tracking website that provides real-time price data for popular cryptocurrencies including Bitcoin, Ethereum, Cardano, Polkadot, and Chainlink. Built with Next.js and featuring a beautiful, responsive design.

![Coin Pulse Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black) ![React](https://img.shields.io/badge/React-19.1.0-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-blue)

## ✨ Features

### 🚀 **Landing Page**
- Professional navbar with smooth navigation
- Live Bitcoin price chart (7-day view)
- Real-time Bitcoin price display with 24h change
- Clean, minimalist design with white and light blue theme
- Responsive layout for all devices

### 📈 **Price Tracking**
- **Real-time data** updates every 30 seconds
- **Multiple cryptocurrencies**: Bitcoin, Ethereum, Cardano, Polkadot, Chainlink
- **Comprehensive metrics**: Current price, 24h change, trading volume
- **Visual indicators**: Green/red color coding for price movements
- **Manual refresh** option for instant updates

## 🛠️ Tech Stack
- **Framework**: [Next.js 15.4.6](https://nextjs.org/) with React 19
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/) with react-chartjs-2
- **Data Source**: [CoinGecko API](https://www.coingecko.com/en/api)
- **Language**: JavaScript (ES6+)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed on your machine
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/N0Vee/CoinPulse.git
   cd crypto-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Usage

### Price Tracking
- Monitor real-time prices for 5 major cryptocurrencies
- View 24-hour price changes and trading volumes
- Data automatically refreshes every 30 seconds
- Manual refresh available with the "Refresh Data" button

## 🏗️ Project Structure

```
crypto-pulse/
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── globals.css    # Global styles
│   │   ├── layout.js      # Root layout
│   │   └── page.js        # Main application page
│   └── components/
│       └── Navbar.jsx     # Reusable navbar component
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🌐 API Integration

Coin Pulse uses the free [CoinGecko API](https://www.coingecko.com/en/api) to fetch:
- Real-time cryptocurrency prices
- 24-hour price changes
- Trading volume data
- Historical price data for charts

**Rate Limits**: CoinGecko's free API allows generous rate limits suitable for this application's needs.

## 📊 Supported Cryptocurrencies

| Cryptocurrency | Symbol | Features |
|---------------|--------|----------|
| Bitcoin       | BTC    | Price, Chart, Volume, 24h Change |
| Ethereum      | ETH    | Price, Volume, 24h Change |
| Cardano       | ADA    | Price, Volume, 24h Change |
| Polkadot      | DOT    | Price, Volume, 24h Change |
| Chainlink     | LINK   | Price, Volume, 24h Change |

## 🚀 Deployment

### Vercel 

## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for providing free cryptocurrency API
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling utilities
- [Chart.js](https://www.chartjs.org/) for powerful charting capabilities

## 📞 Contact

**Developer**: N0Vee  
**Repository**: [https://github.com/N0Vee/CoinPulse](https://github.com/N0Vee/CoinPulse)

---

⭐ **Star this repository if you found it helpful!**
