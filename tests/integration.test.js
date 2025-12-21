const request = require('supertest');
const axios = require('axios');
const app = require('../server');

// Integration test that makes actual API calls (when API key is provided)
describe('Integration Tests', () => {
  const realApiKey = process.env.ANU_QRNG_API_KEY;

  // Skip integration tests if no real API key is provided
  const conditionalDescribe = realApiKey ? describe : describe.skip;

  conditionalDescribe('Real ANU API Integration', () => {
    beforeAll(() => {
      // Set the real API key for integration tests
      process.env.ANU_QRNG_API_KEY = realApiKey;
    });

    test('should successfully fetch real quantum random numbers - uint8', async () => {
      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint8', length: '5' })
        .timeout(15000); // Allow extra time for real API call

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.type).toBe('uint8');
      expect(response.body.length).toBe(5);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(5);
      
      // Check that all values are valid uint8 (0-255)
      response.body.data.forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(255);
      });
    }, 15000);

    test('should successfully fetch real quantum random numbers - uint16', async () => {
      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint16', length: '3' })
        .timeout(15000);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.type).toBe('uint16');
      expect(response.body.length).toBe(3);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(3);
      
      // Check that all values are valid uint16 (0-65535)
      response.body.data.forEach(value => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(65535);
      });
    }, 15000);

    test('should successfully fetch real quantum random numbers - hex8 with size', async () => {
      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'hex8', length: '4', size: '2' })
        .timeout(15000);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.type).toBe('hex8');
      expect(response.body.length).toBe(4);
      expect(response.body.size).toBe(2);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(4);
      
      // Check that all values are valid hex8 strings
      response.body.data.forEach(value => {
        expect(typeof value).toBe('string');
        expect(value).toMatch(/^[0-9A-F]{2}$/i);
      });
    }, 15000);

    test('should successfully fetch real quantum random numbers - hex16 with size', async () => {
      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'hex16', length: '2', size: '3' })
        .timeout(15000);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.type).toBe('hex16');
      expect(response.body.length).toBe(2);
      expect(response.body.size).toBe(3);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2);
      
      // Check that all values are valid hex16 strings
      response.body.data.forEach(value => {
        expect(typeof value).toBe('string');
        expect(value).toMatch(/^[0-9A-F]{4}$/i);
      });
    }, 15000);
  });

  describe('Mock Integration Test Examples', () => {
    beforeEach(() => {
      // Set up test API key
      process.env.ANU_QRNG_API_KEY = 'test-key';
      jest.clearAllMocks();
    });

    afterEach(() => {
      delete process.env.ANU_QRNG_API_KEY;
    });

    test('should demonstrate complete request/response cycle with mocked ANU API', async () => {
      // Mock axios for this test
      jest.mock('axios');
      const mockedAxios = require('axios');

      const mockAnuResponse = {
        data: {
          type: 'uint8',
          length: 10,
          size: 1,
          data: [42, 108, 75, 201, 15, 83, 156, 29, 190, 67]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockAnuResponse);

      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint8', length: '10' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        type: 'uint8',
        length: 10,
        data: [42, 108, 75, 201, 15, 83, 156, 29, 190, 67]
      });

      // Verify the request was made with correct parameters
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.quantumnumbers.anu.edu.au',
        {
          params: { type: 'uint8', length: '10' },
          headers: {
            'x-api-key': 'test-key',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );
    });
  });
});

describe('Manual Testing Helper', () => {
  test('should log example curl commands for manual testing', () => {
    const baseUrl = 'http://localhost:3000';
    
    console.log('\n=== Manual Testing Commands ===');
    console.log(`\n1. Test uint8 type:`);
    console.log(`curl "${baseUrl}/api/qrng?type=uint8&length=5"`);
    
    console.log(`\n2. Test uint16 type:`);
    console.log(`curl "${baseUrl}/api/qrng?type=uint16&length=3"`);
    
    console.log(`\n3. Test hex8 with size:`);
    console.log(`curl "${baseUrl}/api/qrng?type=hex8&length=4&size=2"`);
    
    console.log(`\n4. Test hex16 with size:`);
    console.log(`curl "${baseUrl}/api/qrng?type=hex16&length=2&size=3"`);
    
    console.log(`\n5. Test validation errors:`);
    console.log(`curl "${baseUrl}/api/qrng?type=invalid&length=5"`);
    console.log(`curl "${baseUrl}/api/qrng?type=uint8&length=2000"`);
    console.log(`curl "${baseUrl}/api/qrng?type=uint8&length=5&size=2"`);
    
    console.log(`\n6. Test health endpoint:`);
    console.log(`curl "${baseUrl}/api/health"`);
    console.log('================================\n');
  });
});