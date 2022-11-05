"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTsBaseConfig = void 0;
const devkit_1 = require("@nrwl/devkit");
function updateTsBaseConfig(tree, projectName, projectRoot) {
    const tsConfig = 'tsconfig.base.json';
    try {
        (0, devkit_1.updateJson)(tree, tsConfig, (tsConfig) => {
            Object.assign(tsConfig.compilerOptions.paths, {
                [`@senses/${projectName}`]: [
                    (0, devkit_1.joinPathFragments)(projectRoot, 'index.ts'),
                ],
            });
            return tsConfig;
        });
    }
    catch (error) {
        throw new Error(`Unable to update ${tsConfig}`);
    }
}
exports.updateTsBaseConfig = updateTsBaseConfig;
//# sourceMappingURL=tsconfig-base.js.map