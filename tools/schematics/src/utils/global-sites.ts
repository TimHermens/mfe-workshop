import * as angularDevkit from '@angular-devkit/schematics';
import {
  findVariableDeclarationNode,
  getTypeScriptSourceFile,
} from './typescript-ast';
import { getProjectSourceRoot } from './workspace';
import { names, Tree } from '@nrwl/devkit';
import { insertChange } from '@nrwl/workspace/src/utilities/ast-utils';

export function filterTogglesFile(options: any): angularDevkit.Rule {
  return angularDevkit.filter(path => {
    if (options.app === 'global-sites') {
      return !path.match(/\.toggles\.ts$/);
    }
    return true;
  });
}

function insertConfigIntoFeaturesModule(tree: Tree, configToAdd: string) {
  const globalSitesAppPath = getProjectSourceRoot(tree, 'global-sites');
  const featureModulePath = `${globalSitesAppPath}/app/config/feature-modules.config.ts`;
  const featureModuleSourceFile = getTypeScriptSourceFile(
    tree,
    featureModulePath
  );
  if (!featureModuleSourceFile) {
    console.warn(
      "Couldn't find feature module config to configure lazy loading, continuing..."
    );
    return tree;
  }

  const variableDeclaration = findVariableDeclarationNode(
    featureModuleSourceFile,
    'featureModules'
  );

  return insertChange(
    tree,
    featureModuleSourceFile,
    featureModulePath,
    variableDeclaration.getEnd() - 1,
    configToAdd
  );
}

export function updateFeaturesModuleForUiComponent(tree: Tree, options: any) {
  const contentSchemaType = options.entityType;

  const nxNames = names(options.name);
  const classifiedName = nxNames.className;

  const classifiedEntityComponentName = `${classifiedName}Component`;
  const classifiedEntityVariableName =
    classifiedEntityComponentName[0].toLowerCase() +
    classifiedEntityComponentName.slice(1);

  const configToAdd = `{
    path: EntityType.${contentSchemaType},
    loadChildren: () => import('@senses/global-sites-ui-components.module').then(m => m.GlobalSitesUiComponentsModule),
    entryPropertyName: '${classifiedEntityVariableName}'
  }`;

  return insertConfigIntoFeaturesModule(tree, configToAdd);
}
