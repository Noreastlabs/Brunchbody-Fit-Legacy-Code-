import {readFileSync, readdirSync} from 'fs';
import path from 'path';
import {parse} from '@babel/parser';

const repoRoot = path.join(__dirname, '..');
const repatriatedModalExports = ['CalculationContent'];

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

describe('nutrition modal repatriation boundary', () => {
  test('nutrition modal barrel exports exactly CalculationContent', () => {
    const nutritionModalsAst = parseModule(
      'src/screens/nutrition/components/modals/index.js',
    );
    const exportDeclarations = nutritionModalsAst.program.body.filter(
      node => node.type === 'ExportNamedDeclaration',
    );
    const nutritionModalExportMap = Object.fromEntries(
      exportDeclarations.flatMap(node =>
        node.specifiers.map(specifier => [
          specifier.exported.name,
          node.source?.value,
        ]),
      ),
    );

    expect(Object.keys(nutritionModalExportMap).sort()).toEqual(
      repatriatedModalExports,
    );
    expect(nutritionModalExportMap).toEqual({
      CalculationContent:
        '../../../../components/CustomModal/CalculationContent',
    });
  });

  test('shared barrels no longer expose CalculationContent while NutritionItems remains shared', () => {
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

    expect(customModalImport).toContain('NutritionItems');
    expect(rootExportNames).toContain('NutritionItems');
    expect(customModalExportNames).toContain('NutritionItems');
  });

  test('nutrition routes CalculationContent through the local barrel while NutritionItems stays shared', () => {
    const nutritionAst = parseModule('src/screens/nutrition/components/Nutrition.js');
    const caloriesAst = parseModule('src/screens/journal/components/Calories.js');

    expect(getImportNames(nutritionAst, './modals')).toEqual([
      'CalculationContent',
    ]);
    expect(getImportNames(nutritionAst, '../../../components')).toEqual(
      expect.arrayContaining(['NutritionItems']),
    );
    expect(getImportNames(nutritionAst, '../../../components')).not.toContain(
      'CalculationContent',
    );

    expect(getImportNames(caloriesAst, '../../../components')).toContain(
      'NutritionItems',
    );
  });

  test('no off-domain imports of CalculationContent remain anywhere under src', () => {
    expect(collectRepatriatedImportMap()).toEqual({
      'src/screens/nutrition/components/Nutrition.js': ['CalculationContent'],
    });
  });
});
