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

describe('modal shell surface boundary', () => {
  const allowedModalShellExports = [
    'ColorPickerContent',
    'CreateItemContent',
    'CustomModal',
    'ModalContent',
    'SelectModalContent',
    'WheelPickerContent',
  ];

  const excludedModalShellExports = [
    'DatePickerModal',
    'HeightPickerModal',
    'TimePickerModal',
    'AddExerciseModal',
    'ProgramDetailModal',
    'AddWorkoutModal',
    'CreateTraitModal',
    'NutritionItems',
    'ItineraryDetail',
    'CalculationContent',
    'AddSingleExercise',
    'SupersetModal',
    'AddRemoveTheme',
    'ClearTheme',
    'AddCardioExercise',
    'PermissionModal',
  ];

  const remainingCustomModalExports = [
    'DatePickerModal',
    'HeightPickerModal',
    'ItineraryDetail',
    'NutritionItems',
    'ProgramDetailModal',
    'TimePickerModal',
  ];

  test('modal shell barrel exports only the intended shared modal-shell subset', () => {
    const modalShellAst = parseModule('src/components/modalShells/index.js');
    const exportDeclarations = modalShellAst.program.body.filter(
      node => node.type === 'ExportNamedDeclaration',
    );
    const modalShellExportMap = Object.fromEntries(
      exportDeclarations.flatMap(node =>
        node.specifiers.map(specifier => [
          specifier.exported.name,
          node.source?.value,
        ]),
      ),
    );

    expect(Object.keys(modalShellExportMap).sort()).toEqual(
      allowedModalShellExports,
    );
    expect(modalShellExportMap).toEqual({
      CustomModal: '../CustomModal/CustomModal',
      ModalContent: '../CustomModal/ModalContent',
      SelectModalContent: '../CustomModal/SelectModalContent',
      CreateItemContent: '../CustomModal/CreateItemContent',
      WheelPickerContent: '../CustomModal/WheelPickerContent',
      ColorPickerContent: '../CustomModal/ColorPickerContent',
    });

    excludedModalShellExports.forEach(name => {
      expect(modalShellExportMap).not.toHaveProperty(name);
    });
  });

  test('root components barrel routes modal shell names through the modal-shell family barrel', () => {
    const componentsAst = parseModule('src/components/index.js');
    const importDeclarations = componentsAst.program.body.filter(
      node => node.type === 'ImportDeclaration',
    );
    const modalShellImport = importDeclarations.find(
      node => node.source.value === './modalShells',
    );
    const customModalImport = importDeclarations.find(
      node => node.source.value === './CustomModal',
    );
    const directModalShellImports = importDeclarations
      .filter(node =>
        [
          './CustomModal/CustomModal',
          './CustomModal/ModalContent',
          './CustomModal/SelectModalContent',
          './CustomModal/CreateItemContent',
          './CustomModal/WheelPickerContent',
          './CustomModal/ColorPickerContent',
        ].includes(node.source.value),
      )
      .map(node => node.source.value);
    const exportDeclaration = componentsAst.program.body.find(
      node => node.type === 'ExportNamedDeclaration' && !node.source,
    );
    const exportedNames = getSpecifierNames(exportDeclaration.specifiers);

    expect(modalShellImport).toBeDefined();
    expect(getSpecifierNames(modalShellImport.specifiers)).toEqual(
      allowedModalShellExports,
    );
    expect(customModalImport).toBeDefined();
    expect(getSpecifierNames(customModalImport.specifiers)).toEqual(
      remainingCustomModalExports,
    );
    expect(getSpecifierNames(customModalImport.specifiers)).not.toEqual(
      expect.arrayContaining(allowedModalShellExports),
    );
    expect(directModalShellImports).toEqual([]);
    expect(exportedNames).toEqual(
      expect.arrayContaining(allowedModalShellExports),
    );
  });
});
