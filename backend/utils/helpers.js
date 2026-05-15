/**
 * Batch array into chunks
 * @param {array} array - Array to batch
 * @param {number} size - Batch size
 * @returns {array} Array of batches
 */
export const batchArray = (array, size) => {
  const batches = [];
  for (let i = 0; i < array.length; i += size) {
    batches.push(array.slice(i, i + size));
  }
  return batches;
};

/**
 * Delay execution
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry function with exponential backoff
 */
export const retryAsync = async (fn, maxRetries = 3, delayMs = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(delayMs * Math.pow(2, i));
    }
  }
};
