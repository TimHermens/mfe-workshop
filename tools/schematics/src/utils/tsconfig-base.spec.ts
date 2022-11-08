import { Tree } from '@nrwl/devkit';
import { createTree } from '@nrwl/devkit/testing';
import { updateTsBaseConfig } from './tsconfig-base';

describe('tsconfig-base utils', () => {
  let workspaceTree: Tree;

  beforeEach(async () => {
    workspaceTree = createTree();
    workspaceTree.write(
      'tsconfig.base.json',
      JSON.stringify({ compilerOptions: { paths: {} } })
    );
  });

  describe('updateTsBaseConfig', () => {
    it('should throw an error when there is an exception during the update', () => {
      workspaceTree.delete('tsconfig.base.json');

      expect(() =>
        updateTsBaseConfig(workspaceTree, 'my-new-app', 'apps/my-new-app/src')
      ).toThrowError('Unable to update tsconfig.base.json');
    });

    it('should create an entry for the project', () => {
      updateTsBaseConfig(workspaceTree, 'my-new-app', 'apps/my-new-app/src');

      const tsconfigBaseJson = workspaceTree.read(
        'tsconfig.base.json',
        'utf-8'
      );
      expect(tsconfigBaseJson).toMatchSnapshot();
    });
  });
});
