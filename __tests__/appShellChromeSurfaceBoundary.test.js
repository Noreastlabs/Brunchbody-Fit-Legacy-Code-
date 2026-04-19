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

describe('app shell chrome surface boundary', () => {
  const allowedChromeExports = [
    'CustomHeader',
    'LogoHeader',
    'SafeAreaWrapper',
  ];

  test('chrome barrel exports only the intended app-shell chrome subset', () => {
    const chromeAst = parseModule('src/components/chrome/index.js');
    const exportDeclarations = chromeAst.program.body.filter(
      node => node.type === 'ExportNamedDeclaration',
    );
    const chromeExportMap = Object.fromEntries(
      exportDeclarations.flatMap(node =>
        node.specifiers.map(specifier => [
          specifier.exported.name,
          node.source?.value,
        ]),
      ),
    );

    expect(Object.keys(chromeExportMap).sort()).toEqual(allowedChromeExports);
    expect(chromeExportMap).toEqual({
      CustomHeader: '../CustomHeader',
      LogoHeader: '../LogoHeader',
      SafeAreaWrapper: '../SafeAreaWrapper',
    });

    expect(chromeExportMap).not.toHaveProperty('CloseButton');
    expect(chromeExportMap).not.toHaveProperty('TopTabs');
    expect(chromeExportMap).not.toHaveProperty('CustomTopTabs');
    expect(chromeExportMap).not.toHaveProperty('SearchBar');
  });

  test('root components barrel routes chrome names through the chrome barrel', () => {
    const componentsAst = parseModule('src/components/index.js');
    const importDeclarations = componentsAst.program.body.filter(
      node => node.type === 'ImportDeclaration',
    );
    const chromeImport = importDeclarations.find(
      node => node.source.value === './chrome',
    );
    const directChromeImports = importDeclarations
      .filter(node =>
        ['./CustomHeader', './LogoHeader', './SafeAreaWrapper'].includes(
          node.source.value,
        ),
      )
      .map(node => node.source.value);
    const exportDeclaration = componentsAst.program.body.find(
      node => node.type === 'ExportNamedDeclaration' && !node.source,
    );
    const exportedNames = getSpecifierNames(exportDeclaration.specifiers);

    expect(chromeImport).toBeDefined();
    expect(getSpecifierNames(chromeImport.specifiers)).toEqual(
      allowedChromeExports,
    );
    expect(directChromeImports).toEqual([]);
    expect(exportedNames).toEqual(expect.arrayContaining(allowedChromeExports));
  });
});
