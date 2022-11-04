import { getProjects, joinPathFragments, ProjectConfiguration, Tree, } from '@nrwl/devkit';
import { Schema } from './schema';
import { spawnSync } from 'child_process';

export default async function (tree: Tree, schema: Schema) {
  try {
    let directory = joinPathFragments(schema.domain, schema.directory, schema.name, 'temp');
    if (schema.page) {
      const config = getParentPageProjectConfiguration(tree, schema.page);
      directory = joinPathFragments(config.sourceRoot.substring(config.sourceRoot.indexOf('/')), '../..', schema.name, 'temp');
    }

    let args: string[] = [
      `--name page-${schema.name}`,
      `--directory ${directory}`,
      '--prefix page',
      '--routing',
      '--lazy',
      `--tags "domain:${schema.domain},type:page"`,
      '--simpleModuleName',
      '--buildable'
    ];

    spawnSync('nx g lib', args, {shell: true, stdio: 'pipe'});

    args = [
      `--project ${directory.replace(/\//g, '-')}-page-${schema.name}`,
      `--destination ${joinPathFragments(directory, '..', '_index')}`
    ];
    spawnSync('nx g @nrwl/workspace:move', args, {shell: true, stdio: 'inherit'});
  } catch (error) {
    throw new Error(error);
  }
}

function getParentPageProjectConfiguration(
  tree: Tree,
  parentPageProjectName: string
): ProjectConfiguration {
  const projects = getProjects(tree);

  if (!projects.has(parentPageProjectName)) {
    throw new Error(
      `The parent page ${parentPageProjectName} is not a valid NX project`
    );
  }

  if (projects.get(parentPageProjectName).projectType !== 'library') {
    throw new Error(
      `The parent page ${parentPageProjectName} is not valid and should be of type 'library'`
    );
  }

  if (!projects.get(parentPageProjectName).sourceRoot.endsWith('/_index/src')) {
    throw new Error(
      `The parent page ${parentPageProjectName} source root is invalid, the source root path should end with /_index/src`
    );
  }

  return projects.get(parentPageProjectName);
}
