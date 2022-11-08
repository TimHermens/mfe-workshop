import { HostTree } from '@angular-devkit/schematics';
import * as workspace from './workspace';
import { Tree } from '@angular-devkit/schematics';
import {
  Change,
  InsertChange,
  NoopChange,
  RemoveChange,
  ReplaceChange,
} from '@schematics/angular/utility/change';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';

jest.mock('../utils/global-sites', () => ({
  filterTogglesFile: () => jest.fn(),
  updateFeaturesModule: () => jest.fn(),
  updateTsConfigAppJson: () => jest.fn(),
}));

describe('workspace utils', () => {
  describe('read file', () => {
    it('should read a file from the tree', function () {
      const tree = new HostTree();
      tree.create('my-file.tx', 'hello world');
      expect(workspace.readFile('my-file.tx')(tree).toString()).toBe(
        'hello world'
      );
    });

    it('should throw an error when the file does not exist in the tree', function () {
      const tree = new HostTree();
      expect(() => workspace.readFile('file-does-not.exist')(tree)).toThrow(
        "Could not find file 'file-does-not.exist'"
      );
    });
  });

  describe('insertChanges', () => {
    const path = '/some/file';
    const input = 'some content';

    [
      {
        it: 'should insert changes',
        output: 'add something_some content',
        changes: [new InsertChange(path, 0, 'add something_')],
      },
      {
        it: 'should remove changes',
        output: 'some conten',
        changes: [new RemoveChange(path, 0, 'some')],
      },
      {
        it: 'should replace changes',
        output: 'new content',
        changes: [new ReplaceChange(path, 0, 'some', 'new')],
      },
      {
        it: 'should do nothing when apply noop changes',
        output: 'some content',
        changes: [new NoopChange()],
      },
    ].forEach(testData => {
      // eslint-disable-next-line jest/valid-title
      it(testData.it, () => {
        const tree = new HostTree();
        tree.create(path, input);
        workspace.insertChanges(tree, path, testData.changes);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(tree.read('/some/file')!.toString()).toBe(testData.output);
      });
    });

    it('should throw an error when an unknown change is added', function () {
      const tree = new HostTree();
      tree.create(path, input);

      class UnKnownChange implements Change {
        readonly path: string | null = '';
        readonly order: number = 1;
        readonly description: string = '';

        apply(): Promise<void> {
          return Promise.resolve();
        }
      }

      expect(() => {
        workspace.insertChanges(tree, path, [new UnKnownChange()]);
      }).toThrowError(/Unexpected Change type:/);
    });
  });

  describe('getProjectSourceRoot', () => {
    let tree: Tree;

    beforeAll(async () => {
      tree = createTreeWithEmptyV1Workspace();

      tree.write(
        './workspace.json',
        JSON.stringify({
          $schema: './node_modules/nx/schemas/workspace-schema.json',
          version: 2,
          projects: {
            'my-app': 'apps/my-app',
          },
        })
      );
      tree.write(
        './apps/my-app/project.json',
        JSON.stringify({
          root: 'apps/my-app',
          sourceRoot: 'libs/features/misc/author',
          projectType: 'library',
          prefix: 'feature',
          targets: {},
        })
      );
    });

    it('should get project source root', async () => {
      const projectSourceRoot = workspace.getProjectSourceRoot(tree, 'my-app');

      expect(projectSourceRoot).toContain('libs/features/misc/author');
    });
  });
});
