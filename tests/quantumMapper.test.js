const {
  mapQuantumToRange,
  mapQuantumToRangeSimple,
  mapQuantumToRangeWithRetry,
  analyzeBias,
  generateExpectedFrequencies
} = require('../utils/quantumMapper');

describe('Quantum Range Mapper', () => {
  describe('mapQuantumToRange', () => {
    test('should handle basic range mapping', () => {
      const result = mapQuantumToRange(32768, 1, 6); // Middle value
      expect(result.value).toBeGreaterThanOrEqual(1);
      expect(result.value).toBeLessThanOrEqual(6);
      expect(typeof result.rejected).toBe('boolean');
      expect(typeof result.method).toBe('string');
    });

    test('should handle single value ranges', () => {
      const result = mapQuantumToRange(12345, 42, 42);
      expect(result.value).toBe(42);
      expect(result.rejected).toBe(false);
      expect(result.method).toBe('single_value');
    });

    test('should validate input parameters', () => {
      expect(() => mapQuantumToRange(-1, 1, 6)).toThrow();
      expect(() => mapQuantumToRange(65536, 1, 6)).toThrow();
      expect(() => mapQuantumToRange(100, 6, 1)).toThrow();
      expect(() => mapQuantumToRange(100.5, 1, 6)).toThrow();
    });

    test('should perform rejection sampling when enabled', () => {
      // Test with a range that creates bias (1-6 = range of 6, 65536 % 6 = 4)
      const biasThreshold = Math.floor(65536 / 6) * 6; // 65532
      
      // Value that should be rejected
      const result = mapQuantumToRange(biasThreshold + 1, 1, 6, true);
      expect(result.rejected).toBe(true);
      expect(result.value).toBe(null);
      expect(result.method).toBe('rejection_sampling');
    });

    test('should not reject when rejection sampling disabled', () => {
      const biasThreshold = Math.floor(65536 / 6) * 6;
      const result = mapQuantumToRange(biasThreshold + 1, 1, 6, false);
      expect(result.rejected).toBe(false);
      expect(result.value).toBeGreaterThanOrEqual(1);
      expect(result.value).toBeLessThanOrEqual(6);
    });

    test('should handle perfectly divisible ranges', () => {
      // Range of 256: 65536 / 256 = 256 exactly, no bias
      const result = mapQuantumToRange(12345, 0, 255);
      expect(result.rejected).toBe(false);
      expect(result.biasInfo).toBe(null);
    });
  });

  describe('mapQuantumToRangeSimple', () => {
    test('should return just the mapped value', () => {
      const result = mapQuantumToRangeSimple(32768, 1, 6);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(6);
    });
  });

  describe('mapQuantumToRangeWithRetry', () => {
    test('should handle successful mapping on first try', () => {
      const result = mapQuantumToRangeWithRetry([1000], 1, 6);
      expect(result.value).toBeGreaterThanOrEqual(1);
      expect(result.value).toBeLessThanOrEqual(6);
      expect(result.attemptsUsed).toBe(1);
      expect(result.rejectedValues).toHaveLength(0);
    });

    test('should handle rejection and retry', () => {
      const biasThreshold = Math.floor(65536 / 6) * 6;
      const result = mapQuantumToRangeWithRetry([biasThreshold + 1, 1000], 1, 6);
      expect(result.value).toBeGreaterThanOrEqual(1);
      expect(result.value).toBeLessThanOrEqual(6);
      expect(result.attemptsUsed).toBe(2);
      expect(result.rejectedValues).toHaveLength(1);
    });

    test('should use fallback when all values rejected', () => {
      const biasThreshold = Math.floor(65536 / 6) * 6;
      const rejectedValues = [biasThreshold + 1, biasThreshold + 2];
      const result = mapQuantumToRangeWithRetry(rejectedValues, 1, 6);
      expect(result.value).toBeGreaterThanOrEqual(1);
      expect(result.value).toBeLessThanOrEqual(6);
      expect(result.fallbackUsed).toBe(true);
    });
  });

  describe('analyzeBias', () => {
    test('should analyze bias for dice range (1-6)', () => {
      const analysis = analyzeBias(1, 6);
      expect(analysis.range).toBe(6);
      expect(analysis.perfectlyDivisible).toBe(false);
      expect(analysis.remainder).toBe(4); // 65536 % 6 = 4
      expect(analysis.quotient).toBe(10922); // floor(65536 / 6)
      expect(analysis.biasedValues).toBe(4); // First 4 values get extra occurrence
      expect(analysis.unbiasedValues).toBe(2); // Last 2 values don't
    });

    test('should analyze perfectly divisible range', () => {
      const analysis = analyzeBias(0, 255); // 256 values, perfectly divisible
      expect(analysis.perfectlyDivisible).toBe(true);
      expect(analysis.remainder).toBe(0);
      expect(analysis.biasedValues).toBe(0);
      expect(analysis.rejectionRate).toBe('0%');
    });

    test('should generate correct expected frequencies', () => {
      const analysis = analyzeBias(1, 6);
      const expected = analysis.expectedFrequencies;
      
      // First 4 values (1,2,3,4) should have frequency 10923
      // Last 2 values (5,6) should have frequency 10922
      expect(expected[1]).toBe(10923);
      expect(expected[2]).toBe(10923);
      expect(expected[3]).toBe(10923);
      expect(expected[4]).toBe(10923);
      expect(expected[5]).toBe(10922);
      expect(expected[6]).toBe(10922);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum range (0-1)', () => {
      const result = mapQuantumToRange(32768, 0, 1);
      expect([0, 1]).toContain(result.value);
    });

    test('should handle large ranges', () => {
      const result = mapQuantumToRange(32768, 1, 1000);
      expect(result.value).toBeGreaterThanOrEqual(1);
      expect(result.value).toBeLessThanOrEqual(1000);
    });

    test('should handle negative ranges', () => {
      const result = mapQuantumToRange(32768, -10, 10);
      expect(result.value).toBeGreaterThanOrEqual(-10);
      expect(result.value).toBeLessThanOrEqual(10);
    });

    test('should handle boundary values', () => {
      const minResult = mapQuantumToRange(0, 1, 6, false);
      const maxResult = mapQuantumToRange(65535, 1, 6, false);
      
      expect(minResult.value).toBeGreaterThanOrEqual(1);
      expect(minResult.value).toBeLessThanOrEqual(6);
      expect(maxResult.value).toBeGreaterThanOrEqual(1);
      expect(maxResult.value).toBeLessThanOrEqual(6);
    });
  });
});