"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeaturesModuleForUiComponent = exports.filterTogglesFile = void 0;
const angularDevkit = require("@angular-devkit/schematics");
const typescript_ast_1 = require("./typescript-ast");
const workspace_1 = require("./workspace");
const devkit_1 = require("@nrwl/devkit");
const ast_utils_1 = require("@nrwl/workspace/src/utilities/ast-utils");
function filterTogglesFile(options) {
    return angularDevkit.filter(path => {
        if (options.app === 'global-sites') {
            return !path.match(/\.toggles\.ts$/);
        }
        return true;
    });
}
exports.filterTogglesFile = filterTogglesFile;
function insertConfigIntoFeaturesModule(tree, configToAdd) {
    const globalSitesAppPath = (0, workspace_1.getProjectSourceRoot)(tree, 'global-sites');
    const featureModulePath = `${globalSitesAppPath}/app/config/feature-modules.config.ts`;
    const featureModuleSourceFile = (0, typescript_ast_1.getTypeScriptSourceFile)(tree, featureModulePath);
    if (!featureModuleSourceFile) {
        console.warn("Couldn't find feature module config to configure lazy loading, continuing...");
        return tree;
    }
    const variableDeclaration = (0, typescript_ast_1.findVariableDeclarationNode)(featureModuleSourceFile, 'featureModules');
    return (0, ast_utils_1.insertChange)(tree, featureModuleSourceFile, featureModulePath, variableDeclaration.getEnd() - 1, configToAdd);
}
function updateFeaturesModuleForUiComponent(tree, options) {
    const contentSchemaType = options.entityType;
    const nxNames = (0, devkit_1.names)(options.name);
    const classifiedName = nxNames.className;
    const classifiedEntityComponentName = `${classifiedName}Component`;
    const classifiedEntityVariableName = classifiedEntityComponentName[0].toLowerCase() +
        classifiedEntityComponentName.slice(1);
    const configToAdd = `{
    path: EntityType.${contentSchemaType},
    loadChildren: () => import('@senses/global-sites-ui-components.module').then(m => m.GlobalSitesUiComponentsModule),
    entryPropertyName: '${classifiedEntityVariableName}'
  }`;
    return insertConfigIntoFeaturesModule(tree, configToAdd);
}
exports.updateFeaturesModuleForUiComponent = updateFeaturesModuleForUiComponent;
//# sourceMappingURL=global-sites.js.map