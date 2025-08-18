'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import WatchlistPage from '../../components/WatchlistPage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useFavorites } from '../../hooks/useFavorites';
import { useWebSocket } from '../../hooks/useWebSocket';
import { BINANCE_SYMBOLS } from '../../constants/cryptoConfig';

export default function Watchlist() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const {
    favorites,
    isLoading: favoritesLoading,
    toggleFavorite,
    isFavorite,
    clearAllFavorites
  } = useFavorites();

  const {
    data: realtimeData,
    connectionStatus,
    connectWebSocket,
    disconnect,
    refresh,
    lastUpdate: wsLastUpdate
  } = useWebSocket();

  // Simple WebSocket message handler
  const handleWebSocketMessage = (processedData) => {
    const { symbolInfo, price, change24h, volume24h } = processedData;

    setCryptoData(prevData => {
      const existingIndex = prevData.findIndex(item => item.id === symbolInfo.id);
      
      const updatedItem = {
        id: symbolInfo.id,
        name: symbolInfo.name,
        symbol: symbolInfo.symbol,
        price: price,
        change24h: change24h,
        volume24h: volume24h
      };

      if (existingIndex >= 0) {
        const newData = [...prevData];
        newData[existingIndex] = updatedItem;
        return newData;
      }
      
      return [...prevData, updatedItem];
    });

    setLastUpdate(new Date());
  };

  // Simple refresh handler
  const handleReconnect = () => {
    if (refresh) {
      refresh(
        BINANCE_SYMBOLS,
        handleWebSocketMessage,
        () => {}, // Connection status managed by useWebSocket hook
        setLoading
      );
    }
  };

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        // Generate initial crypto data from BINANCE_SYMBOLS
        const initialData = Object.entries(BINANCE_SYMBOLS).map(([binanceSymbol, info], index) => ({
          id: info.id,
          name: info.name,
          symbol: info.symbol,
          price: 0, // Will be updated by WebSocket
          change24h: 0, // Will be updated by WebSocket
          volume24h: 0, // Will be updated by WebSocket
          rank: index + 1
        }));
        
        setCryptoData(initialData);
        setLastUpdate(new Date());

        // Connect WebSocket
        connectWebSocket(
          BINANCE_SYMBOLS,
          handleWebSocketMessage,
          () => {}, // Connection status managed by useWebSocket hook
          setLoading
        );
      } catch (error) {
        console.error('Error initializing crypto data:', error);
        setCryptoData([]);
        setLoading(false);
      }
    };

    fetchCryptoData();

    return () => {
      if (disconnect) {
        disconnect();
      }
    };
  }, []);

  // Update crypto data with real-time prices
  useEffect(() => {
    if (realtimeData && realtimeData.length > 0 && cryptoData.length > 0) {
      setCryptoData(prevData => {
        return prevData.map(crypto => {
          const realtimeItem = realtimeData.find(item => 
            item.symbol === `${crypto.symbol}USDT`.toUpperCase()
          );
          
          if (realtimeItem) {
            return {
              ...crypto,
              price: realtimeItem.price,
              change24h: realtimeItem.change24h,
              volume24h: realtimeItem.volume24h || crypto.volume24h,
              lastUpdated: new Date().toISOString()
            };
          }
          
          return crypto;
        });
      });
      setLastUpdate(wsLastUpdate || new Date());
    }
  }, [realtimeData, wsLastUpdate, cryptoData.length]);

  const handleClearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all cryptocurrencies from your watchlist?')) {
      clearAllFavorites();
    }
  };

  if (loading || favoritesLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar 
          connectionStatus={connectionStatus}
          lastUpdate={lastUpdate}
          onReconnect={handleReconnect}
          loading={loading}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar 
        connectionStatus={connectionStatus}
        lastUpdate={lastUpdate}
        onReconnect={handleReconnect}
        loading={loading}
      />
      
      <div className="pt-20">
        <WatchlistPage
          favorites={favorites}
          cryptoData={cryptoData}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
          onClearAll={handleClearAllFavorites}
          isLoading={loading || favoritesLoading}
        />
      </div>
    </div>
  );
}
