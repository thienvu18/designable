const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests/visual',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'yarn workspace @thienvu18/designable-basic-example start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
