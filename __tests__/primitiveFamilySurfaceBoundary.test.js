import {readFileSync} from 'fs';
import path from 'path';
import {parse} from '@babel/parser';

const readSource = relativePath =>
  readFileSync(path.join(__dirname, '..', relativePath), 'utf8');

const parseModule = relativePath =>
  parse(readSource(relativePath), {
    sourceType: 'module',
    plugins: ['jsx'],
  });

const getSpecifierNames = specifiers =>
  specifiers
    .map(specifier => specifier.imported?.name || specifier.exported?.name)
    .sort();

describe('primitive family surface boundary', () => {
  const allowedPrimitiveExports = [
    'AddButton',
    'Button',
    'CloseButton',
    'CustomText',
    'Input',
    'TextButton',
    'TextVal',
  ];

  test('primitive barrel exports only the intended primitive subset', () => {
    const primitivesAst = parseModule('src/components/primitives/index.js');
    const exportDeclarations = primitivesAst.program.body.filter(
      node => node.type === 'ExportNamedDeclaration',
    );
    const primitiveExportMap = Object.fromEntries(
      exportDeclarations.flatMap(node =>
        node.specifiers.map(specifier => [
          specifier.exported.name,
          node.source?.value,
        ]),
      ),
    );

    expect(Object.keys(primitiveExportMap).sort()).toEqual(
      allowedPrimitiveExports,
    );
    expect(primitiveExportMap).toEqual({
      Button: '../Button',
      AddButton: '../AddButton',
      TextButton: '../TextButton',
      CloseButton: '../CloseButton',
      CustomText: '../CustomText',
      Input: '../TextInput',
      TextVal: '../Text',
    });

    expect(primitiveExportMap).not.toHaveProperty('CustomTextArea');
    expect(primitiveExportMap).not.toHaveProperty('SearchBar');
    expect(primitiveExportMap).not.toHaveProperty('CustomOptions');
    expect(primitiveExportMap).not.toHaveProperty('SelectComp');
    expect(primitiveExportMap).not.toHaveProperty('TopTabs');
    expect(primitiveExportMap).not.toHaveProperty('CustomTopTabs');
  });

  test('root components barrel routes primitive names through the primitive family barrel', () => {
    const componentsAst = parseModule('src/components/index.js');
    const importDeclarations = componentsAst.program.body.filter(
      node => node.type === 'ImportDeclaration',
    );
    const primitiveImport = importDeclarations.find(
      node => node.source.value === './primitives',
    );
    const directPrimitiveImports = importDeclarations
      .filter(node =>
        [
          './Button',
          './AddButton',
          './TextButton',
          './CloseButton',
          './CustomText',
          './TextInput',
          './Text',
        ].includes(node.source.value),
      )
      .map(node => node.source.value);
    const exportDeclaration = componentsAst.program.body.find(
      node => node.type === 'ExportNamedDeclaration' && !node.source,
    );
    const exportedNames = getSpecifierNames(exportDeclaration.specifiers);

    expect(primitiveImport).toBeDefined();
    expect(getSpecifierNames(primitiveImport.specifiers)).toEqual(
      allowedPrimitiveExports,
    );
    expect(directPrimitiveImports).toEqual([]);
    expect(exportedNames).toEqual(expect.arrayContaining(allowedPrimitiveExports));
  });
});
