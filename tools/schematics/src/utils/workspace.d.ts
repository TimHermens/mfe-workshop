/// <reference types="node" />
import * as angularDevkit from '@angular-devkit/schematics';
import { Change } from '@schematics/angular/utility/change';
import { Tree } from '@nrwl/devkit';
export declare const readFile: (path: string) => (tree: Tree) => Buffer;
export declare function insertChanges(host: angularDevkit.Tree, path: string, changes: Change[]): angularDevkit.Tree;
export declare const getProjectSourceRoot: (tree: Tree, projectName: string) => string;
export declare function getWorkspaceName(tree: Tree): string;
