import {readFileSync, readdirSync} from 'fs';
import path from 'path';
import {parse} from '@babel/parser';

const repoRoot = path.join(__dirname, '..');
const repatriatedModalExports = [
  'AddCardioExercise',
  'AddExerciseModal',
  'AddSingleExercise',
  'AddWorkoutModal',
  'SupersetModal',
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
    node => node.type === 'ImportDeclaration' && node.source.value === sourceValue,
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

describe('recreation modal repatriation boundary', () => {
  test('recreation modal barrel exports exactly the repatriated recreation-owned subset', () => {
    const recreationModalsAst = parseModule(
      'src/screens/recreation/components/modals/index.js',
    );
    const exportDeclarations = recreationModalsAst.program.body.filter(
      node => node.type === 'ExportNamedDeclaration',
    );
    const recreationModalExportMap = Object.fromEntries(
      exportDeclarations.flatMap(node =>
        node.specifiers.map(specifier => [
          specifier.exported.name,
          node.source?.value,
        ]),
      ),
    );

    expect(Object.keys(recreationModalExportMap).sort()).toEqual(
      repatriatedModalExports,
    );
    expect(recreationModalExportMap).toEqual({
      AddExerciseModal: '../../../../components/CustomModal/AddExerciseModal',
      AddWorkoutModal: '../../../../components/CustomModal/AddWorkoutModal',
      AddSingleExercise: '../../../../components/CustomModal/AddSingleExercise',
      SupersetModal: '../../../../components/CustomModal/SupersetModal',
      AddCardioExercise:
        '../../../../components/CustomModal/AddCardioExercise',
    });
    expect(recreationModalExportMap).not.toHaveProperty('ProgramDetailModal');
    expect(recreationModalExportMap).not.toHaveProperty('DatePickerModal');
    expect(recreationModalExportMap).not.toHaveProperty('NutritionItems');
  });

  test('shared barrels no longer expose the repatriated five while ProgramDetailModal remains shared', () => {
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

    expect(customModalImport).toContain('ProgramDetailModal');
    expect(rootExportNames).toContain('ProgramDetailModal');
    expect(customModalExportNames).toContain('ProgramDetailModal');
  });

  test('recreation consumers route through the new local barrel while ProgramDetailModal stays on the shared seam', () => {
    const recreationAst = parseModule('src/screens/recreation/components/Recreation.js');
    const editProgramAst = parseModule('src/screens/recreation/components/EditProgram.js');
    const programManagerAst = parseModule(
      'src/screens/recreation/components/ProgramManager.js',
    );
    const caloriesAst = parseModule('src/screens/journal/components/Calories.js');

    expect(getImportNames(recreationAst, './modals')).toEqual(['AddWorkoutModal']);
    expect(getImportNames(recreationAst, '../../../components')).not.toContain(
      'AddWorkoutModal',
    );

    expect(getImportNames(editProgramAst, './modals')).toEqual(
      ['AddCardioExercise', 'AddExerciseModal', 'AddSingleExercise', 'SupersetModal'],
    );
    expect(getImportNames(editProgramAst, '../../../components')).not.toEqual(
      expect.arrayContaining([
        'AddCardioExercise',
        'AddExerciseModal',
        'AddSingleExercise',
        'SupersetModal',
      ]),
    );

    expect(getImportNames(programManagerAst, '../../../components')).toContain(
      'ProgramDetailModal',
    );
    expect(getImportNames(caloriesAst, '../../../components')).toContain(
      'ProgramDetailModal',
    );
  });

  test('no off-domain imports of the repatriated five remain anywhere under src', () => {
    expect(collectRepatriatedImportMap()).toEqual({
      'src/screens/recreation/components/EditProgram.js': [
        'AddCardioExercise',
        'AddExerciseModal',
        'AddSingleExercise',
        'SupersetModal',
      ],
      'src/screens/recreation/components/Recreation.js': ['AddWorkoutModal'],
    });
  });
});
