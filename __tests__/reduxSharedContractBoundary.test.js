import {readFileSync} from 'fs';
import path from 'path';

const readSource = relativePath =>
  readFileSync(path.join(__dirname, '..', relativePath), 'utf8');

const getExportKeys = moduleExports =>
  Object.keys(moduleExports)
    .filter(key => key !== '__esModule')
    .sort();

describe('redux shared contract boundary', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.dontMock('../src/redux/store');
    jest.resetModules();
  });

  test('constants barrel re-exports the full constants surface including RESET_APP', () => {
    const constantsBarrel = require('../src/redux/constants');
    const constantsSource = require('../src/redux/constants/constants');

    expect(getExportKeys(constantsBarrel)).toEqual(getExportKeys(constantsSource));
    expect(constantsBarrel.RESET_APP).toBe('RESET_APP');
    expect(constantsBarrel.RESET_APP).toBe(constantsSource.RESET_APP);
  });

  test('actions barrel preserves the union of the current domain action modules', () => {
    const actionsBarrel = require('../src/redux/actions');
    const expectedActions = {
      ...require('../src/redux/actions/auth'),
      ...require('../src/redux/actions/calendar'),
      ...require('../src/redux/actions/exercise'),
      ...require('../src/redux/actions/journal'),
      ...require('../src/redux/actions/nutrition'),
      ...require('../src/redux/actions/recreation'),
      ...require('../src/redux/actions/todo'),
    };

    expect(getExportKeys(actionsBarrel)).toEqual(getExportKeys(expectedActions));

    for (const key of getExportKeys(expectedActions)) {
      expect(actionsBarrel[key]).toBe(expectedActions[key]);
    }
  });

  test('reducer barrel preserves the named reducer aliases', () => {
    const reducersBarrel = require('../src/redux/reducer');
    const expectedReducers = {
      authReducer: require('../src/redux/reducer/auth').default,
      calendarReducer: require('../src/redux/reducer/calendar').default,
      exerciseReducer: require('../src/redux/reducer/exercise').default,
      journalReducer: require('../src/redux/reducer/journal').default,
      nutritionReducer: require('../src/redux/reducer/nutrition').default,
      recreationReducer: require('../src/redux/reducer/recreation').default,
      todoReducer: require('../src/redux/reducer/todo').default,
    };

    expect(getExportKeys(reducersBarrel)).toEqual(getExportKeys(expectedReducers));

    for (const key of getExportKeys(expectedReducers)) {
      expect(reducersBarrel[key]).toBe(expectedReducers[key]);
    }
  });

  test('root redux entrypoint preserves namespaced exports and the store re-export', () => {
    jest.isolateModules(() => {
      const mockedStoreModule = {
        __esModule: true,
        persistor: {kind: 'persistor'},
        store: {kind: 'store'},
      };

      jest.doMock('../src/redux/store', () => mockedStoreModule);

      const reduxRoot = require('../src/redux');
      const actionsBarrel = require('../src/redux/actions');
      const constantsBarrel = require('../src/redux/constants');
      const reducersBarrel = require('../src/redux/reducer');

      expect(getExportKeys(reduxRoot)).toEqual([
        'actions',
        'constants',
        'persistor',
        'reducers',
        'store',
      ]);
      expect(reduxRoot.actions).toBe(actionsBarrel);
      expect(reduxRoot.constants).toBe(constantsBarrel);
      expect(reduxRoot.reducers).toBe(reducersBarrel);
      expect(reduxRoot.store).toBe(mockedStoreModule.store);
      expect(reduxRoot.persistor).toBe(mockedStoreModule.persistor);
    });
  });

  test('store source keeps the frozen reducer mount and persistence contract', () => {
    const storeSource = readSource('src/redux/store/store.js');

    expect(storeSource).toMatch(
      /import\s+\{\s*RESET_APP\s*\}\s+from\s+'\.\.\/constants';/,
    );
    expect(storeSource).toMatch(/if\s*\(action\.type\s*===\s*RESET_APP\)/);

    expect(storeSource).toMatch(/auth:\s*authReducer,/);
    expect(storeSource).toMatch(/recreation:\s*recreationReducer,/);
    expect(storeSource).toMatch(/journal:\s*journalReducer,/);
    expect(storeSource).toMatch(/nutrition:\s*nutritionReducer,/);
    expect(storeSource).toMatch(/calendar:\s*calendarReducer,/);
    expect(storeSource).toMatch(/exercise:\s*exerciseReducer,/);
    expect(storeSource).toMatch(/todo:\s*calendarTodoReducer,/);

    expect(storeSource).toMatch(/whitelist:\s*\[[\s\S]*'auth'/);
    expect(storeSource).toMatch(/whitelist:\s*\[[\s\S]*'recreation'/);
    expect(storeSource).toMatch(/whitelist:\s*\[[\s\S]*'journal'/);
    expect(storeSource).toMatch(/whitelist:\s*\[[\s\S]*'nutrition'/);
    expect(storeSource).toMatch(/whitelist:\s*\[[\s\S]*'calendar'/);
    expect(storeSource).toMatch(/whitelist:\s*\[[\s\S]*'exercise'/);
    expect(storeSource).toMatch(/whitelist:\s*\[[\s\S]*'todo'/);
  });
});
