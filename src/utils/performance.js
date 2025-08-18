// Performance utility functions for optimizing the crypto app

/**
 * Debounce function to limit the frequency of expensive operations
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function to limit the frequency of function calls
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(null, args);
    }
  };
};

/**
 * Memoization utility for expensive calculations
 * @param {Function} fn - Function to memoize
 * @param {Function} keyGenerator - Optional key generator function
 * @returns {Function} Memoized function
 */
export const memoize = (fn, keyGenerator = JSON.stringify) => {
  const cache = new Map();
  return (...args) => {
    const key = keyGenerator(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(null, args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Batch updates to prevent excessive re-renders
 * @param {Array} updates - Array of update functions
 * @param {number} delay - Batch delay in milliseconds
 */
export const batchUpdates = (updates, delay = 16) => {
  return new Promise(resolve => {
    setTimeout(() => {
      updates.forEach(update => update());
      resolve();
    }, delay);
  });
};

/**
 * Lazy load images with intersection observer
 * @param {string} selector - CSS selector for images to lazy load
 */
export const lazyLoadImages = (selector = 'img[data-src]') => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll(selector).forEach(img => {
      imageObserver.observe(img);
    });
  }
};

/**
 * Performance measurement utility
 * @param {string} name - Performance mark name
 * @param {Function} fn - Function to measure
 */
export const measurePerformance = async (name, fn) => {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  const measureName = `${name}-duration`;

  performance.mark(startMark);
  const result = await fn();
  performance.mark(endMark);
  performance.measure(measureName, startMark, endMark);

  const measure = performance.getEntriesByName(measureName)[0];
  console.log(`${name} took ${measure.duration.toFixed(2)}ms`);

  return result;
};

/**
 * Optimized array update utility
 * @param {Array} array - Original array
 * @param {*} item - Item to update/add
 * @param {Function} keyFn - Function to generate key for comparison
 * @returns {Array} Updated array
 */
export const optimizedArrayUpdate = (array, item, keyFn = (x) => x.id) => {
  const existingIndex = array.findIndex(existing => keyFn(existing) === keyFn(item));
  
  if (existingIndex >= 0) {
    // Update existing item efficiently
    const newArray = [...array];
    newArray[existingIndex] = { ...array[existingIndex], ...item };
    return newArray;
  }
  
  // Add new item
  return [...array, item];
};

/**
 * Chunk processing for large datasets
 * @param {Array} array - Array to process
 * @param {number} chunkSize - Size of each chunk
 * @param {Function} processor - Function to process each chunk
 * @returns {Promise} Promise that resolves when all chunks are processed
 */
export const processInChunks = async (array, chunkSize = 100, processor) => {
  const results = [];
  
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    const result = await processor(chunk);
    results.push(result);
    
    // Allow other tasks to run
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results.flat();
};

/**
 * WebSocket connection optimizer
 * @param {string} url - WebSocket URL
 * @param {Object} options - Connection options
 * @returns {Object} Optimized WebSocket wrapper
 */
export const createOptimizedWebSocket = (url, options = {}) => {
  let ws = null;
  let reconnectCount = 0;
  let messageQueue = [];
  
  const { maxReconnects = 5, reconnectDelay = 1000 } = options;
  
  const connect = () => {
    ws = new WebSocket(url);
    
    ws.onopen = () => {
      reconnectCount = 0;
      // Send queued messages
      messageQueue.forEach(msg => ws.send(msg));
      messageQueue = [];
      options.onOpen?.();
    };
    
    ws.onmessage = (event) => {
      options.onMessage?.(event);
    };
    
    ws.onclose = () => {
      if (reconnectCount < maxReconnects) {
        setTimeout(() => {
          reconnectCount++;
          connect();
        }, reconnectDelay * Math.pow(2, reconnectCount)); // Exponential backoff
      }
      options.onClose?.();
    };
    
    ws.onerror = (error) => {
      options.onError?.(error);
    };
  };
  
  connect();
  
  return {
    send: (message) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(message);
      } else {
        messageQueue.push(message);
      }
    },
    close: () => {
      ws?.close();
    },
    getReadyState: () => ws?.readyState || WebSocket.CLOSED
  };
};
