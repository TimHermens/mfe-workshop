import { formatFiles, getProjects, Tree } from '@nrwl/devkit';
import { Schema } from './schema';
import { spawnSync } from 'child_process';
import { getWorkspaceName } from "../utils/workspace";

export default async function (tree: Tree, schema: Schema) {
  try {
    const projectName = `${schema.domain}-ui`;
    if (getProjects(tree).has(projectName)) {
      throw new Error('This ui project already exists.');
    }
    let args: string[] = [
      `--name ui`,
      `--directory ${schema.domain}`,
      `--tags "domain:${schema.domain},type:ui"`,
      '--buildable',
      `--importPath @${getWorkspaceName(tree)}/${projectName}`
    ];

    spawnSync('nx g lib', args, {shell: true, stdio: 'inherit'});

    args = [
      `--project ${projectName}`,
      `--name ui`,
      '--skipTests'
    ];
    spawnSync('nx g component', args, {shell: true, stdio: 'inherit'});

    await formatFiles(tree);
  } catch (error) {
    throw new Error(error);
  }
}
