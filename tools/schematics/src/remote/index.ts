import { formatFiles, getProjects, Tree } from '@nrwl/devkit';
import { Schema } from './schema';
import { spawnSync } from 'child_process';

export default async function (tree: Tree, schema: Schema) {
  try {
    const projectName = schema.domain;
    if (getProjects(tree).has(projectName)) {
      throw new Error('This remote project already exists.');
    }
    const args: string[] = [
      `--name ${projectName}`,
      `--tags "domain:${schema.domain},type:app"`,
      '--style css',
      `--port ${schema.port}`,
    ];

    spawnSync('nx g @nrwl/angular:remote', args, {
      shell: true,
      stdio: 'inherit',
    });

    await formatFiles(tree);
  } catch (error) {
    throw new Error(error);
  }
}
