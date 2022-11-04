/**
 * Compile SENSES Schematics
 */
const path = require('path');
const util = require('util');
const npmRunPath = require('npm-run-path');
const exec = util.promisify(require('child_process').exec);
const rimraf = util.promisify(require('rimraf'));

const env = {
  ...process.env,
  PATH: npmRunPath(),
  FORCE_COLOR: '0', // Override this, enabling it will cause `yarn bin` to yield white color codes
};

(async function() {
  try {

    await rimraf('src/*/*.{spec.js,spec.d.ts,spec.js.map,js,js.map,d.ts}');
    await exec(`tsc -p tsconfig.json`, { env, cwd: path.join(__dirname, '..')});

    console.log('SENSES Schematics compiled!');
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
