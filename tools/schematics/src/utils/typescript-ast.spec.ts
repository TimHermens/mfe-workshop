import * as ts from 'typescript';
import {
  arrayUnshift,
  findVariableNode,
  importModuleInFile,
  findPropertyNode,
  objectPush,
  findClassDeclarationNode,
  classMethodPush,
} from './typescript-ast';
import { HostTree } from '@angular-devkit/schematics';
import { insertChanges } from './workspace';
import { InsertChange } from '@schematics/angular/utility/change';
import { FILE_INDENT } from './const';

const createTsSource = (path: string, content: string): ts.SourceFile => {
  return ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
};

describe('typescript ast', () => {
  describe('findVariableNode', () => {
    const typeScriptFile = "const firstVariable = 'my first variable'";

    it('should find a variable in a source file', () => {
      const source = createTsSource('/somePath', typeScriptFile);
      const node = findVariableNode(source, 'firstVariable');
      expect(node).toBeDefined();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [declaration] = node!.declarationList.declarations;
      expect(declaration).toBeDefined();

      expect(declaration.name.getText()).toBe('firstVariable');
    });

    it('should return null when variable is not in the source file', () => {
      const source = createTsSource('/somePath', typeScriptFile);
      const node = findVariableNode(source, 'non-existing-variable-name');
      expect(node).toBe(null);
    });
  });

  describe('findPropertyNode', () => {
    const typeScriptFile = 'class Service {firstProperty: any = {}}';

    it('should find a property in a source file', () => {
      const source = createTsSource('/somePath', typeScriptFile);
      const node = findPropertyNode(source, 'firstProperty');
      expect(node).toBeDefined();
      expect(node.name.getText()).toBe('firstProperty');
    });

    it('should return null when variable is not in the source file', () => {
      const source = createTsSource('/somePath', typeScriptFile);
      const node = findVariableNode(source, 'non-existing-variable-name');
      expect(node).toBe(null);
    });
  });

  describe('findClassDeclarationNode', () => {
    const typeScriptFile = 'class Service {firstProperty: any = {}}';

    it('should find a Class in a source file', () => {
      const source = createTsSource('/somePath', typeScriptFile);
      const node = findClassDeclarationNode(source, 'Service');
      expect(node).toBeDefined();
      expect(node.name.getText()).toBe('Service');
    });

    it('should return null when Class name is not in the source file', () => {
      const source = createTsSource('/somePath', typeScriptFile);
      const node = findVariableNode(source, 'NotExistingClass');
      expect(node).toBe(null);
    });
  });

  describe('array unshift item', () => {
    [
      {
        input: 'const arrayVariable = [];',
        output: 'const arrayVariable = [\n  "B"\n];',
        it: 'should add item "B" to an empty array',
      },
      {
        input: 'const arrayVariable = [\n\n];',
        output: 'const arrayVariable = [\n  "B"\n];',
        it: 'should add item "B" to an empty array declared multi line',
      },
      {
        input: 'const arrayVariable = [\n  "A"\n];',
        output: 'const arrayVariable = [\n  "B",\n  "A"\n];',
        it: 'should add item "B" to the beginning of an array',
      },
      {
        input: 'const arrayVariable = [\n  "A",\n  "C",\n];',
        output: 'const arrayVariable = [\n  "B",\n  "A",\n  "C",\n];',
        it: 'should add an item "B "to the beginning of an array with multiple other items',
      },
    ].forEach(testData => {
      // eslint-disable-next-line jest/valid-title
      it(testData.it, () => {
        // create a file in the host
        const path = '/somePath';
        const host = new HostTree();
        host.create(path, testData.input);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const source = createTsSource(path, host.read(path)!.toString('utf8'));

        // get the changes to update the file
        const node = findVariableNode(source, 'arrayVariable');
        expect(node).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const changes = arrayUnshift(node!, path, '"B"');

        // apply changes to the file
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const output = insertChanges(host, path, changes)
          .read(path)!
          .toString('utf8');

        expect(output).toBe(testData.output);
      });
    });

    it('should throw an error when the provided node is not initialized', () => {
      const source = createTsSource('', 'let someVar: [];');
      const node = findVariableNode(source, 'someVar');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(() => arrayUnshift(node!, '', 'change')).toThrowError(
        "Node 'someVar' is not initialized"
      );
    });

    it('should throw an error when the provided node is not of type array', () => {
      const source = createTsSource('', 'const someVar = 123;');
      const node = findVariableNode(source, 'someVar');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(() => arrayUnshift(node!, '', 'change')).toThrowError(
        "Node 'someVar' is not of type array"
      );
    });
  });

  describe('object push', () => {
    const toAdd = 'key: value';
    const path = '/somePath';
    const typeScriptFile = 'class Service {firstProperty: any = {}}';
    const original = InsertChange;

    beforeEach(() => {
      (InsertChange as jest.Mock) = jest.fn();
    });

    afterEach(() => {
      (InsertChange as any) = original;
    });

    it('should push the new value to the object', () => {
      const source = createTsSource(path, typeScriptFile);
      const node = findPropertyNode(source, 'firstProperty');
      const pos = node.initializer.getEnd() - 4;

      objectPush(node, path, toAdd);

      expect(InsertChange).toHaveBeenCalledWith(
        path,
        pos,
        `\n${FILE_INDENT}${FILE_INDENT}${toAdd},`
      );
    });

    it('should throw an error if no initializer', () => {
      const nodeNoInitializer = { name: { getText: () => 'firstProperty' } };

      expect(() =>
        objectPush(nodeNoInitializer as any, path, toAdd)
      ).toThrowError("Node 'firstProperty' is not initialized");
      expect(InsertChange).not.toHaveBeenCalled();
    });

    it('should throw an error if node is not an object', () => {
      const typeScriptFile = 'class Service {firstProperty: any = []}';
      const source = createTsSource(path, typeScriptFile);
      const node = findPropertyNode(source, 'firstProperty');

      expect(() => objectPush(node, path, toAdd)).toThrowError(
        "Node 'firstProperty' is not of type object"
      );
      expect(InsertChange).not.toHaveBeenCalled();
    });
  });

  describe('classMethodPush', () => {
    const path = '/somePath';
    const typeScriptFile = 'class Service {foo(){}}';
    const original = InsertChange;

    beforeEach(() => {
      (InsertChange as jest.Mock) = jest.fn();
    });

    afterEach(() => {
      (InsertChange as any) = original;
    });

    it('should push the new value to the object', () => {
      const toAdd = 'bar(){}';
      const source = createTsSource(path, typeScriptFile);
      const node = findClassDeclarationNode(source, 'Service');
      const pos = node.getEnd() - 1;

      classMethodPush(node, path, 'bar', toAdd);

      expect(InsertChange).toHaveBeenCalledWith(
        path,
        pos,
        `\n${FILE_INDENT}${toAdd}\n`
      );
    });

    it('should throw an error if  method already exists', () => {
      const toAdd = 'foo(){}';
      const source = createTsSource(path, typeScriptFile);
      const node = findClassDeclarationNode(source, 'Service');

      expect(() => classMethodPush(node, path, 'foo', toAdd)).toThrowError(
        "Method 'foo' already existing in class"
      );
      expect(InsertChange).not.toHaveBeenCalled();
    });
  });

  describe('add import statement', () => {
    [
      {
        input: "import { someFunction } from '@some-module';",
        output:
          "import { someFunction } from '@some-module';\nimport { someFunction } from '@some-other-module';",
        it: 'should add the import statement when not yet imported in the file',
      },
      {
        input: "import { someFunction } from '@some-other-module';",
        output: "import { someFunction } from '@some-other-module';",
        it: 'should not add the import when it is already imported in the file',
      },
    ].forEach(testData => {
      // eslint-disable-next-line jest/valid-title
      it(testData.it, () => {
        const path = '/somePath';
        const host = new HostTree();
        host.create(path, testData.input);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const source = createTsSource(path, host.read(path)!.toString('utf8'));

        const changes = importModuleInFile(
          source,
          path,
          'someFunction',
          '@some-other-module'
        );

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const output = insertChanges(host, path, changes)
          .read(path)!
          .toString('utf8');

        expect(output).toBe(testData.output);
      });
    });
  });
});
