import { Tree, joinPathFragments, updateJson } from '@nrwl/devkit';
import { CompilerOptions } from 'typescript';

export function updateTsBaseConfig(
  tree: Tree,
  projectName: string,
  projectRoot: string
) {
  const tsConfig = 'tsconfig.base.json';
  try {
    updateJson(
      tree,
      tsConfig,
      (tsConfig: Record<'compilerOptions', CompilerOptions>) => {
        Object.assign(tsConfig.compilerOptions.paths, {
          [`@senses/${projectName}`]: [
            joinPathFragments(projectRoot, 'index.ts'),
          ],
        });
        return tsConfig;
      }
    );
  } catch (error) {
    throw new Error(`Unable to update ${tsConfig}`);
  }
}
