import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    fileServerFolder: ".",
    fixturesFolder: "./src/fixtures",
    specPattern: "./src/integration/**/*.spec.ts",
    modifyObstructiveCode: false,
    supportFile: "./src/support/index.ts",
    video: true,
    videosFolder: "../../dist/cypress/apps/flight-app-e2e/videos",
    screenshotsFolder: "../../dist/cypress/apps/flight-app-e2e/screenshots",
    chromeWebSecurity: false
  }
})
