const request = require('supertest');
const axios = require('axios');

// Mock axios before requiring the app
jest.mock('axios');
const mockedAxios = axios;

const app = require('../server');

describe('GET /api/qrng', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up environment variable for testing
    process.env.ANU_QRNG_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    // Clean up environment
    delete process.env.ANU_QRNG_API_KEY;
  });

  describe('Parameter Validation', () => {
    test('should return 400 when type parameter is missing', async () => {
      const response = await request(app)
        .get('/api/qrng')
        .query({ length: '10' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Missing required parameter: type'
      });
    });

    test('should return 400 when length parameter is missing', async () => {
      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint8' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Missing required parameter: length'
      });
    });

    test('should return 400 for invalid type parameter', async () => {
      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'invalid', length: '10' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid type parameter. Must be one of: uint8, uint16, hex8, hex16'
      });
    });

    test('should return 400 for invalid length parameter', async () => {
      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint8', length: '0' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid length parameter. Must be a number between 1 and 1024'
      });
    });

    test('should return 400 for length greater than 1024', async () => {
      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint8', length: '1025' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid length parameter. Must be a number between 1 and 1024'
      });
    });

    test('should return 400 when size is used with non-hex types', async () => {
      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint8', length: '10', size: '2' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Size parameter is only allowed for hex8 and hex16 types'
      });
    });

    test('should return 400 for invalid size parameter', async () => {
      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'hex8', length: '10', size: '0' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid size parameter. Must be a number between 1 and 1024'
      });
    });
  });

  describe('Successful API Calls', () => {
    test('should return normalized response for uint8 type', async () => {
      const mockAnuResponse = {
        data: {
          data: [123, 45, 67, 89, 12]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockAnuResponse);

      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint8', length: '5' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        type: 'uint8',
        length: 5,
        data: [123, 45, 67, 89, 12]
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.quantumnumbers.anu.edu.au',
        expect.objectContaining({
          params: { type: 'uint8', length: '5' },
          headers: expect.objectContaining({
            'x-api-key': expect.any(String),
            'Accept': 'application/json'
          }),
          timeout: 10000
        })
      );
    });

    test('should return normalized response for hex8 type with size', async () => {
      const mockAnuResponse = {
        data: {
          data: ['A1', 'B2', 'C3', 'D4']
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockAnuResponse);

      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'hex8', length: '4', size: '2' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        type: 'hex8',
        length: 4,
        size: 2,
        data: ['A1', 'B2', 'C3', 'D4']
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.quantumnumbers.anu.edu.au',
        expect.objectContaining({
          params: { type: 'hex8', length: '4', size: '2' },
          headers: expect.objectContaining({
            'x-api-key': expect.any(String),
            'Accept': 'application/json'
          }),
          timeout: 10000
        })
      );
    });

    test('should handle response without nested data property', async () => {
      const mockAnuResponse = {
        data: [12345, 67890, 11111]
      };

      mockedAxios.get.mockResolvedValueOnce(mockAnuResponse);

      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint16', length: '3' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        type: 'uint16',
        length: 3,
        data: [12345, 67890, 11111]
      });
    });
  });

  describe('Error Handling', () => {
    test('should return 500 when API key is not configured', async () => {
      delete process.env.ANU_QRNG_API_KEY;

      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint8', length: '10' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'ANU QRNG API key not configured. Please set ANU_QRNG_API_KEY in your .env file'
      });
    });

    test('should handle ANU API error response', async () => {
      const mockError = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Invalid API key' }
        }
      };

      mockedAxios.get.mockRejectedValueOnce(mockError);

      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint8', length: '10' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: 'ANU QRNG API Error (401): Invalid API key'
      });
    });

    test('should handle network timeout error', async () => {
      const mockError = {
        request: {},
        message: 'timeout of 10000ms exceeded'
      };

      mockedAxios.get.mockRejectedValueOnce(mockError);

      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint8', length: '10' });

      expect(response.status).toBe(503);
      expect(response.body).toEqual({
        success: false,
        error: 'Unable to connect to ANU QRNG API. Please try again later.'
      });
    });

    test('should handle unexpected errors', async () => {
      const mockError = new Error('Something unexpected happened');

      mockedAxios.get.mockRejectedValueOnce(mockError);

      const response = await request(app)
        .get('/api/qrng')
        .query({ type: 'uint8', length: '10' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'An unexpected error occurred while processing your request'
      });
    });
  });
});

describe('GET /api/health', () => {
  beforeEach(() => {
    delete process.env.ANU_QRNG_API_KEY;
  });

  test('should return health status with API key configured', async () => {
    process.env.ANU_QRNG_API_KEY = 'test-key';

    const response = await request(app)
      .get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.apiKeyConfigured).toBe(true);
    expect(response.body.timestamp).toBeDefined();
  });

  test('should return health status without API key configured', async () => {
    const response = await request(app)
      .get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.apiKeyConfigured).toBe(false);
  });
});