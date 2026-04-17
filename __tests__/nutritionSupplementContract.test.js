import nutritionReducer from '../src/redux/reducer/nutrition';
import {
  ADD_SUPPLEMENT,
  ADD_SUPPLEMENT_ITEMS,
  DELETE_SUPPLEMENT,
  DELETE_SUPPLEMENT_ITEMS,
  EDIT_SUPPLEMENT_ITEMS,
  GET_SUPPLEMENT_ITEMS,
  SET_SUPPLEMENT_ITEMS,
} from '../src/redux/constants';

describe('Nutrition supplement contract', () => {
  test('nutrition reducer keeps the legacy initial shape', () => {
    const state = nutritionReducer(undefined, {type: '@@INIT'});

    expect(Object.keys(state).sort()).toEqual([
      'mealCategories',
      'mealItems',
      'meals',
      'mealsDirectory',
      'supplementItems',
      'supplements',
    ]);
    expect(state).toEqual(
      expect.objectContaining({
        meals: [],
        mealItems: [],
        supplements: [],
        supplementItems: [],
        mealCategories: expect.any(Array),
        mealsDirectory: expect.any(Array),
      }),
    );
  });

  test('ADD_SUPPLEMENT appends a generated id and initializes empty items', () => {
    const state = nutritionReducer(undefined, {
      type: ADD_SUPPLEMENT,
      payload: {
        name: 'Omega 3',
        items: [{id: 'ignored-item', name: 'Ignored'}],
      },
    });

    expect(state.supplements).toHaveLength(1);
    expect(state.supplements[0]).toEqual(
      expect.objectContaining({
        name: 'Omega 3',
        items: [],
      }),
    );
    expect(state.supplements[0].id).toEqual(expect.any(String));
    expect(state.supplements[0].id).not.toBe('');
  });

  test('GET_SUPPLEMENT_ITEMS and SET_SUPPLEMENT_ITEMS preserve the current selection contract', () => {
    let state = nutritionReducer(undefined, {
      type: ADD_SUPPLEMENT,
      payload: {name: 'Vitamin D'},
    });

    const supplementId = state.supplements[0].id;

    state = nutritionReducer(state, {
      type: SET_SUPPLEMENT_ITEMS,
      payload: [{id: 'manual-item', name: 'Manual Override'}],
    });
    expect(state.supplementItems).toEqual([
      {id: 'manual-item', name: 'Manual Override'},
    ]);
    expect(state.supplements[0].items).toEqual([]);

    state = nutritionReducer(state, {
      type: GET_SUPPLEMENT_ITEMS,
      payload: {id: supplementId},
    });
    expect(state.supplementItems).toEqual(state.supplements[0].items);
  });

  test('supplement item add/edit/delete keeps mirrored supplementItems state and replace semantics', () => {
    let state = nutritionReducer(undefined, {
      type: ADD_SUPPLEMENT,
      payload: {name: 'Magnesium'},
    });

    const supplementId = state.supplements[0].id;

    state = nutritionReducer(state, {
      type: ADD_SUPPLEMENT_ITEMS,
      payload: {
        id: supplementId,
        data: {name: 'Capsule', dosage: '200mg', timing: 'PM'},
      },
    });

    const supplementItem = state.supplementItems[0];
    expect(state.supplementItems).toHaveLength(1);
    expect(supplementItem).toEqual(
      expect.objectContaining({
        name: 'Capsule',
        dosage: '200mg',
        timing: 'PM',
      }),
    );
    expect(supplementItem.id).toEqual(expect.any(String));
    expect(state.supplements[0].items).toEqual(state.supplementItems);

    state = nutritionReducer(state, {
      type: EDIT_SUPPLEMENT_ITEMS,
      payload: {
        supplement_id: supplementId,
        item_id: supplementItem.id,
        data: {id: supplementItem.id, name: 'Tablet'},
      },
    });
    expect(state.supplementItems).toEqual([
      {id: supplementItem.id, name: 'Tablet'},
    ]);
    expect(state.supplements[0].items).toEqual(state.supplementItems);
    expect(state.supplementItems[0].dosage).toBeUndefined();
    expect(state.supplementItems[0].timing).toBeUndefined();

    state = nutritionReducer(state, {
      type: DELETE_SUPPLEMENT_ITEMS,
      payload: {
        supplement_id: supplementId,
        item_id: supplementItem.id,
      },
    });
    expect(state.supplementItems).toEqual([]);
    expect(state.supplements[0].items).toEqual([]);
  });

  test('DELETE_SUPPLEMENT removes only the matching supplement', () => {
    let state = nutritionReducer(undefined, {
      type: ADD_SUPPLEMENT,
      payload: {name: 'Omega 3'},
    });
    state = nutritionReducer(state, {
      type: ADD_SUPPLEMENT,
      payload: {name: 'Creatine'},
    });

    const supplementIdToDelete = state.supplements[0].id;
    const remainingSupplement = state.supplements[1];

    state = nutritionReducer(state, {
      type: DELETE_SUPPLEMENT,
      payload: {id: supplementIdToDelete},
    });

    expect(state.supplements).toEqual([remainingSupplement]);
  });
});
