const { withModuleFederation } = require('@nrwl/angular/module-federation');
const config = require('./module-federation.config');

module.exports = async (baseConfig) => {
  const fromModuleFederation = await withModuleFederation(config);
  baseConfig = fromModuleFederation(baseConfig);
  // baseConfig.output.publicPath = '/mfe/passenger/';

  return baseConfig;
};
