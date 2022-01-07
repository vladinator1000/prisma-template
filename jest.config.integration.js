module.exports = {
  testRegex: 'itest.ts',
  setupFiles: ['./src/testUtils/setUpTests.ts'],
  globalTeardown: './src/testUtils/tearDownIntegrationTests.ts',
}
