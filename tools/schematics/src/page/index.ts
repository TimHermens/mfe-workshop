import {
  Tree,
  formatFiles,
  joinPathFragments,
  addProjectConfiguration,
  updateJson,
  ProjectConfiguration,
  names,
  getProjects,
  generateFiles,
} from '@nrwl/devkit';
import { addRoute } from '../utils/angular-ast-utils';
import { Schema, Options } from './schema';
import {
  CompilerOptions,
  ScriptTarget,
  createSourceFile,
} from 'typescript';

interface PageProjectConfiguration extends ProjectConfiguration {
  prefix: string;
}

interface Names {
  name: string;
  className: string;
  propertyName: string;
  constantName: string;
  fileName: string;
}

export default async function (tree: Tree, schema: Schema) {
  try {
    const missingProperties = [];
    if (!schema.domain) {
      missingProperties.push('domain');
    }
    if (!schema.name) {
      missingProperties.push('name');
    }
    if (missingProperties.length > 0) {
      throw new Error(`Required properties ${missingProperties.map(p => `'${p}'`).join(', ')} are undefined`)
    }

    const pageNames = names(schema.name);
    const applicationNames = names(schema.app);
    const parentPageNames = names(schema.page);
    const parentPageRootPath = getParentPageRootPath(
      tree,
      parentPageNames.fileName,
      schema.domain,
      schema.directory
    );
    const prefix = 'page';

    const options: Options = {
      name: pageNames.fileName,
      applicationName: applicationNames.fileName,
      domain: schema.domain,
      pageProjectName: `${schema.domain}-${prefix}-${pageNames.fileName}`,
      pagePathAlias: `@flight-workspace/${schema.domain}-${prefix}-${pageNames.fileName}`,
      parentPageName: parentPageNames.fileName,
      hasParentPage: parentPageNames.fileName !== '' ? true : false,
      selector: schema.selector
        ? schema.selector
        : `${prefix}-${pageNames.fileName}`,
      pageProjectRoot: joinPathFragments(
        parentPageRootPath,
        `${prefix}-${pageNames.fileName}`,
        '_index'
      )
    };

    const projectConfiguration: PageProjectConfiguration = {
      root: options.pageProjectRoot,
      sourceRoot: options.pageProjectRoot,
      projectType: 'library',
      prefix,
      targets: {
        build: {
          executor: "@nrwl/angular:ng-packagr-lite",
          outputs: [joinPathFragments('dist', options.pageProjectRoot)],
          options: {
            project: joinPathFragments(options.pageProjectRoot, 'ng-package.json')
          },
          configurations: {
            production: {
              tsConfig: joinPathFragments(options.pageProjectRoot, 'tsconfig.lib.prod.json')
            },
            development: {
              tsConfig: joinPathFragments(options.pageProjectRoot, 'tsconfig.lib.json')
            }
          },
          defaultConfiguration: "production"
        },
        test: {
          executor: '@nrwl/jest:jest',
          options: {
            jestConfig: joinPathFragments(
              options.pageProjectRoot,
              'jest.config.ts'
            ),
          },
        },
        lint: {
          executor: '@nrwl/linter:eslint',
          options: {
            lintFilePatterns: [
              `${options.pageProjectRoot}/**/*.ts`,
              `${options.pageProjectRoot}/**/*.html`,
            ],
          },
        },
      },
      tags: ['type:page', `domain:${options.domain}` ],
    };

    // if an application is provided validate if it exists
    if (options.applicationName) {
      projectConfigurationExists(tree, options.applicationName, 'application');
    }

    // if a parent page is provided validate if it exists
    if (options.hasParentPage) {
      projectConfigurationExists(tree, options.parentPageName, 'library');
    }

    // let nx take care of adding the correct standalone project config
    addProjectConfiguration(
      tree,
      options.pageProjectName,
      projectConfiguration,
      true
    );

    // update the tsconfig.base.json with a new path alias
    updateTsBaseConfig(tree, options);

    // generate the required filed and directories as per the provided template files
    generateFiles(
      tree,
      joinPathFragments(__dirname, 'files', 'default'),
      options.pageProjectRoot,
      {
        // passed options
        ...schema,

        // page naming
        name: pageNames.fileName,
        className: pageNames.className,
        propertyName: pageNames.propertyName,
        constantName: pageNames.constantName,

        // helpers
        pagePathAlias: options.pagePathAlias,
        hasParent: options.hasParentPage,
        pageProjectRoot: options.pageProjectRoot,
        selector: options.selector,
        routeNamePrefix: getParentRouteNamePrefix(parentPageRootPath, options),
        relativePathToWorkspaceRoot: options.pageProjectRoot
          .split('/')
          .map(() => '..')
          .join('/'),
      }
    );

    // add routing for all other apps
    addDefaultPageRoute(tree, options, parentPageRootPath, pageNames);

    // lastly we format all files we created
    await formatFiles(tree);
  } catch (error) {
    throw new Error(error);
  }
}

function getParentPageRootPath(
  tree: Tree,
  parentPageProjectName: string,
  domain: string,
  subPathDirectory: string,
): string {
  if (parentPageProjectName !== '') {
    const parentPageProjectConfiguration = getParentPageProjectConfiguration(
      tree,
      parentPageProjectName
    );
    const parentRootPath = parentPageProjectConfiguration.sourceRoot.substring(
      0,
      parentPageProjectConfiguration.sourceRoot.lastIndexOf('/_index')
    );
    return joinPathFragments(parentRootPath);
  } else {
    return joinPathFragments('libs', domain, subPathDirectory);
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

  if (!projects.get(parentPageProjectName).sourceRoot.endsWith('/_index')) {
    throw new Error(
      `The parent page ${parentPageProjectName} source root is invalid, the source root path should end with /_index`
    );
  }

  return projects.get(parentPageProjectName);
}

function updateTsBaseConfig(tree: Tree, options: Options) {
  const tsConfig = 'tsconfig.base.json';
  try {
    updateJson(
      tree,
      tsConfig,
      (tsConfig: Record<'compilerOptions', CompilerOptions>) => {
        Object.assign(tsConfig.compilerOptions.paths, {
          [options.pagePathAlias]: [
            joinPathFragments(options.pageProjectRoot, 'index.ts'),
          ],
        });
        return tsConfig;
      }
    );
  } catch (error) {
    throw new Error(`Unable to update ${tsConfig}`);
  }
}

function addDefaultPageRoute(
  tree: Tree,
  options: Options,
  parentPageRootPath: string,
  pageNames: Names
) {
  const route = `{ path: '${pageNames.fileName}', loadChildren: () => import('${options.pagePathAlias}').then(m => m.${pageNames.className}Module)}`;
  let routingModulePath = '';

  if (options.hasParentPage) {
    const parentPageName = parentPageRootPath.match(new RegExp(/\/page-(.*)$/m))[1];
    routingModulePath = joinPathFragments(
      parentPageRootPath,
      '_index',
      `${parentPageName}-routing.module.ts`
    );
  } else if (options.applicationName) {
    routingModulePath = joinPathFragments(
      'apps',
      options.applicationName,
      'src',
      'app',
      'app-routing.module.ts'
    );
  } else {
    return;
  }

  const routingModuleSource = createSourceFile(
    routingModulePath,
    tree.read(routingModulePath).toString('utf-8'),
    ScriptTarget.Latest,
    true
  );

  if (!tree.exists(routingModulePath)) {
    throw new Error(`Could not find a routing module at ${routingModulePath}`);
  }

  addRoute(tree, routingModulePath, routingModuleSource, route);
}

function projectConfigurationExists(
  tree: Tree,
  project: string,
  projectType: string
): boolean {
  const projects = getProjects(tree);

  if (!projects.has(project)) {
    throw new Error(`${project} is not a valid NX project`);
  }

  if (projects.get(project).projectType !== projectType) {
    throw new Error(
      `The project type for ${project} is not valid and should be of type '${projectType}'`
    );
  }
  return true;
}

const getParentRouteNamePrefix = (
  parentRootPath: string,
  options: Options
): string => {
  if (options.hasParentPage) {
    return names(parentRootPath.split('/').slice(-2)[0]).className;
  }
  return 'app';
};
