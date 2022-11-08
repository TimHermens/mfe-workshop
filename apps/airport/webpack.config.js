const { withModuleFederation } = require('@nrwl/react/module-federation');
const config = require('./module-federation.config');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = async (baseConfig) => {
  const fromModuleFederation = await withModuleFederation(config);
  baseConfig = fromModuleFederation(baseConfig);
  // baseConfig.output.publicPath = '/mfe/airport/';

  for (let plugin of baseConfig.plugins) {
    if (plugin instanceof ModuleFederationPlugin) {
      // Since the host runs on Angular 14, we need to provide the remoteEntry file as a modular javascript type
      plugin._options.filename = 'remoteEntry.mjs';
      break;
    }
  }

  return baseConfig;
};
