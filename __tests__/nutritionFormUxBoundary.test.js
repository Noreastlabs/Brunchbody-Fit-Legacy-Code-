import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-redux', () => ({
  connect: () => Component => Component,
}));

jest.mock('../src/redux/actions', () => ({
  addMeal: jest.fn(() => ({type: 'ADD_MEAL'})),
  addMealItems: jest.fn(() => ({type: 'ADD_MEAL_ITEMS'})),
  addSupplement: jest.fn(() => ({type: 'ADD_SUPPLEMENT'})),
  addSupplementItems: jest.fn(() => ({type: 'ADD_SUPPLEMENT_ITEMS'})),
  deleteMeal: jest.fn(() => ({type: 'DELETE_MEAL'})),
  deleteMealItem: jest.fn(() => ({type: 'DELETE_MEAL_ITEM'})),
  deleteSupplement: jest.fn(() => ({type: 'DELETE_SUPPLEMENT'})),
  deleteSupplementItem: jest.fn(() => ({type: 'DELETE_SUPPLEMENT_ITEM'})),
  editMealItem: jest.fn(() => ({type: 'EDIT_MEAL_ITEM'})),
  editSupplementItem: jest.fn(() => ({type: 'EDIT_SUPPLEMENT_ITEM'})),
  getMealCategories: jest.fn(() => ({type: 'GET_MEAL_CATEGORIES'})),
  getMealItems: jest.fn(() => ({type: 'GET_MEAL_ITEMS'})),
  getMeals: jest.fn(() => ({type: 'GET_MEALS'})),
  getMealsDirectory: jest.fn(() => ({type: 'GET_MEALS_DIRECTORY'})),
  getSupplementItems: jest.fn(() => ({type: 'GET_SUPPLEMENT_ITEMS'})),
  getSupplements: jest.fn(() => ({type: 'GET_SUPPLEMENTS'})),
  profile: jest.fn(() => ({type: 'PROFILE'})),
  setMealItems: jest.fn(() => ({type: 'SET_MEAL_ITEMS'})),
  setSupplementItems: jest.fn(() => ({type: 'SET_SUPPLEMENT_ITEMS'})),
}));

jest.mock('../src/resources', () => ({
  __esModule: true,
  colors: {
    darkBlue2: 'darkBlue2',
  },
  wheelPickerItems: {
    units: [
      {id: 1, value: 'mg'},
      {id: 2, value: 'g'},
    ],
    mealUnits: [
      {id: 1, value: 'g'},
      {id: 2, value: 'kg'},
      {id: 3, value: 'lbs'},
      {id: 4, value: 'oz'},
    ],
  },
}));

jest.mock('../src/screens/nutrition/components', () => {
  const ReactLocal = require('react');

  return {
    Nutrition: props =>
      ReactLocal.createElement('mock-nutrition-screen', props),
    Meal: props => ReactLocal.createElement('mock-nutrition-meal', props),
    Supplement: props =>
      ReactLocal.createElement('mock-nutrition-supplement', props),
    MealDetail: props =>
      ReactLocal.createElement('mock-nutrition-meal-detail', props),
  };
});

import NutritionPage from '../src/screens/nutrition/pages/Nutrition/Nutrition';
import MealPage from '../src/screens/nutrition/pages/Meal/Meal';
import SupplementPage from '../src/screens/nutrition/pages/Supplement/Supplement';
import MealDetailPage from '../src/screens/nutrition/pages/MealDetail/MealDetail';

const createDeferred = () => {
  let resolve;
  const promise = new Promise(res => {
    resolve = res;
  });

  return {promise, resolve};
};

const renderInAct = async element => {
  let renderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(element);
  });

  return renderer;
};

describe('Nutrition form UX boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('NutritionPage keeps create validation inline and separate from the shared loader', async () => {
    const renderer = await renderInAct(
      <NutritionPage
        navigation={{navigate: jest.fn()}}
        onAddMeal={jest.fn().mockResolvedValue(true)}
        getUserMeals={jest.fn().mockResolvedValue(true)}
        getUserSupplements={jest.fn().mockResolvedValue(true)}
        onGetMealItems={jest.fn().mockResolvedValue(true)}
        onGetSupplementItems={jest.fn().mockResolvedValue(true)}
        myMeals={[]}
        onAddSupplement={jest.fn().mockResolvedValue(true)}
        mySupplements={[]}
        updateUserProfile={jest.fn().mockResolvedValue(true)}
        onDeleteMeal={jest.fn().mockResolvedValue(true)}
        onDeleteSupplement={jest.fn().mockResolvedValue(true)}
        getAllMealCategories={jest.fn().mockResolvedValue(true)}
        getAllMealsDirectory={jest.fn().mockResolvedValue(true)}
        onSetMealItems={jest.fn().mockResolvedValue(true)}
        onSetSupplementItems={jest.fn().mockResolvedValue(true)}
      />,
    );

    const getProps = () =>
      renderer.root.findByType('mock-nutrition-screen').props;

    ReactTestRenderer.act(() => {
      getProps().onAddBtnPress('meal', 'Create Meal');
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onCreateItem();
    });

    expect(getProps().createItemErrorText).toBe(
      'Enter a meal name before creating it.',
    );
    expect(getProps().permissionModal).toBe(false);
    expect(getProps().createItemPending).toBe(false);

    ReactTestRenderer.act(() => {
      getProps().onChangeHandler({name: 'loader', value: true});
    });

    expect(getProps().loader).toBe(true);
    expect(getProps().createItemPending).toBe(false);

    ReactTestRenderer.act(() => {
      getProps().onChangeTitle({name: 'title', value: 'Snack'});
    });

    expect(getProps().createItemFields[0].value).toBe('Snack');

    ReactTestRenderer.act(() => {
      getProps().closeCreateItemModal();
      getProps().onAddBtnPress('supplement', 'Create Supplement Stack');
    });

    expect(getProps().createItemFields[0].value).toBe('');
    expect(getProps().createItemErrorText).toBe('');

    await ReactTestRenderer.act(async () => {
      await getProps().onCreateItem();
    });

    expect(getProps().createItemErrorText).toBe(
      'Enter a supplement stack name before creating it.',
    );
  });

  test('MealPage validates inline and clears stale modal state across sessions', async () => {
    const props = {
      navigation: {navigate: jest.fn()},
      route: {
        params: {
          meal: {id: 'meal-1', name: 'Lunch'},
        },
      },
      onAddMealItems: jest.fn().mockResolvedValue(true),
      onDeleteMealItem: jest.fn().mockResolvedValue(true),
      onEditMealItem: jest.fn().mockResolvedValue(true),
      myMealItems: [],
    };

    const renderer = await renderInAct(<MealPage {...props} />);
    const getProps = () => renderer.root.findByType('mock-nutrition-meal').props;

    ReactTestRenderer.act(() => {
      getProps().setSelectedOption('CUSTOM ITEM');
    });
    ReactTestRenderer.act(() => {
      getProps().onChooseOption();
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onCreateItem();
    });

    expect(props.onAddMealItems).not.toHaveBeenCalled();
    expect(getProps().createItemFormErrorText).toBe(
      'Check the highlighted meal item fields before saving.',
    );
    expect(getProps().createItemFields[0].errorText).toBe(
      'Enter a meal item name.',
    );

    ReactTestRenderer.act(() => {
      getProps().onChangeText('Chicken Breast', 'itemName');
      getProps().onChangeText('abc', 'itemFat');
      getProps().onChangeText('0', 'itemProtein');
      getProps().onChangeText('12.5', 'itemCarbs');
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onCreateItem();
    });

    expect(props.onAddMealItems).not.toHaveBeenCalled();
    expect(getProps().createItemFields[1].errorText).toBe('Fat must be a number.');
    expect(getProps().createItemFields[2].errorText).toBeUndefined();

    ReactTestRenderer.act(() => {
      getProps().closeCreateItemModal();
      getProps().setSelectedOption('CUSTOM ITEM');
    });
    ReactTestRenderer.act(() => {
      getProps().onChooseOption();
    });

    expect(getProps().createItemFormErrorText).toBe('');
    expect(getProps().createItemFields[0].value).toBe('');
    expect(getProps().createItemFields[1].errorText).toBeUndefined();
  });

  test('MealPage blocks duplicate add and delete dispatches while pending', async () => {
    const addDeferred = createDeferred();
    const deleteDeferred = createDeferred();
    const props = {
      navigation: {navigate: jest.fn()},
      route: {
        params: {
          meal: {id: 'meal-1', name: 'Lunch'},
        },
      },
      onAddMealItems: jest.fn().mockImplementation(() => addDeferred.promise),
      onDeleteMealItem: jest
        .fn()
        .mockImplementation(() => deleteDeferred.promise),
      onEditMealItem: jest.fn().mockResolvedValue(true),
      myMealItems: [],
    };

    const renderer = await renderInAct(<MealPage {...props} />);
    const getProps = () => renderer.root.findByType('mock-nutrition-meal').props;

    ReactTestRenderer.act(() => {
      getProps().setSelectedOption('CUSTOM ITEM');
    });
    ReactTestRenderer.act(() => {
      getProps().onChooseOption();
      getProps().onChangeText('Yogurt', 'itemName');
      getProps().onChangeText('1', 'itemFat');
      getProps().onChangeText('2', 'itemProtein');
      getProps().onChangeText('3', 'itemCarbs');
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onCreateItem();
      const second = getProps().onCreateItem();

      await Promise.resolve();
      expect(props.onAddMealItems).toHaveBeenCalledTimes(1);

      addDeferred.resolve(true);
      await first;
      await second;
    });

    ReactTestRenderer.act(() => {
      getProps().onEditItem({
        id: 'item-1',
        name: 'Yogurt',
        fat: '1',
        prt: '2',
        cho: '3',
      });
      getProps().onRequestDelete();
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onDonePermissionModal();
      const second = getProps().onDonePermissionModal();

      await Promise.resolve();
      expect(props.onDeleteMealItem).toHaveBeenCalledTimes(1);

      deleteDeferred.resolve(true);
      await first;
      await second;
    });
  });

  test('SupplementPage validates inline, clears stale modal state, and blocks duplicate save/delete dispatches', async () => {
    const editDeferred = createDeferred();
    const deleteDeferred = createDeferred();
    const props = {
      route: {
        params: {
          supplement: {id: 'supp-1', name: 'Daily Stack'},
        },
      },
      onAddSupplementItems: jest.fn().mockResolvedValue(true),
      onDeleteSupplementItem: jest
        .fn()
        .mockImplementation(() => deleteDeferred.promise),
      onEditSupplementItem: jest
        .fn()
        .mockImplementation(() => editDeferred.promise),
      mySupplementItems: [],
    };

    const renderer = await renderInAct(<SupplementPage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-nutrition-supplement').props;

    ReactTestRenderer.act(() => {
      getProps().onOpenModal();
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onCreateItem();
    });

    expect(props.onAddSupplementItems).not.toHaveBeenCalled();
    expect(getProps().createItemFields[0].errorText).toBe(
      'Enter a supplement item name.',
    );
    expect(getProps().createItemFields[2].errorText).toBe('Choose a unit.');

    ReactTestRenderer.act(() => {
      getProps().onChangeText('Creatine', 'itemName');
      getProps().onChangeText('abc', 'itemAmount');
      getProps().setItemUnit('mg');
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onCreateItem();
    });

    expect(props.onAddSupplementItems).not.toHaveBeenCalled();
    expect(getProps().createItemFields[1].errorText).toBe(
      'Amount must be a number.',
    );

    ReactTestRenderer.act(() => {
      getProps().closeCreateItemModal();
      getProps().onOpenModal();
    });

    expect(getProps().createItemFormErrorText).toBe('');
    expect(getProps().createItemFields[0].value).toBe('');

    ReactTestRenderer.act(() => {
      getProps().onEditItem({
        id: 'supp-item-1',
        name: 'Creatine',
        qty: '5',
        unt: 'mg',
      });
      getProps().onChangeText('7', 'itemAmount');
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onCreateItem();
      const second = getProps().onCreateItem();

      await Promise.resolve();
      expect(props.onEditSupplementItem).toHaveBeenCalledTimes(1);

      editDeferred.resolve(true);
      await first;
      await second;
    });

    ReactTestRenderer.act(() => {
      getProps().onEditItem({
        id: 'supp-item-1',
        name: 'Creatine',
        qty: '7',
        unt: 'mg',
      });
      getProps().onRequestDelete();
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onDonePermissionModal();
      const second = getProps().onDonePermissionModal();

      await Promise.resolve();
      expect(props.onDeleteSupplementItem).toHaveBeenCalledTimes(1);

      deleteDeferred.resolve(true);
      await first;
      await second;
    });
  });

  test('MealDetailPage shows the baseline, requires recalculation after edits, and clears back to baseline', async () => {
    const props = {
      navigation: {pop: jest.fn()},
      route: {
        params: {
          meal: {
            name: 'Chicken Breast',
            fat: 1,
            prt: 2,
            cho: 3,
            cal: 21,
          },
          targetMealId: 'meal-7',
        },
      },
      onAddMealItems: jest.fn().mockResolvedValue(true),
    };

    const renderer = await renderInAct(<MealDetailPage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-nutrition-meal-detail').props;

    expect(getProps().quantity).toBe('1');
    expect(getProps().itemUnit).toBe('g');
    expect(getProps().addDisabled).toBe(false);
    expect(getProps().entryErrorText).toBe('');

    ReactTestRenderer.act(() => {
      getProps().setAmount('2');
    });

    expect(getProps().addDisabled).toBe(true);
    expect(getProps().entryErrorText).toBe(
      'Tap Calculate to update nutrition before adding to meal.',
    );

    await ReactTestRenderer.act(async () => {
      await getProps().onAddMeal();
    });

    expect(props.onAddMealItems).not.toHaveBeenCalled();

    ReactTestRenderer.act(() => {
      getProps().setUnit('g');
    });

    ReactTestRenderer.act(() => {
      getProps().onCalculateHandler();
    });

    expect(getProps().quantity).toBe('2');
    expect(getProps().itemUnit).toBe('g');
    expect(getProps().addDisabled).toBe(false);
    expect(getProps().entryErrorText).toBe('');

    await ReactTestRenderer.act(async () => {
      await getProps().onAddMeal();
    });

    expect(props.onAddMealItems).toHaveBeenCalledWith('meal-7', {
      name: 'Chicken Breast',
      fat: '2',
      prt: '4',
      cho: '6',
      cal: '58',
    });

    ReactTestRenderer.act(() => {
      getProps().onClearForm();
    });

    expect(getProps().quantity).toBe('1');
    expect(getProps().itemUnit).toBe('g');
    expect(getProps().amount).toBe('');
    expect(getProps().unit).toBe('');
    expect(getProps().addDisabled).toBe(false);
    expect(getProps().entryErrorText).toBe('');
  });
});
