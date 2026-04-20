import {readFileSync, readdirSync} from 'fs';
import path from 'path';
import {parse} from '@babel/parser';

const repoRoot = path.join(__dirname, '..');
const repatriatedModalExports = [
  'AddRemoveTheme',
  'ClearTheme',
  'CreateTraitModal',
];

const readSource = relativePath =>
  readFileSync(path.join(repoRoot, relativePath), 'utf8');

const parseModule = relativePath =>
  parse(readSource(relativePath), {
    sourceType: 'module',
    plugins: ['jsx'],
  });

const getSpecifierNames = specifiers =>
  specifiers
    .map(specifier => specifier.imported?.name || specifier.exported?.name)
    .sort();

const getImportNames = (ast, sourceValue) => {
  const importDeclaration = ast.program.body.find(
    node =>
      node.type === 'ImportDeclaration' && node.source.value === sourceValue,
  );

  return importDeclaration ? getSpecifierNames(importDeclaration.specifiers) : [];
};

const getNamedExportNames = ast => {
  const exportDeclaration = ast.program.body.find(
    node => node.type === 'ExportNamedDeclaration' && !node.source,
  );

  return exportDeclaration ? getSpecifierNames(exportDeclaration.specifiers) : [];
};

const listJavaScriptFiles = relativeDir => {
  const absoluteDir = path.join(repoRoot, relativeDir);

  return readdirSync(absoluteDir, {withFileTypes: true}).flatMap(entry => {
    const relativePath = path.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      return listJavaScriptFiles(relativePath);
    }

    return entry.isFile() && relativePath.endsWith('.js') ? [relativePath] : [];
  });
};

const collectRepatriatedImportMap = () => {
  const importMap = {};

  listJavaScriptFiles('src').forEach(relativePath => {
    const source = readSource(relativePath);

    if (!repatriatedModalExports.some(name => source.includes(name))) {
      return;
    }

    const ast = parseModule(relativePath);
    const importedNames = ast.program.body
      .filter(node => node.type === 'ImportDeclaration')
      .flatMap(node =>
        getSpecifierNames(node.specifiers).filter(name =>
          repatriatedModalExports.includes(name),
        ),
      )
      .sort();

    if (importedNames.length > 0) {
      importMap[relativePath] = importedNames;
    }
  });

  return importMap;
};

describe('journal calendar modal repatriation boundary', () => {
  test('journal and calendar local modal barrels export exactly the repatriated subset', () => {
    const journalModalsAst = parseModule(
      'src/screens/journal/components/modals/index.js',
    );
    const journalExportDeclarations = journalModalsAst.program.body.filter(
      node => node.type === 'ExportNamedDeclaration',
    );
    const journalModalExportMap = Object.fromEntries(
      journalExportDeclarations.flatMap(node =>
        node.specifiers.map(specifier => [
          specifier.exported.name,
          node.source?.value,
        ]),
      ),
    );
    const calendarModalsAst = parseModule(
      'src/screens/calendar/pages/calendar/modals/index.js',
    );
    const calendarExportDeclarations = calendarModalsAst.program.body.filter(
      node => node.type === 'ExportNamedDeclaration',
    );
    const calendarModalExportMap = Object.fromEntries(
      calendarExportDeclarations.flatMap(node =>
        node.specifiers.map(specifier => [
          specifier.exported.name,
          node.source?.value,
        ]),
      ),
    );

    expect(Object.keys(journalModalExportMap).sort()).toEqual([
      'CreateTraitModal',
    ]);
    expect(journalModalExportMap).toEqual({
      CreateTraitModal:
        '../../../../components/CustomModal/CreateTraitModal',
    });

    expect(Object.keys(calendarModalExportMap).sort()).toEqual([
      'AddRemoveTheme',
      'ClearTheme',
    ]);
    expect(calendarModalExportMap).toEqual({
      AddRemoveTheme:
        '../../../../../components/CustomModal/AddRemoveTheme',
      ClearTheme: '../../../../../components/CustomModal/ClearTheme',
    });
  });

  test('shared barrels no longer expose the repatriated three while DatePickerModal remains shared', () => {
    const componentsAst = parseModule('src/components/index.js');
    const customModalImport = getImportNames(componentsAst, './CustomModal');
    const rootExportNames = getNamedExportNames(componentsAst);
    const customModalAst = parseModule('src/components/CustomModal/index.js');
    const customModalExportNames = getNamedExportNames(customModalAst);

    repatriatedModalExports.forEach(name => {
      expect(customModalImport).not.toContain(name);
      expect(rootExportNames).not.toContain(name);
      expect(customModalExportNames).not.toContain(name);
    });

    expect(customModalImport).toContain('DatePickerModal');
    expect(rootExportNames).toContain('DatePickerModal');
    expect(customModalExportNames).toContain('DatePickerModal');
  });

  test('journal and calendar consumers route through the new local barrels while DatePickerModal stays shared', () => {
    const dailyEntryAst = parseModule(
      'src/screens/journal/components/DailyEntry.js',
    );
    const calendarAst = parseModule(
      'src/screens/calendar/pages/calendar/Calendar.js',
    );
    const journalAst = parseModule('src/screens/journal/components/Journal.js');

    expect(getImportNames(dailyEntryAst, './modals')).toEqual([
      'CreateTraitModal',
    ]);
    expect(getImportNames(dailyEntryAst, '../../../components')).not.toContain(
      'CreateTraitModal',
    );

    expect(getImportNames(calendarAst, './modals')).toEqual([
      'AddRemoveTheme',
      'ClearTheme',
    ]);
    expect(getImportNames(calendarAst, '../../../../components')).toEqual(
      expect.arrayContaining([
        'CustomModal',
        'DatePickerModal',
        'PermissionModal',
        'SafeAreaWrapper',
        'WheelPickerContent',
      ]),
    );
    expect(
      getImportNames(calendarAst, '../../../../components'),
    ).not.toEqual(expect.arrayContaining(['AddRemoveTheme', 'ClearTheme']));

    expect(getImportNames(journalAst, '../../../components')).toContain(
      'DatePickerModal',
    );
  });

  test('no off-domain imports of the repatriated three remain anywhere under src', () => {
    expect(collectRepatriatedImportMap()).toEqual({
      'src/screens/calendar/pages/calendar/Calendar.js': [
        'AddRemoveTheme',
        'ClearTheme',
      ],
      'src/screens/journal/components/DailyEntry.js': ['CreateTraitModal'],
    });
  });
});
