import { spawnSync } from 'child_process';
import { ProjectConfiguration, ProjectGraph, ProjectGraphNode } from '@nrwl/devkit';
import { existsSync, readFileSync } from 'fs';
import * as fg from 'fast-glob';

function getAffectedNxProjects(): string[] {
  const command = spawnSync('nx print-affected', [ '--select=projects' ], {shell: true, stdio: 'pipe'});
  const output = command.stdout.toString();
  return output.trim().split(', ');
}

function getDependencyGraph(): ProjectGraph<ProjectConfiguration> {
  spawnSync('nx graph', [ '--file=tmp/dep-graph.json' ], {shell: true, stdio: 'pipe'});
  return JSON.parse(readFileSync('tmp/dep-graph.json', 'utf-8')).graph;
}

function getProjectNode(project: string, graph: ProjectGraph<ProjectConfiguration>): ProjectGraphNode {
  return graph.nodes[project];
}

type AffectedIntegrationTestProjectRoot = {
  [project: string]: string;
};

function getAffectedIntegrationTestProjectRoot(affectedProjects: string[], graph: ProjectGraph<ProjectConfiguration>): AffectedIntegrationTestProjectRoot {
  return affectedProjects.reduce<AffectedIntegrationTestProjectRoot>((acc, project) => {
    const node = getProjectNode(project, graph);
    if (node.type === 'app') {
      const e2eProject = project.concat('-e2e');
      const e2eTargetProject = acc[e2eProject];
      if (!e2eTargetProject) {
        const e2eNode = getProjectNode(e2eProject, graph);
        acc[e2eProject] = e2eNode.data.root;
      }
    }
    return acc;
  }, {});
}

type AffectedIntegrationTestFiles = {
  [project: string]: string[];
};

function getAffectedSpecFiles(affectedProjects: Set<string>, affectedIntegrationTestProjectRoot: AffectedIntegrationTestProjectRoot): AffectedIntegrationTestFiles {
  return Object.entries(affectedIntegrationTestProjectRoot).reduce<AffectedIntegrationTestFiles>((acc, [ project, root ]) => {
    if (!acc[project]) {
      acc[project] = [];
    }

    const specFiles = fg.sync([ `${ root }/**/*.spec.ts` ]);
    specFiles.forEach(file => {
      const metaFile = file.replace('.ts', '.affected.json');
      if (!existsSync(metaFile)) {
        acc[project].push(file);
        return;
      }
      const output = JSON.parse(readFileSync(metaFile, 'utf-8')) as { affectedProjects: string[] };
      const specAffectedProjects = output.affectedProjects;
      if (specAffectedProjects.some(project => affectedProjects.has(project))) {
        acc[project].push(file);
      }
    });
    return acc;
  }, {});
}

function runAffectedIntegrationTests() {
  const graph = getDependencyGraph();
  const affectedProjects = getAffectedNxProjects();
  const affectedIntegrationTestProjectRoot = getAffectedIntegrationTestProjectRoot(affectedProjects, graph);
  const affectedSpecFiles = getAffectedSpecFiles(new Set(affectedProjects), affectedIntegrationTestProjectRoot);

  let exitCode = 0;
  Object.entries(affectedSpecFiles)
    .filter(([ _, specFiles ]) => specFiles.length > 0)
    .forEach(([ project, specFiles ]) => {
      const command = spawnSync(`nx e2e ${ project }`, [ `--spec="${ specFiles.join(',') }"` ], {
        shell: true,
        stdio: 'inherit'
      });
      if (command.status === 1) {
        exitCode = 1;
      }
    });

  process.exit(exitCode);
}

runAffectedIntegrationTests();
