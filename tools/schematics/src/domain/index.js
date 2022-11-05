"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
const child_process_1 = require("child_process");
const update_dep_const_1 = require("../utils/update-dep-const");
const workspace_1 = require("../utils/workspace");
async function default_1(tree, schema) {
    try {
        const projectName = `${schema.name}-domain`;
        if ((0, devkit_1.getProjects)(tree).has(projectName)) {
            throw new Error('This domain project already exists.');
        }
        const args = [
            `--name domain`,
            `--directory ${schema.name}`,
            `--tags "domain:${schema.name},type:domain-logic"`,
            '--buildable',
            `--importPath @${(0, workspace_1.getWorkspaceName)(tree)}/${projectName}`
        ];
        (0, child_process_1.spawnSync)('nx g lib', args, { shell: true, stdio: 'inherit' });
        (0, update_dep_const_1.updateDepConst)(tree, (depConst) => {
            depConst.push({
                sourceTag: `domain:${schema.name}`,
                onlyDependOnLibsWithTags: [`domain:${schema.name}`, 'domain:shared'],
            });
        });
        const dir = `libs/${schema.name}/domain/src/lib`;
        tree.write((0, devkit_1.joinPathFragments)(dir, './application/.gitkeep'), '');
        tree.write((0, devkit_1.joinPathFragments)(dir, './entities/.gitkeep'), '');
        tree.write((0, devkit_1.joinPathFragments)(dir, './infrastructure/.gitkeep'), '');
        await (0, devkit_1.formatFiles)(tree);
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map