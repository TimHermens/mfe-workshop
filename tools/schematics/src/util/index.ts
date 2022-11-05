import { formatFiles, getProjects, Tree } from '@nrwl/devkit';
import { Schema } from './schema';
import { spawnSync } from 'child_process';
import { getWorkspaceName } from "../utils/workspace";

export default async function (tree: Tree, schema: Schema) {
  try {
    const projectName = `${schema.domain}-util`;
    if (getProjects(tree).has(projectName)) {
      throw new Error('This util project already exists.');
    }
    const args: string[] = [
      `--name util`,
      `--directory ${schema.domain}`,
      `--tags "domain:${schema.domain},type:util"`,
      '--buildable',
      `--importPath @${getWorkspaceName(tree)}/${projectName}`
    ];

    spawnSync('nx g lib', args, {shell: true, stdio: 'inherit'});

    await formatFiles(tree);
  } catch (error) {
    throw new Error(error);
  }
}
