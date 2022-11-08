import { formatFiles, getProjects, Tree } from '@nrwl/devkit';
import { Schema } from './schema';
import { spawnSync } from 'child_process';
import { getWorkspaceName } from "../utils/workspace";

export default async function (tree: Tree, schema: Schema) {
  try {
    const projectName = `${schema.domain}-api`;
    if (getProjects(tree).has(projectName)) {
      throw new Error('This api project already exists.');
    }
    const args: string[] = [
      `--name api`,
      `--directory ${schema.domain}`,
      `--tags "domain:${schema.domain},domain:${schema.domain}-api,type:api"`,
      '--buildable',
      `--importPath @${getWorkspaceName(tree)}/${projectName}`
    ];

    spawnSync('nx g lib', args, {shell: true, stdio: 'inherit'});

    await formatFiles(tree);
  } catch (error) {
    throw new Error(error);
  }
}
