// Global test setup
beforeEach(() => {
  // Suppress console.log during tests for cleaner output
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // Restore console methods after each test
  console.log.mockRestore?.();
  console.error.mockRestore?.();
  
  // Clear all environment variables between tests
  delete process.env.ANU_QRNG_API_KEY;
});