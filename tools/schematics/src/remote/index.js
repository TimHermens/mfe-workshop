'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const devkit_1 = require('@nrwl/devkit');
const child_process_1 = require('child_process');
async function default_1(tree, schema) {
  try {
    const projectName = schema.domain;
    if ((0, devkit_1.getProjects)(tree).has(projectName)) {
      throw new Error('This remote project already exists.');
    }
    const args = [
      `--name ${projectName}`,
      `--tags "domain:${schema.domain},type:app"`,
      '--style css',
      `--port ${schema.port}`,
    ];
    (0, child_process_1.spawnSync)('nx g @nrwl/angular:remote', args, {
      shell: true,
      stdio: 'inherit',
    });
    await (0, devkit_1.formatFiles)(tree);
  } catch (error) {
    throw new Error(error);
  }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map
