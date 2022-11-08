// @ts-check

/**
 * @type {import('@nrwl/react/module-federation').ModuleFederationConfig}
 **/
const moduleFederationConfig = {
  name: 'airport',
  exposes: {
    './Module': './src/remote-entry-web-component.ts',
  },
};

module.exports = moduleFederationConfig;
