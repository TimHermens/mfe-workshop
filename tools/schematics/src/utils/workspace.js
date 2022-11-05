'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getWorkspaceName =
  exports.getProjectSourceRoot =
  exports.insertChanges =
  exports.readFile =
    void 0;
const change_1 = require('@schematics/angular/utility/change');
const changes_1 = require('./changes');
const devkit_1 = require('@nrwl/devkit');
const readFile = (path) => (tree) => {
  if (!tree.exists(path)) {
    throw new Error(`Could not find file '${path}'`);
  }
  return tree.read(path);
};
exports.readFile = readFile;
function insertChanges(host, path, changes) {
  const recorder = host.beginUpdate(path);
  for (const change of changes) {
    if (change instanceof change_1.InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    } else if (change instanceof change_1.RemoveChange) {
      recorder.remove(change.pos - 1, change.toRemove.length + 1);
    } else if (change instanceof change_1.NoopChange) {
    } else if (change instanceof change_1.ReplaceChange) {
      const action = change;
      recorder.remove(action.pos, action.oldText.length);
      recorder.insertLeft(action.pos, action.newText);
    } else if (change instanceof changes_1.ReplaceChange) {
      const action = change;
      recorder.remove(action.pos, action.end - action.pos);
      recorder.insertLeft(action.pos, action.newText);
    } else {
      throw new Error(`Unexpected Change type: '${change}'`);
    }
  }
  host.commitUpdate(recorder);
  return host;
}
exports.insertChanges = insertChanges;
const getProjectSourceRoot = (tree, projectName) => {
  const componentConfig = (0, devkit_1.readProjectConfiguration)(
    tree,
    projectName
  );
  return componentConfig.sourceRoot || componentConfig.root;
};
exports.getProjectSourceRoot = getProjectSourceRoot;
function getWorkspaceName(tree) {
  return (0, devkit_1.readWorkspaceConfiguration)(tree).npmScope;
}
exports.getWorkspaceName = getWorkspaceName;
//# sourceMappingURL=workspace.js.map
