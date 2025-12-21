/**
 * Dice Simulation Example
 * 
 * Demonstrates the quantum range mapper with a practical dice rolling example
 */

const { mapQuantumToRange, mapQuantumToRangeWithRetry, analyzeBias } = require('../utils/quantumMapper');

/**
 * Simulates rolling dice using quantum random numbers
 */
async function simulateDiceRolls() {
  console.log('🎲 QUANTUM DICE SIMULATION');
  console.log('==========================\n');
  
  // Analyze the bias for dice (1-6)
  const biasAnalysis = analyzeBias(1, 6);
  console.log('📊 Bias Analysis for 1-6 range:');
  console.log(`   Perfect distribution: ${biasAnalysis.perfectlyDivisible ? 'Yes' : 'No'}`);
  console.log(`   Bias remainder: ${biasAnalysis.remainder}`);
  console.log(`   Rejection rate: ${biasAnalysis.rejectionRate}`);
  console.log('   Expected frequencies per 65,536 samples:');
  Object.entries(biasAnalysis.expectedFrequencies).forEach(([value, freq]) => {
    console.log(`     ${value}: ${freq}`);
  });
  console.log('');
  
  // Simulate some dice rolls with different methods
  const mockQuantumValues = [
    12345, 54321, 65530, 65531, 65532, 65533, 65534, 65535,
    1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000
  ];
  
  console.log('🔄 Simulating dice rolls with different methods:\n');
  
  // Method 1: Simple modulo mapping
  console.log('Method 1 - Simple Modulo Mapping:');
  console.log('Raw Value | Dice Roll | Method');
  console.log('----------|-----------|--------');
  
  for (let i = 0; i < 8; i++) {
    const raw = mockQuantumValues[i];
    const result = mapQuantumToRange(raw, 1, 6, false);
    console.log(`${raw.toString().padStart(8)} | ${result.value.toString().padStart(8)} | ${result.method}`);
  }
  
  // Method 2: Rejection sampling
  console.log('\nMethod 2 - Rejection Sampling:');
  console.log('Raw Value | Dice Roll | Status   | Method');
  console.log('----------|-----------|----------|--------');
  
  for (let i = 0; i < 8; i++) {
    const raw = mockQuantumValues[i];
    const result = mapQuantumToRange(raw, 1, 6, true);
    const status = result.rejected ? 'REJECTED' : 'ACCEPTED';
    const value = result.rejected ? 'N/A' : result.value.toString();
    console.log(`${raw.toString().padStart(8)} | ${value.padStart(8)} | ${status.padStart(8)} | ${result.method}`);
  }
  
  // Method 3: Rejection sampling with retry
  console.log('\nMethod 3 - Rejection Sampling with Retry:');
  console.log('Attempt | Final Roll | Attempts Used | Efficiency');
  console.log('--------|------------|---------------|------------');
  
  for (let i = 0; i < 4; i++) {
    const quantumBatch = mockQuantumValues.slice(i * 4, (i + 1) * 4);
    const result = mapQuantumToRangeWithRetry(quantumBatch, 1, 6);
    console.log(`${(i + 1).toString().padStart(6)} | ${result.value.toString().padStart(9)} | ${result.attemptsUsed.toString().padStart(12)} | ${result.efficiency.padStart(10)}`);
  }
  
  // Demonstrate bias in edge cases
  console.log('\n🚨 Demonstrating bias in edge cases:');
  console.log('\nValues near bias threshold (65532+):');
  console.log('Raw Value | Modulo Roll | Rejection Result');
  console.log('----------|-------------|------------------');
  
  const biasThreshold = Math.floor(65536 / 6) * 6; // 65532
  const edgeCases = [biasThreshold - 1, biasThreshold, biasThreshold + 1, 65535];
  
  for (const raw of edgeCases) {
    const moduloResult = mapQuantumToRange(raw, 1, 6, false);
    const rejectionResult = mapQuantumToRange(raw, 1, 6, true);
    const rejectionStatus = rejectionResult.rejected ? 'REJECTED' : `ACCEPTED (${rejectionResult.value})`;
    console.log(`${raw.toString().padStart(8)} | ${moduloResult.value.toString().padStart(10)} | ${rejectionStatus}`);
  }
  
  console.log('\n✨ This demonstrates how rejection sampling eliminates bias');
  console.log('   by rejecting values that would cause uneven distribution!');
}

// Run the simulation
if (require.main === module) {
  simulateDiceRolls();
}

module.exports = { simulateDiceRolls };