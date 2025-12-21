const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Configure Helmet with custom CSP to allow Tailwind CDN
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.quantumnumbers.anu.edu.au"],
      upgradeInsecureRequests: null, // Optional: helpful for localhost dev if not using HTTPS
    },
  },
}));

app.use(xss()); // XSS Sanitization
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ANU QRNG API configuration
const ANU_API_BASE = 'https://api.quantumnumbers.anu.edu.au';
const API_KEY = process.env.ANU_QRNG_API_KEY;

// Validation helpers
const validateQueryParams = (req, res, next) => {
  const { type, length, size } = req.query;

  // Validate type
  const validTypes = ['uint8', 'uint16', 'hex8', 'hex16'];
  if (!type) {
    return res.status(400).json({
      error: 'Missing required parameter: type'
    });
  }
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      error: `Invalid type parameter. Must be one of: ${validTypes.join(', ')}`
    });
  }

  // Validate length (required parameter)
  if (!length) {
    return res.status(400).json({
      error: 'Missing required parameter: length'
    });
  }
  const lengthNum = parseInt(length);
  if (isNaN(lengthNum) || lengthNum < 1 || lengthNum > 1024) {
    return res.status(400).json({
      error: 'Invalid length parameter. Must be a number between 1 and 1024'
    });
  }

  // Validate size (only allowed for hex8 and hex16)
  if (size !== undefined) {
    if (!['hex8', 'hex16'].includes(type)) {
      return res.status(400).json({
        error: 'Size parameter is only allowed for hex8 and hex16 types'
      });
    }
    const sizeNum = parseInt(size);
    if (isNaN(sizeNum) || sizeNum < 1 || sizeNum > 1024) {
      return res.status(400).json({
        error: 'Invalid size parameter. Must be a number between 1 and 1024'
      });
    }
  }

  next();
};

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 20, // Limit each IP to 20 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 1 minute'
  },
  // Skip rate limiting for known Search Engine and LLM bots
  skip: (req) => {
    const userAgent = req.get('User-Agent');
    if (!userAgent) return false;

    // List of common search engine and LLM bot identifiers
    const allowedBots = [
      'Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot',
      'Sogou', 'Exabot', 'facebot', 'ia_archiver',
      'GPTBot', 'ChatGPT-User', 'ClaudeBot', 'CCBot', 'anthropic-ai', 'OAI-SearchBot'
    ];

    return allowedBots.some(bot => userAgent.includes(bot));
  }
});

// Middleware to block requests with missing User-Agent (typical of low-effort scripts)
const blockSpamBots = (req, res, next) => {
  const userAgent = req.get('User-Agent');
  if (!userAgent) {
    return res.status(403).json({
      success: false,
      error: 'Access denied: User-Agent header is required'
    });
  }
  next();
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// QRNG API proxy endpoint
app.get('/api/qrng', blockSpamBots, apiLimiter, validateQueryParams, async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'ANU QRNG API key not configured. Please set ANU_QRNG_API_KEY in your .env file'
      });
    }

    const { type, length, size } = req.query;

    // Prepare query parameters for ANU API
    const queryParams = {
      type: type,
      length: length
    };

    // Only add size for hex8 and hex16 types
    if (size && ['hex8', 'hex16'].includes(type)) {
      queryParams.size = size;
    }

    // Make request to ANU QRNG API
    const response = await axios.get(ANU_API_BASE, {
      params: queryParams,
      headers: {
        'x-api-key': API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    // Return normalized JSON payload
    const result = {
      success: true,
      type: type,
      length: parseInt(length),
      data: response.data.data || response.data
    };

    // Include size in response if it was provided
    if (size && ['hex8', 'hex16'].includes(type)) {
      result.size = parseInt(size);
    }

    res.json(result);

  } catch (error) {
    console.error('QRNG API Error:', error.message);

    if (error.response) {
      // API returned an error response
      const statusCode = error.response.status;
      res.status(statusCode).json({
        success: false,
        error: `ANU QRNG API Error (${statusCode}): ${error.response.data?.message || error.response.statusText}`
      });
    } else if (error.request) {
      // Request timeout or network error
      res.status(503).json({
        success: false,
        error: 'Unable to connect to ANU QRNG API. Please try again later.'
      });
    } else {
      // Other error
      res.status(500).json({
        success: false,
        error: 'An unexpected error occurred while processing your request'
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!API_KEY
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`🔬 Quantum Random Lab server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoint: http://localhost:${PORT}/api/qrng`);
    console.log(`🔑 API Key configured: ${!!API_KEY ? 'Yes' : 'No'}`);
  });
}

// Export app for testing
module.exports = app;