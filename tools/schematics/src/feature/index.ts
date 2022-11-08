import { formatFiles, getProjects, Tree } from '@nrwl/devkit';
import { Schema } from './schema';
import { spawnSync } from 'child_process';
import { getWorkspaceName } from '../utils/workspace';

export default async function (tree: Tree, schema: Schema) {
  try {
    const projectName = `${schema.domain}-features-${schema.name}`;
    if (getProjects(tree).has(projectName)) {
      throw new Error('This feature project already exists.');
    }
    let args: string[] = [
      `--name ${schema.name}`,
      `--directory ${schema.domain}/features`,
      '--prefix feature',
      `--tags "domain:${schema.domain},type:feature"`,
      '--buildable',
      `--importPath @${getWorkspaceName(tree)}/${projectName}`,
    ];

    spawnSync('nx g lib', args, { shell: true, stdio: 'inherit' });

    args = [
      `--project ${projectName}`,
      `--name ${schema.name}`,
      `--selector feature-${schema.name}`,
      '--skipTests',
    ];
    spawnSync('nx g component', args, { shell: true, stdio: 'inherit' });

    await formatFiles(tree);
  } catch (error) {
    throw new Error(error);
  }
}
