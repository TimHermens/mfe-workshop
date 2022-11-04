"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
const child_process_1 = require("child_process");
async function default_1(tree, schema) {
    try {
        let directory = (0, devkit_1.joinPathFragments)(schema.domain, schema.directory, schema.name, 'temp');
        if (schema.page) {
            const config = getParentPageProjectConfiguration(tree, schema.page);
            directory = (0, devkit_1.joinPathFragments)(config.sourceRoot.substring(config.sourceRoot.indexOf('/')), '../..', schema.name, 'temp');
        }
        let args = [
            `--name page-${schema.name}`,
            `--directory ${directory}`,
            '--prefix page',
            '--routing',
            '--lazy',
            `--tags "domain:${schema.domain},type:page"`,
            '--simpleModuleName',
            '--buildable'
        ];
        (0, child_process_1.spawnSync)('nx g lib', args, { shell: true, stdio: 'pipe' });
        args = [
            `--project ${directory.replace(/\//g, '-')}-page-${schema.name}`,
            `--destination ${(0, devkit_1.joinPathFragments)(directory, '..', '_index')}`
        ];
        (0, child_process_1.spawnSync)('nx g @nrwl/workspace:move', args, { shell: true, stdio: 'inherit' });
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.default = default_1;
function getParentPageProjectConfiguration(tree, parentPageProjectName) {
    const projects = (0, devkit_1.getProjects)(tree);
    if (!projects.has(parentPageProjectName)) {
        throw new Error(`The parent page ${parentPageProjectName} is not a valid NX project`);
    }
    if (projects.get(parentPageProjectName).projectType !== 'library') {
        throw new Error(`The parent page ${parentPageProjectName} is not valid and should be of type 'library'`);
    }
    if (!projects.get(parentPageProjectName).sourceRoot.endsWith('/_index/src')) {
        throw new Error(`The parent page ${parentPageProjectName} source root is invalid, the source root path should end with /_index/src`);
    }
    return projects.get(parentPageProjectName);
}
//# sourceMappingURL=index2.js.map