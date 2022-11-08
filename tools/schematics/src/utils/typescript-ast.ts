import * as angularDevkit from '@angular-devkit/schematics';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
import {
  Change,
  InsertChange,
  RemoveChange,
} from '@schematics/angular/utility/change';
import { FILE_INDENT } from './const';
import { readFile } from './workspace';
import { Tree } from '@nrwl/devkit';
/**
 * Find a variable statement with the provided name
 * @param {ts.Node} source
 * @param {string} name
 * @returns {ts.VariableStatement | null}
 */
export function findVariableNode(
  source: ts.Node,
  name: string
): ts.VariableStatement | null {
  const nodes = findNodes(
    source,
    ts.SyntaxKind.VariableStatement
  ) as ts.VariableStatement[];
  return (
    nodes.find(
      node => node.declarationList.declarations[0].name.getText() === name
    ) || null
  );
}
/**
 * Find a variable declaration with the provided name
 * @param {ts.Node} source
 * @param {string} name
 * @returns {ts.VariableDeclaration | null}
 */
export function findVariableDeclarationNode(
  source: ts.Node,
  name: string
): ts.VariableDeclaration | null {
  return findGenericNode<ts.VariableDeclaration>(
    source,
    name,
    ts.SyntaxKind.VariableDeclaration
  );
}
/**
 * Find a Class node with the provided name
 * @param {ts.Node} source
 * @param {string} name
 * @returns {ts.ClassDeclaration | null}
 */
export function findClassDeclarationNode(
  source: ts.Node,
  name: string
): ts.ClassDeclaration | null {
  return findGenericNode<ts.ClassDeclaration>(
    source,
    name,
    ts.SyntaxKind.ClassDeclaration
  );
}
/**
 * Find a property node with the provided name
 * @param {ts.Node} source
 * @param {string} name
 * @returns {ts.PropertyDeclaration | null}
 */
export function findPropertyNode(source: ts.Node, name: string) {
  return findGenericNode<ts.PropertyDeclaration>(
    source,
    name,
    ts.SyntaxKind.PropertyDeclaration
  );
}
/**
 * Find a generic node with the provided name
 * @param {ts.Node} source The parent node
 * @param {string} name The name of the declaration node
 * @param {ts.SyntaxKind} kind The kind of declaration node
 * @returns {T | null}
 */
export function findGenericNode<T extends ts.NamedDeclaration>(
  source: ts.Node,
  name: string,
  kind: ts.SyntaxKind
): T | null {
  const nodes = findNodes(source, kind) as T[];
  return (
    nodes.find(node => {
      if (node.name) {
        return node.name.getText() === name;
      }
      return false;
    }) || null
  );
}
/**
 * import a es6 module into a file when the import was not already in the file
 * Current implementation does not merge different named imports together
 * @param {ts.Node} source AST typescript source
 * @param {string} barrelIndexPath path to the source file where the node belongs to
 * @param {string} symbolName
 * @param {string} fileName
 * @returns {Change[]}
 */
export function importModuleInFile(
  source: ts.Node,
  barrelIndexPath: string,
  symbolName: string,
  fileName: string,
  isDefault = false
): Change[] {
  const changes: Change[] = [];
  const nodes = findNodes(
    source,
    ts.SyntaxKind.ImportDeclaration
  ) as ts.ImportDeclaration[];
  if (!nodes.find(node => node.moduleSpecifier.getText() === `'${fileName}'`)) {
    const open = isDefault ? '' : '{ ';
    const close = isDefault ? '' : ' }';
    const lastItem = [...nodes]
      .sort((first, second) => first.getStart() - second.getStart())
      .pop();
    const lastItemPosition: number = lastItem ? lastItem.getEnd() : 0;
    changes.push(
      new InsertChange(
        barrelIndexPath,
        lastItemPosition,
        `\nimport ${open}${symbolName}${close} from '${fileName}';`
      )
    );
  }
  return changes;
}
/**
 * Adds a new string to the beginning of an existing array
 * @param {ts.VariableStatement} node the node representing the array to add an entry
 * @param {string} barrelIndexPath path to the source file where the node belongs to
 * @param {string} toAdd string to insert to the end of the array
 * @returns {Change}
 */
export function arrayUnshift(
  node: ts.VariableStatement,
  barrelIndexPath: string,
  toAdd: string
): Change[] {
  const [declaration] = node.declarationList.declarations;
  const { initializer } = declaration;
  const changes: Change[] = [];
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
      // removes all new line or space characters
      changes.push(
        new RemoveChange(
          barrelIndexPath,
          initializer.getStart() + 2,
          ' '.repeat(initializer.getWidth() - 3)
        )
      );
    }
    changes.push(
      new InsertChange(
        barrelIndexPath,
        initializer.getStart() + 1,
        `\n${FILE_INDENT}${toAdd}\n`
      )
    );
  } else {
    changes.push(
      new InsertChange(
        barrelIndexPath,
        initializer.getStart() + 1,
        `\n${FILE_INDENT}${toAdd},`
      )
    );
  }
  return changes;
}

/**
 * Adds a new method to the end of a class
 * @param {ts.ClassDeclaration} node the node representing the class
 * @param {string} barrelIndexPath path to the source file where the node belongs to
 * @param {string} methodToAdd name of the method we want to add in the Class
 * @param {string} toAdd template of the method
 * @returns {Change}
 */
export function classMethodPush(
  node: ts.ClassDeclaration,
  barrelIndexPath: string,
  methodToAdd: string,
  toAdd: string
): Change[] {
  const changes: Change[] = [];
  node.members.forEach(member => {
    if (member.name) {
      if (member.name.getText() === methodToAdd) {
        throw new angularDevkit.SchematicsException(
          `Method '${methodToAdd}' already existing in class`
        );
      }
    }
  });
  changes.push(
    new InsertChange(
      barrelIndexPath,
      node.getEnd() - 1,
      `\n${FILE_INDENT}${toAdd}\n`
    )
  );
  return changes;
}
export function objectPush(
  node: ts.PropertyDeclaration,
  barrelIndexPath: string,
  toAdd: string
): Change[] {
  const { initializer } = node;
  const changes: Change[] = [];
  if (!initializer)
    throw new angularDevkit.SchematicsException(
      `Node '${node.name.getText()}' is not initialized`
    );
  if (!ts.isObjectLiteralExpression(initializer))
    throw new angularDevkit.SchematicsException(
      `Node '${node.name.getText()}' is not of type object`
    );
  changes.push(
    new InsertChange(
      barrelIndexPath,
      initializer.getEnd() - 4,
      `\n${FILE_INDENT}${FILE_INDENT}${toAdd},`
    )
  );
  return changes;
}
export function variablePush(
  node: ts.VariableDeclaration,
  barrelIndexPath: string,
  toAdd: string
): Change[] {
  const { initializer } = node;
  const changes: Change[] = [];
  if (!initializer)
    throw new Error(`Node '${node.name.getText()}' is not initialized`);
  changes.push(
    new InsertChange(
      barrelIndexPath,
      initializer.getStart() + 1,
      `\n${FILE_INDENT}${toAdd},`
    )
  );
  return changes;
}
export const getTypeScriptSourceFile = (host: Tree, path: string) =>
  ts.createSourceFile(
    path,
    readFile(path)(host).toString('utf8'),
    ts.ScriptTarget.Latest,
    true
  );
