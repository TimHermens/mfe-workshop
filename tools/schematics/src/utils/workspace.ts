import * as angularDevkit from '@angular-devkit/schematics';

import {
  Change,
  InsertChange,
  NoopChange,
  RemoveChange,
  ReplaceChange,
} from '@schematics/angular/utility/change';

import { ReplaceChange as ReplaceChangePos } from './changes';
import { readProjectConfiguration, Tree } from '@nrwl/devkit';

export const readFile =
  (path: string) =>
  (tree: Tree): Buffer => {
    if (!tree.exists(path)) {
      throw new Error(`Could not find file '${path}'`);
    }
    return tree.read(path) as Buffer;
  };

/**
 * Inserts changes in a file which exist in the tree
 * @param {angularDevkit.Tree} host
 * @param {string} path path to file
 * @param {Change[]} changes
 * @returns {angularDevkit.Tree}
 */
export function insertChanges(
  host: angularDevkit.Tree,
  path: string,
  changes: Change[]
): angularDevkit.Tree {
  const recorder = host.beginUpdate(path);
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    } else if (change instanceof RemoveChange) {
      recorder.remove((<any>change).pos - 1, (<any>change).toRemove.length + 1);
    } else if (change instanceof NoopChange) {
      // do nothing
    } else if (change instanceof ReplaceChange) {
      const action = <any>change;
      recorder.remove(action.pos, action.oldText.length);
      recorder.insertLeft(action.pos, action.newText);
    } else if (change instanceof ReplaceChangePos) {
      const action = <any>change;
      recorder.remove(action.pos, action.end - action.pos);
      recorder.insertLeft(action.pos, action.newText);
    } else {
      throw new Error(`Unexpected Change type: '${change}'`);
    }
  }
  host.commitUpdate(recorder);

  return host;
}

export const getProjectSourceRoot = (
  tree: Tree,
  projectName: string
): string => {
  const componentConfig = readProjectConfiguration(tree, projectName);

  return componentConfig.sourceRoot || componentConfig.root;
};
