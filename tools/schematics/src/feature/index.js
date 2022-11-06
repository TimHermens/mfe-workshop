'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const devkit_1 = require('@nrwl/devkit');
const child_process_1 = require('child_process');
const workspace_1 = require('../utils/workspace');
async function default_1(tree, schema) {
  try {
    const projectName = `${schema.domain}-features-${schema.name}`;
    if ((0, devkit_1.getProjects)(tree).has(projectName)) {
      throw new Error('This feature project already exists.');
    }
    let args = [
      `--name ${schema.name}`,
      `--directory ${schema.domain}/features`,
      '--prefix feature',
      `--tags "domain:${schema.domain},type:feature"`,
      '--buildable',
      `--importPath @${(0, workspace_1.getWorkspaceName)(tree)}/${projectName}`,
    ];
    (0, child_process_1.spawnSync)('nx g lib', args, {
      shell: true,
      stdio: 'inherit',
    });
    args = [
      `--project ${projectName}`,
      `--name ${schema.name}`,
      `--selector feature-${schema.name}`,
      '--skipTests',
    ];
    (0, child_process_1.spawnSync)('nx g component', args, {
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
