import { formatFiles, getProjects, joinPathFragments, Tree } from '@nrwl/devkit';
import { Schema } from './schema';
import { spawnSync } from 'child_process';
import { updateDepConst } from "../utils/update-dep-const";
import { getWorkspaceName } from "../utils/workspace";

export default async function (tree: Tree, schema: Schema) {
  try {
    const projectName = `${schema.name}-domain`;
    if (getProjects(tree).has(projectName)) {
      throw new Error('This domain project already exists.');
    }
    const args: string[] = [
      `--name domain`,
      `--directory ${schema.name}`,
      `--tags "domain:${schema.name},type:domain-logic"`,
      '--buildable',
      `--importPath @${getWorkspaceName(tree)}/${projectName}`
    ];

    spawnSync('nx g lib', args, {shell: true, stdio: 'inherit'});

    updateDepConst(tree, (depConst) => {
      depConst.push({
        sourceTag: `domain:${schema.name}`,
        onlyDependOnLibsWithTags: [`domain:${schema.name}`, 'domain:shared'],
      });
    });

    const dir = `libs/${schema.name}/domain/src/lib`;
    tree.write(joinPathFragments(dir, './application/.gitkeep'), '');
    tree.write(joinPathFragments(dir, './entities/.gitkeep'), '');
    tree.write(joinPathFragments(dir, './infrastructure/.gitkeep'), '');

    await formatFiles(tree);
  } catch (error) {
    throw new Error(error);
  }
}
