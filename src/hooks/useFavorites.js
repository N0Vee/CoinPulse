'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'coinpulse_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (savedFavorites) {
          const parsed = JSON.parse(savedFavorites);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [favorites, isLoading]);

  // Add a cryptocurrency to favorites
  const addToFavorites = useCallback((crypto) => {
    setFavorites(prev => {
      // Check if already exists
      if (prev.find(fav => fav.symbol === crypto.symbol)) {
        return prev;
      }
      
      // Add the crypto with essential data
      const favoriteData = {
        symbol: crypto.symbol,
        name: crypto.name,
        id: crypto.id || crypto.symbol.toLowerCase(),
        addedAt: new Date().toISOString()
      };
      
      return [...prev, favoriteData];
    });
  }, []);

  // Remove a cryptocurrency from favorites
  const removeFromFavorites = useCallback((symbol) => {
    setFavorites(prev => prev.filter(fav => fav.symbol !== symbol));
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback((crypto) => {
    if (isFavorite(crypto.symbol)) {
      removeFromFavorites(crypto.symbol);
    } else {
      addToFavorites(crypto);
    }
  }, [addToFavorites, removeFromFavorites]);

  // Check if a cryptocurrency is in favorites
  const isFavorite = useCallback((symbol) => {
    return favorites.some(fav => fav.symbol === symbol);
  }, [favorites]);

  // Get favorites count
  const favoritesCount = favorites.length;

  // Clear all favorites
  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  // Reorder favorites (for drag & drop functionality)
  const reorderFavorites = useCallback((startIndex, endIndex) => {
    setFavorites(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoritesCount,
    clearAllFavorites,
    reorderFavorites
  };
};
