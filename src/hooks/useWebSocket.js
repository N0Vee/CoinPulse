import { useRef, useCallback } from 'react';

export const useWebSocket = () => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connectWebSocket = useCallback((binanceSymbols, onMessage, onStatusChange, onLoading) => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      // Create WebSocket connection to Binance combined streams
      const streams = Object.keys(binanceSymbols)
        .map(s => `${s.toLowerCase()}@ticker`)
        .join('/');
      const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        onStatusChange('Connected');
        onLoading(false);

        // Clear any existing reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);

          // Handle combined stream format
          if (response.stream && response.data) {
            const data = response.data;
            const symbol = data.s; // Symbol like BTCUSDT
            const symbolInfo = binanceSymbols[symbol];

            if (symbolInfo) {
              const price = parseFloat(data.c); // Current price
              const change24h = parseFloat(data.P); // 24h price change percentage
              const volume24h = parseFloat(data.q); // 24h volume in quote asset

              onMessage({
                symbolInfo,
                price,
                change24h,
                volume24h,
                symbol
              });
            }
          }
        } catch (error) {
          // Handle parsing errors silently
        }
      };

      wsRef.current.onclose = () => {
        onStatusChange('Disconnected');

        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          onStatusChange('Reconnecting...');
          connectWebSocket(binanceSymbols, onMessage, onStatusChange, onLoading);
        }, 5000);
      };

      wsRef.current.onerror = (error) => {
        onStatusChange('Error');
      };

    } catch (error) {
      onStatusChange('Error');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  const refresh = useCallback((binanceSymbols, onMessage, onStatusChange, onLoading) => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    onLoading(true);
    connectWebSocket(binanceSymbols, onMessage, onStatusChange, onLoading);
  }, [connectWebSocket]);

  return { connectWebSocket, disconnect, refresh };
};
