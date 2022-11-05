'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getTypeScriptSourceFile =
  exports.variablePush =
  exports.objectPush =
  exports.classMethodPush =
  exports.arrayUnshift =
  exports.importModuleInFile =
  exports.findGenericNode =
  exports.findPropertyNode =
  exports.findClassDeclarationNode =
  exports.findVariableDeclarationNode =
  exports.findVariableNode =
    void 0;
const angularDevkit = require('@angular-devkit/schematics');
const ast_utils_1 = require('@schematics/angular/utility/ast-utils');
const ts = require('typescript');
const change_1 = require('@schematics/angular/utility/change');
const const_1 = require('./const');
const workspace_1 = require('./workspace');
function findVariableNode(source, name) {
  const nodes = (0, ast_utils_1.findNodes)(
    source,
    ts.SyntaxKind.VariableStatement
  );
  return (
    nodes.find(
      (node) => node.declarationList.declarations[0].name.getText() === name
    ) || null
  );
}
exports.findVariableNode = findVariableNode;
function findVariableDeclarationNode(source, name) {
  return findGenericNode(source, name, ts.SyntaxKind.VariableDeclaration);
}
exports.findVariableDeclarationNode = findVariableDeclarationNode;
function findClassDeclarationNode(source, name) {
  return findGenericNode(source, name, ts.SyntaxKind.ClassDeclaration);
}
exports.findClassDeclarationNode = findClassDeclarationNode;
function findPropertyNode(source, name) {
  return findGenericNode(source, name, ts.SyntaxKind.PropertyDeclaration);
}
exports.findPropertyNode = findPropertyNode;
function findGenericNode(source, name, kind) {
  const nodes = (0, ast_utils_1.findNodes)(source, kind);
  return (
    nodes.find((node) => {
      if (node.name) {
        return node.name.getText() === name;
      }
      return false;
    }) || null
  );
}
exports.findGenericNode = findGenericNode;
function importModuleInFile(
  source,
  barrelIndexPath,
  symbolName,
  fileName,
  isDefault = false
) {
  const changes = [];
  const nodes = (0, ast_utils_1.findNodes)(
    source,
    ts.SyntaxKind.ImportDeclaration
  );
  if (
    !nodes.find((node) => node.moduleSpecifier.getText() === `'${fileName}'`)
  ) {
    const open = isDefault ? '' : '{ ';
    const close = isDefault ? '' : ' }';
    const lastItem = [...nodes]
      .sort((first, second) => first.getStart() - second.getStart())
      .pop();
    const lastItemPosition = lastItem ? lastItem.getEnd() : 0;
    changes.push(
      new change_1.InsertChange(
        barrelIndexPath,
        lastItemPosition,
        `\nimport ${open}${symbolName}${close} from '${fileName}';`
      )
    );
  }
  return changes;
}
exports.importModuleInFile = importModuleInFile;
function arrayUnshift(node, barrelIndexPath, toAdd) {
  const [declaration] = node.declarationList.declarations;
  const { initializer } = declaration;
  const changes = [];
  if (!initializer)
    throw new angularDevkit.SchematicsException(
      `Node '${declaration.name.getText()}' is not initialized`
    );
  if (!ts.isArrayLiteralExpression(initializer))
    throw new angularDevkit.SchematicsException(
      `Node '${declaration.name.getText()}' is not of type array`
    );
  if (initializer.elements.length === 0) {
    if (initializer.getWidth() > 2) {
      changes.push(
        new change_1.RemoveChange(
          barrelIndexPath,
          initializer.getStart() + 2,
          ' '.repeat(initializer.getWidth() - 3)
        )
      );
    }
    changes.push(
      new change_1.InsertChange(
        barrelIndexPath,
        initializer.getStart() + 1,
        `\n${const_1.FILE_INDENT}${toAdd}\n`
      )
    );
  } else {
    changes.push(
      new change_1.InsertChange(
        barrelIndexPath,
        initializer.getStart() + 1,
        `\n${const_1.FILE_INDENT}${toAdd},`
      )
    );
  }
  return changes;
}
exports.arrayUnshift = arrayUnshift;
function classMethodPush(node, barrelIndexPath, methodToAdd, toAdd) {
  const changes = [];
  node.members.forEach((member) => {
    if (member.name) {
      if (member.name.getText() === methodToAdd) {
        throw new angularDevkit.SchematicsException(
          `Method '${methodToAdd}' already existing in class`
        );
      }
    }
  });
  changes.push(
    new change_1.InsertChange(
      barrelIndexPath,
      node.getEnd() - 1,
      `\n${const_1.FILE_INDENT}${toAdd}\n`
    )
  );
  return changes;
}
exports.classMethodPush = classMethodPush;
function objectPush(node, barrelIndexPath, toAdd) {
  const { initializer } = node;
  const changes = [];
  if (!initializer)
    throw new angularDevkit.SchematicsException(
      `Node '${node.name.getText()}' is not initialized`
    );
  if (!ts.isObjectLiteralExpression(initializer))
    throw new angularDevkit.SchematicsException(
      `Node '${node.name.getText()}' is not of type object`
    );
  changes.push(
    new change_1.InsertChange(
      barrelIndexPath,
      initializer.getEnd() - 4,
      `\n${const_1.FILE_INDENT}${const_1.FILE_INDENT}${toAdd},`
    )
  );
  return changes;
}
exports.objectPush = objectPush;
function variablePush(node, barrelIndexPath, toAdd) {
  const { initializer } = node;
  const changes = [];
  if (!initializer)
    throw new Error(`Node '${node.name.getText()}' is not initialized`);
  changes.push(
    new change_1.InsertChange(
      barrelIndexPath,
      initializer.getStart() + 1,
      `\n${const_1.FILE_INDENT}${toAdd},`
    )
  );
  return changes;
}
exports.variablePush = variablePush;
const getTypeScriptSourceFile = (host, path) =>
  ts.createSourceFile(
    path,
    (0, workspace_1.readFile)(path)(host).toString('utf8'),
    ts.ScriptTarget.Latest,
    true
  );
exports.getTypeScriptSourceFile = getTypeScriptSourceFile;
//# sourceMappingURL=typescript-ast.js.map
