"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
const angular_ast_utils_1 = require("../utils/angular-ast-utils");
const typescript_1 = require("typescript");
const workspace_1 = require("../utils/workspace");
async function default_1(tree, schema) {
    try {
        const missingProperties = [];
        if (!schema.domain) {
            missingProperties.push('domain');
        }
        if (!schema.name) {
            missingProperties.push('name');
        }
        if (missingProperties.length > 0) {
            throw new Error(`Required properties ${missingProperties.map(p => `'${p}'`).join(', ')} are undefined`);
        }
        const pageNames = (0, devkit_1.names)(schema.name);
        const applicationNames = (0, devkit_1.names)(schema.app);
        const parentPageNames = (0, devkit_1.names)(schema.page);
        const parentPageRootPath = getParentPageRootPath(tree, parentPageNames.fileName, schema.domain, schema.directory);
        const prefix = 'page';
        const options = {
            name: pageNames.fileName,
            applicationName: applicationNames.fileName,
            domain: schema.domain,
            pageProjectName: `${schema.domain}-${prefix}-${pageNames.fileName}`,
            pagePathAlias: `@${(0, workspace_1.getWorkspaceName)(tree)}/${schema.domain}-${prefix}-${pageNames.fileName}`,
            parentPageName: parentPageNames.fileName,
            hasParentPage: parentPageNames.fileName !== '' ? true : false,
            selector: schema.selector
                ? schema.selector
                : `${prefix}-${pageNames.fileName}`,
            pageProjectRoot: (0, devkit_1.joinPathFragments)(parentPageRootPath, `${prefix}-${pageNames.fileName}`, '_index')
        };
        const projectConfiguration = {
            root: options.pageProjectRoot,
            sourceRoot: options.pageProjectRoot,
            projectType: 'library',
            prefix,
            targets: {
                build: {
                    executor: "@nrwl/angular:ng-packagr-lite",
                    outputs: [(0, devkit_1.joinPathFragments)('dist', options.pageProjectRoot)],
                    options: {
                        project: (0, devkit_1.joinPathFragments)(options.pageProjectRoot, 'ng-package.json')
                    },
                    configurations: {
                        production: {
                            tsConfig: (0, devkit_1.joinPathFragments)(options.pageProjectRoot, 'tsconfig.lib.prod.json')
                        },
                        development: {
                            tsConfig: (0, devkit_1.joinPathFragments)(options.pageProjectRoot, 'tsconfig.lib.json')
                        }
                    },
                    defaultConfiguration: "production"
                },
                test: {
                    executor: '@nrwl/jest:jest',
                    options: {
                        jestConfig: (0, devkit_1.joinPathFragments)(options.pageProjectRoot, 'jest.config.ts'),
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
            tags: ['type:page', `domain:${options.domain}`],
        };
        if (options.applicationName) {
            projectConfigurationExists(tree, options.applicationName, 'application');
        }
        if (options.hasParentPage) {
            projectConfigurationExists(tree, options.parentPageName, 'library');
        }
        (0, devkit_1.addProjectConfiguration)(tree, options.pageProjectName, projectConfiguration, true);
        updateTsBaseConfig(tree, options);
        (0, devkit_1.generateFiles)(tree, (0, devkit_1.joinPathFragments)(__dirname, 'files', 'default'), options.pageProjectRoot, {
            ...schema,
            name: pageNames.fileName,
            className: pageNames.className,
            propertyName: pageNames.propertyName,
            constantName: pageNames.constantName,
            pagePathAlias: options.pagePathAlias,
            hasParent: options.hasParentPage,
            pageProjectRoot: options.pageProjectRoot,
            selector: options.selector,
            routeNamePrefix: getParentRouteNamePrefix(parentPageRootPath, options),
            relativePathToWorkspaceRoot: options.pageProjectRoot
                .split('/')
                .map(() => '..')
                .join('/'),
        });
        addDefaultPageRoute(tree, options, parentPageRootPath, pageNames);
        await (0, devkit_1.formatFiles)(tree);
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.default = default_1;
function getParentPageRootPath(tree, parentPageProjectName, domain, subPathDirectory) {
    if (parentPageProjectName !== '') {
        const parentPageProjectConfiguration = getParentPageProjectConfiguration(tree, parentPageProjectName);
        const parentRootPath = parentPageProjectConfiguration.sourceRoot.substring(0, parentPageProjectConfiguration.sourceRoot.lastIndexOf('/_index'));
        return (0, devkit_1.joinPathFragments)(parentRootPath);
    }
    else {
        return (0, devkit_1.joinPathFragments)('libs', domain, subPathDirectory);
    }
}
function getParentPageProjectConfiguration(tree, parentPageProjectName) {
    const projects = (0, devkit_1.getProjects)(tree);
    if (!projects.has(parentPageProjectName)) {
        throw new Error(`The parent page ${parentPageProjectName} is not a valid NX project`);
    }
    if (projects.get(parentPageProjectName).projectType !== 'library') {
        throw new Error(`The parent page ${parentPageProjectName} is not valid and should be of type 'library'`);
    }
    if (!projects.get(parentPageProjectName).sourceRoot.endsWith('/_index')) {
        throw new Error(`The parent page ${parentPageProjectName} source root is invalid, the source root path should end with /_index`);
    }
    return projects.get(parentPageProjectName);
}
function updateTsBaseConfig(tree, options) {
    const tsConfig = 'tsconfig.base.json';
    try {
        (0, devkit_1.updateJson)(tree, tsConfig, (tsConfig) => {
            Object.assign(tsConfig.compilerOptions.paths, {
                [options.pagePathAlias]: [
                    (0, devkit_1.joinPathFragments)(options.pageProjectRoot, 'index.ts'),
                ],
            });
            return tsConfig;
        });
    }
    catch (error) {
        throw new Error(`Unable to update ${tsConfig}`);
    }
}
function addDefaultPageRoute(tree, options, parentPageRootPath, pageNames) {
    const route = `{ path: '${pageNames.fileName}', loadChildren: () => import('${options.pagePathAlias}').then(m => m.${pageNames.className}Module)}`;
    let routingModulePath = '';
    if (options.hasParentPage) {
        const parentPageName = parentPageRootPath.match(new RegExp(/\/page-(.*)$/m))[1];
        routingModulePath = (0, devkit_1.joinPathFragments)(parentPageRootPath, '_index', `${parentPageName}-routing.module.ts`);
    }
    else if (options.applicationName) {
        routingModulePath = (0, devkit_1.joinPathFragments)('apps', options.applicationName, 'src', 'app', 'app-routing.module.ts');
    }
    else {
        return;
    }
    const routingModuleSource = (0, typescript_1.createSourceFile)(routingModulePath, tree.read(routingModulePath).toString('utf-8'), typescript_1.ScriptTarget.Latest, true);
    if (!tree.exists(routingModulePath)) {
        throw new Error(`Could not find a routing module at ${routingModulePath}`);
    }
    (0, angular_ast_utils_1.addRoute)(tree, routingModulePath, routingModuleSource, route);
}
function projectConfigurationExists(tree, project, projectType) {
    const projects = (0, devkit_1.getProjects)(tree);
    if (!projects.has(project)) {
        throw new Error(`${project} is not a valid NX project`);
    }
    if (projects.get(project).projectType !== projectType) {
        throw new Error(`The project type for ${project} is not valid and should be of type '${projectType}'`);
    }
    return true;
}
const getParentRouteNamePrefix = (parentRootPath, options) => {
    if (options.hasParentPage) {
        return (0, devkit_1.names)(parentRootPath.split('/').slice(-2)[0]).className;
    }
    return 'app';
};
//# sourceMappingURL=index.js.map