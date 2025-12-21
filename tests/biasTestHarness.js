/**
 * Quantum Random Number Bias Test Harness
 * 
 * Tests distribution uniformity when mapping uint16 quantum random numbers
 * to smaller ranges (like 1-6 for dice simulation)
 */

const {
  mapQuantumToRange,
  mapQuantumToRangeWithRetry,
  analyzeBias
} = require('../utils/quantumMapper');

/**
 * Generates mock uint16 quantum random numbers
 * Uses a simple linear congruential generator for reproducible testing
 * 
 * @param {number} count - Number of values to generate
 * @param {number} seed - Random seed for reproducibility
 * @returns {number[]} - Array of mock uint16 values
 */
function generateMockQuantumData(count, seed = 12345) {
  const values = [];
  let current = seed % 65536;
  
  for (let i = 0; i < count; i++) {
    // Linear Congruential Generator (simple but effective for testing)
    current = (current * 1103515245 + 12345) % 65536;
    values.push(current);
  }
  
  return values;
}

/**
 * Generates truly random mock data for comparison
 * 
 * @param {number} count - Number of values to generate
 * @returns {number[]} - Array of mock uint16 values
 */
function generateRandomMockData(count) {
  const values = [];
  
  for (let i = 0; i < count; i++) {
    values.push(Math.floor(Math.random() * 65536));
  }
  
  return values;
}

/**
 * Tests distribution bias for a given range mapping
 * 
 * @param {number} min - Minimum value of target range
 * @param {number} max - Maximum value of target range
 * @param {number} sampleSize - Number of samples to test
 * @param {boolean} useRejectionSampling - Whether to use rejection sampling
 * @param {boolean} useRandomData - Whether to use truly random mock data
 * @returns {object} - Test results with frequency analysis
 */
function testDistributionBias(min, max, sampleSize = 10000, useRejectionSampling = false, useRandomData = false) {
  console.log(`\n🧪 Testing distribution bias for range [${min}, ${max}]`);
  console.log(`📊 Sample size: ${sampleSize.toLocaleString()}`);
  console.log(`🔬 Method: ${useRejectionSampling ? 'Rejection Sampling' : 'Modulo Mapping'}`);
  console.log(`🎲 Data source: ${useRandomData ? 'Random Mock' : 'Deterministic Mock'}`);
  
  // Generate mock quantum data
  const quantumData = useRandomData 
    ? generateRandomMockData(sampleSize * 2) // Extra for rejection sampling
    : generateMockQuantumData(sampleSize * 2, 42);
  
  // Analyze theoretical bias
  const biasAnalysis = analyzeBias(min, max);
  console.log(`\n📈 Theoretical Analysis:`);
  console.log(`   Range size: ${biasAnalysis.range}`);
  console.log(`   Perfectly divisible: ${biasAnalysis.perfectlyDivisible}`);
  console.log(`   Rejection rate: ${biasAnalysis.rejectionRate}`);
  console.log(`   Base frequency: ${biasAnalysis.baseFrequency}`);
  console.log(`   Max frequency: ${biasAnalysis.maxFrequency}`);
  
  // Count frequencies
  const frequencies = {};
  const rejectedCount = [];
  let actualSamples = 0;
  
  // Initialize frequency counters
  for (let i = min; i <= max; i++) {
    frequencies[i] = 0;
  }
  
  // Map quantum values to target range
  let quantumIndex = 0;
  while (actualSamples < sampleSize && quantumIndex < quantumData.length) {
    if (useRejectionSampling) {
      // Use rejection sampling approach
      const remaining = quantumData.slice(quantumIndex);
      const result = mapQuantumToRangeWithRetry(remaining, min, max);
      
      if (result.value !== null) {
        frequencies[result.value]++;
        actualSamples++;
        rejectedCount.push(...result.rejectedValues);
        quantumIndex += result.attemptsUsed;
      } else {
        break;
      }
    } else {
      // Use simple modulo mapping
      const result = mapQuantumToRange(quantumData[quantumIndex], min, max, false);
      frequencies[result.value]++;
      actualSamples++;
      quantumIndex++;
    }
  }
  
  // Calculate statistics
  const expectedFrequency = actualSamples / (max - min + 1);
  const actualRejectionRate = rejectedCount.length / quantumIndex * 100;
  
  // Calculate chi-squared statistic for uniformity test
  let chiSquared = 0;
  const results = [];
  
  console.log(`\n📋 Frequency Results (${actualSamples} samples):`);
  console.log('Value | Frequency | Expected | Deviation | % of Total');
  console.log('------|-----------|----------|-----------|------------');
  
  for (let i = min; i <= max; i++) {
    const freq = frequencies[i];
    const expected = useRejectionSampling ? expectedFrequency : biasAnalysis.expectedFrequencies[i];
    const deviation = freq - expected;
    const percentage = (freq / actualSamples * 100).toFixed(2);
    
    // Chi-squared calculation
    chiSquared += (deviation * deviation) / expected;
    
    console.log(`  ${i.toString().padStart(2)}  | ${freq.toString().padStart(8)} | ${Math.round(expected).toString().padStart(8)} | ${deviation.toFixed(1).padStart(9)} | ${percentage.padStart(9)}%`);
    
    results.push({
      value: i,
      frequency: freq,
      expected: Math.round(expected),
      deviation: deviation,
      percentage: parseFloat(percentage)
    });
  }
  
  // Calculate additional statistics
  const frequencies_values = Object.values(frequencies);
  const minFreq = Math.min(...frequencies_values);
  const maxFreq = Math.max(...frequencies_values);
  const range_spread = maxFreq - minFreq;
  const coefficientOfVariation = calculateCoefficientOfVariation(frequencies_values);
  
  console.log(`\n📊 Distribution Statistics:`);
  console.log(`   Min frequency: ${minFreq}`);
  console.log(`   Max frequency: ${maxFreq}`);
  console.log(`   Frequency spread: ${range_spread}`);
  console.log(`   Coefficient of variation: ${coefficientOfVariation.toFixed(4)}`);
  console.log(`   Chi-squared statistic: ${chiSquared.toFixed(4)}`);
  
  if (useRejectionSampling) {
    console.log(`   Actual rejection rate: ${actualRejectionRate.toFixed(4)}%`);
    console.log(`   Values rejected: ${rejectedCount.length}`);
  }
  
  // Bias assessment
  const maxDeviation = Math.max(...results.map(r => Math.abs(r.deviation)));
  const biasLevel = assessBiasLevel(maxDeviation, expectedFrequency);
  
  console.log(`\n🎯 Bias Assessment:`);
  console.log(`   Max deviation: ${maxDeviation.toFixed(1)}`);
  console.log(`   Bias level: ${biasLevel}`);
  console.log(`   Distribution quality: ${assessDistributionQuality(coefficientOfVariation, range_spread, actualSamples)}`);
  
  return {
    results,
    statistics: {
      actualSamples,
      minFreq,
      maxFreq,
      range_spread,
      coefficientOfVariation,
      chiSquared,
      maxDeviation,
      biasLevel,
      actualRejectionRate: useRejectionSampling ? actualRejectionRate : 0,
      rejectedCount: rejectedCount.length
    },
    biasAnalysis
  };
}

/**
 * Calculates coefficient of variation for frequency distribution
 */
function calculateCoefficientOfVariation(frequencies) {
  const mean = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
  const variance = frequencies.reduce((acc, freq) => acc + Math.pow(freq - mean, 2), 0) / frequencies.length;
  const stdDev = Math.sqrt(variance);
  return stdDev / mean;
}

/**
 * Assesses bias level based on maximum deviation
 */
function assessBiasLevel(maxDeviation, expectedFreq) {
  const relativeDeviation = maxDeviation / expectedFreq;
  
  if (relativeDeviation < 0.01) return 'Excellent (< 1%)';
  if (relativeDeviation < 0.05) return 'Good (< 5%)';
  if (relativeDeviation < 0.1) return 'Fair (< 10%)';
  if (relativeDeviation < 0.2) return 'Poor (< 20%)';
  return 'Very Poor (≥ 20%)';
}

/**
 * Assesses overall distribution quality
 */
function assessDistributionQuality(cv, spread, sampleSize) {
  const expectedSpread = Math.sqrt(sampleSize / 6); // Rough estimate for dice
  const normalizedSpread = spread / expectedSpread;
  
  if (cv < 0.02 && normalizedSpread < 1.5) return 'Excellent';
  if (cv < 0.05 && normalizedSpread < 2.0) return 'Good';
  if (cv < 0.1 && normalizedSpread < 3.0) return 'Fair';
  return 'Poor';
}

/**
 * Runs comprehensive bias testing suite
 */
function runComprehensiveBiasTest() {
  console.log('🔬 QUANTUM RANDOM NUMBER BIAS TEST HARNESS');
  console.log('==========================================\n');
  
  const testCases = [
    { name: 'Dice Roll (1-6)', min: 1, max: 6, samples: 10000 },
    { name: 'Coin Flip (0-1)', min: 0, max: 1, samples: 10000 },
    { name: 'D20 Roll (1-20)', min: 1, max: 20, samples: 20000 },
    { name: 'Percent (0-99)', min: 0, max: 99, samples: 50000 },
    { name: 'Perfect Division (0-255)', min: 0, max: 255, samples: 10000 }
  ];
  
  const results = [];
  
  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎯 TEST CASE: ${testCase.name}`);
    console.log(`${'='.repeat(60)}`);
    
    // Test with modulo mapping
    console.log('\n1️⃣ MODULO MAPPING:');
    const moduloResult = testDistributionBias(testCase.min, testCase.max, testCase.samples, false);
    
    // Test with rejection sampling
    console.log('\n2️⃣ REJECTION SAMPLING:');
    const rejectionResult = testDistributionBias(testCase.min, testCase.max, testCase.samples, true);
    
    results.push({
      testCase,
      modulo: moduloResult,
      rejection: rejectionResult
    });
  }
  
  // Summary comparison
  console.log(`\n${'='.repeat(80)}`);
  console.log('📈 SUMMARY COMPARISON');
  console.log(`${'='.repeat(80)}`);
  console.log('Test Case              | Method           | Max Dev | Bias Level    | Quality');
  console.log('-----------------------|------------------|---------|---------------|----------');
  
  for (const result of results) {
    const name = result.testCase.name.padEnd(20);
    
    // Modulo results
    const modMaxDev = result.modulo.statistics.maxDeviation.toFixed(1).padStart(6);
    const modBias = result.modulo.statistics.biasLevel.padEnd(12);
    const modQuality = assessDistributionQuality(
      result.modulo.statistics.coefficientOfVariation,
      result.modulo.statistics.range_spread,
      result.modulo.statistics.actualSamples
    ).padEnd(8);
    
    console.log(`${name} | Modulo Mapping   | ${modMaxDev} | ${modBias} | ${modQuality}`);
    
    // Rejection results
    const rejMaxDev = result.rejection.statistics.maxDeviation.toFixed(1).padStart(6);
    const rejBias = result.rejection.statistics.biasLevel.padEnd(12);
    const rejQuality = assessDistributionQuality(
      result.rejection.statistics.coefficientOfVariation,
      result.rejection.statistics.range_spread,
      result.rejection.statistics.actualSamples
    ).padEnd(8);
    
    console.log(`${' '.repeat(20)} | Rejection Sample | ${rejMaxDev} | ${rejBias} | ${rejQuality}`);
    console.log('-----------------------|------------------|---------|---------------|----------');
  }
  
  console.log('\n✅ Bias testing complete! See results above for distribution quality analysis.');
  
  return results;
}

// Export for use in tests and as standalone script
module.exports = {
  generateMockQuantumData,
  generateRandomMockData,
  testDistributionBias,
  runComprehensiveBiasTest,
  calculateCoefficientOfVariation,
  assessBiasLevel,
  assessDistributionQuality
};

// Allow running as standalone script
if (require.main === module) {
  runComprehensiveBiasTest();
}