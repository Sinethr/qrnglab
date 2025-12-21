/**
 * Quantum Random Number Range Mapper
 * 
 * Provides functions to map quantum random numbers (uint16: 0-65535) 
 * to arbitrary ranges with minimal bias using advanced techniques.
 */

/**
 * Maps a uint16 quantum random number to a specified range with minimal bias
 * Uses rejection sampling when possible to eliminate bias completely
 * 
 * @param {number} rawInt - Raw quantum random integer (0-65535)
 * @param {number} min - Minimum value of target range (inclusive)
 * @param {number} max - Maximum value of target range (inclusive)
 * @param {boolean} useRejectionSampling - Whether to use rejection sampling (default: true)
 * @returns {{value: number, rejected: boolean, method: string}} - Mapped value with metadata
 */
function mapQuantumToRange(rawInt, min, max, useRejectionSampling = true) {
  // Input validation
  if (!Number.isInteger(rawInt) || rawInt < 0 || rawInt > 65535) {
    throw new Error('rawInt must be an integer between 0 and 65535');
  }
  
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    throw new Error('min and max must be integers with min <= max');
  }

  const range = max - min + 1;
  const maxUint16 = 65536; // 2^16

  // For single value ranges, return immediately
  if (range === 1) {
    return {
      value: min,
      rejected: false,
      method: 'single_value'
    };
  }

  // Calculate bias metrics
  const quotient = Math.floor(maxUint16 / range);
  const remainder = maxUint16 % range;
  const biasThreshold = quotient * range; // Values >= this cause bias

  // Rejection sampling approach - eliminates bias completely
  if (useRejectionSampling && remainder !== 0) {
    if (rawInt >= biasThreshold) {
      return {
        value: null,
        rejected: true,
        method: 'rejection_sampling',
        biasInfo: {
          threshold: biasThreshold,
          wouldHaveBeen: min + (rawInt % range)
        }
      };
    }
  }

  // Standard modulo mapping
  const mapped = min + (rawInt % range);

  return {
    value: mapped,
    rejected: false,
    method: useRejectionSampling && remainder !== 0 ? 'rejection_sampling' : 'modulo_mapping',
    biasInfo: remainder === 0 ? null : {
      remainder,
      quotient,
      biasThreshold,
      perfectlyDivisible: remainder === 0
    }
  };
}

/**
 * Simpler version that just returns the mapped value (backwards compatible)
 * 
 * @param {number} rawInt - Raw quantum random integer (0-65535)
 * @param {number} min - Minimum value of target range (inclusive)
 * @param {number} max - Maximum value of target range (inclusive)
 * @returns {number} - Mapped value
 */
function mapQuantumToRangeSimple(rawInt, min, max) {
  const result = mapQuantumToRange(rawInt, min, max, false);
  return result.value;
}

/**
 * Advanced mapper that handles rejection sampling with multiple quantum values
 * Continues sampling until a non-rejected value is found
 * 
 * @param {number[]} quantumInts - Array of quantum random integers
 * @param {number} min - Minimum value of target range (inclusive)
 * @param {number} max - Maximum value of target range (inclusive)
 * @returns {{value: number, attemptsUsed: number, rejectedValues: number[]}} - Result with metadata
 */
function mapQuantumToRangeWithRetry(quantumInts, min, max) {
  const rejectedValues = [];
  
  for (let i = 0; i < quantumInts.length; i++) {
    const result = mapQuantumToRange(quantumInts[i], min, max, true);
    
    if (!result.rejected) {
      return {
        value: result.value,
        attemptsUsed: i + 1,
        rejectedValues,
        efficiency: ((i + 1 - rejectedValues.length) / (i + 1) * 100).toFixed(2) + '%'
      };
    } else {
      rejectedValues.push(quantumInts[i]);
    }
  }
  
  // Fallback if all values rejected (very rare)
  const fallbackResult = mapQuantumToRange(quantumInts[quantumInts.length - 1], min, max, false);
  return {
    value: fallbackResult.value,
    attemptsUsed: quantumInts.length,
    rejectedValues,
    efficiency: '0%',
    fallbackUsed: true
  };
}

/**
 * Analyzes bias for a given range mapping
 * 
 * @param {number} min - Minimum value of target range
 * @param {number} max - Maximum value of target range
 * @returns {object} - Bias analysis information
 */
function analyzeBias(min, max) {
  const range = max - min + 1;
  const maxUint16 = 65536;
  const quotient = Math.floor(maxUint16 / range);
  const remainder = maxUint16 % range;
  
  const perfectlyDivisible = remainder === 0;
  const biasThreshold = quotient * range;
  
  // Calculate expected frequencies
  const baseFrequency = quotient;
  const biasedValues = remainder; // First 'remainder' values get +1 extra occurrence
  const unbiasedValues = range - remainder;
  
  return {
    range,
    perfectlyDivisible,
    remainder,
    quotient,
    biasThreshold,
    biasedValues,
    unbiasedValues,
    baseFrequency,
    maxFrequency: baseFrequency + (remainder > 0 ? 1 : 0),
    rejectionRate: remainder > 0 ? (remainder / maxUint16 * 100).toFixed(4) + '%' : '0%',
    expectedFrequencies: generateExpectedFrequencies(min, max, quotient, remainder)
  };
}

/**
 * Generates expected frequency distribution for bias analysis
 * 
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value  
 * @param {number} quotient - Base frequency
 * @param {number} remainder - Bias remainder
 * @returns {object} - Expected frequencies for each value
 */
function generateExpectedFrequencies(min, max, quotient, remainder) {
  const frequencies = {};
  
  for (let i = min; i <= max; i++) {
    const valueIndex = i - min;
    frequencies[i] = quotient + (valueIndex < remainder ? 1 : 0);
  }
  
  return frequencies;
}

module.exports = {
  mapQuantumToRange,
  mapQuantumToRangeSimple,
  mapQuantumToRangeWithRetry,
  analyzeBias,
  generateExpectedFrequencies
};