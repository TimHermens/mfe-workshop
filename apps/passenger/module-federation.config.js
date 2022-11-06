module.exports = {
  name: 'passenger',
  exposes: {
    './Module': 'apps/passenger/src/app/remote-entry/entry.module.ts',
  },
};
