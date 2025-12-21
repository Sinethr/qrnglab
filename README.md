# 🔬 Quantum Random Lab

A minimal web application for exploring true quantum randomness using the Australian National University (ANU) Quantum Random Number Generator API.

## Features

- 🎲 **True Quantum Randomness** - Uses quantum vacuum fluctuations for genuine unpredictability
- 🎛️ **Multiple Data Types** - Support for 8-bit, 16-bit integers and hexadecimal formats
- 📊 **Flexible Parameters** - Configurable count and block sizes (1-1024)
- 🎨 **Clean UI** - Responsive design with real-time feedback
- 📋 **Easy Sharing** - Copy results with full metadata
- 🔒 **Secure** - Environment-based API key management
- ⚡ **Fast** - Minimal dependencies and efficient proxy API

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd quantum-random-lab
npm install
```

### 2. Configure API Key

1. Get your free API key from [ANU QRNG](https://quantumnumbers.anu.edu.au/)
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and add your API key:
   ```
   ANU_QRNG_API_KEY=your_actual_api_key_here
   ```

### 3. Run the Application

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Visit `http://localhost:3000` to start exploring quantum randomness!

## API Endpoints

### `GET /api/qrng`

Proxy endpoint for ANU QRNG API with validation and error handling.

**Query Parameters:**
- `type` (optional) - Data type: `uint8`, `uint16`, or `hex16` (default: `uint8`)
- `length` (optional) - Number of random numbers: 1-1024 (default: `10`)
- `size` (optional) - Array block size: 1-1024 (default: `2`)

**Example:**
```bash
curl "http://localhost:3000/api/qrng?type=uint8&length=5&size=1"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "uint8",
    "length": 5,
    "size": 1,
    "data": [142, 67, 203, 91, 178]
  },
  "params": {
    "type": "uint8",
    "length": "5",
    "size": "1"
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "apiKeyConfigured": true
}
```

## Data Types Explained

- **uint8**: 8-bit unsigned integers (0-255) - Perfect for general randomness
- **uint16**: 16-bit unsigned integers (0-65535) - Higher range applications
- **hex16**: 16-bit hexadecimal strings - For cryptographic or hash applications

## Project Structure

```
quantum-random-lab/
├── server.js           # Express server with API proxy
├── package.json        # Dependencies and scripts
├── .env.example        # Environment template
├── .gitignore         # Git ignore rules
├── README.md          # This file
└── public/            # Frontend assets
    ├── index.html     # Main HTML page
    ├── styles.css     # Responsive CSS styles
    └── script.js      # Frontend JavaScript
```

## Technology Stack

**Backend:**
- Node.js + Express.js
- Axios for HTTP requests
- CORS support
- Environment variable management

**Frontend:**
- Vanilla JavaScript (no framework dependencies)
- Modern CSS with Grid/Flexbox
- Responsive design
- Web APIs (Clipboard, Fetch)

## Development

### Adding New Features

1. **New Data Types**: Add validation in `validateQueryParams()` and update frontend options
2. **Enhanced UI**: Modify `public/` files - styles are modular and well-commented
3. **Additional Endpoints**: Add routes in `server.js` with proper error handling

### Environment Variables

- `ANU_QRNG_API_KEY` - Your ANU QRNG API key (required)
- `PORT` - Server port (default: 3000)

### Error Handling

The application includes comprehensive error handling:
- Input validation with user-friendly messages
- API timeout handling (10 seconds)
- Network error recovery
- Graceful degradation when API is unavailable

## Quantum Randomness vs Pseudo-Random

Traditional computer "random" numbers are actually **pseudo-random** - they use mathematical algorithms that appear random but are deterministic. True randomness comes from quantum mechanical processes that are fundamentally unpredictable.

The ANU QRNG measures quantum vacuum fluctuations in real-time, providing genuine randomness for:
- 🔐 Cryptographic applications
- 🧪 Scientific simulations
- 🎲 Fair gaming and gambling
- 🔬 Statistical research
- 🎨 Creative projects requiring true unpredictability

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Resources

- [ANU QRNG Service](https://quantumnumbers.anu.edu.au/) - Get your API key
- [Quantum Random Numbers Research](https://arxiv.org/abs/1004.1529) - Scientific background
- [Express.js Documentation](https://expressjs.com/) - Backend framework docs

---

**Made with quantum curiosity** ⚛️