import {
  ADD_MEAL,
  ADD_MEAL_ITEMS,
  ADD_SUPPLEMENT,
  ADD_SUPPLEMENT_ITEMS,
  DELETE_MEAL,
  DELETE_MEAL_ITEMS,
  DELETE_SUPPLEMENT,
  DELETE_SUPPLEMENT_ITEMS,
  EDIT_MEAL_ITEMS,
  EDIT_SUPPLEMENT_ITEMS,
  GET_MEALS,
  GET_MEALS_DIRECTORY,
  GET_MEAL_CATEGORIES,
  GET_MEAL_ITEMS,
  GET_SUPPLEMENTS,
  GET_SUPPLEMENT_ITEMS,
  SET_MEAL_ITEMS,
  SET_SUPPLEMENT_ITEMS,
} from '../constants';
import {mealsDirectory} from '../../resources';

const initialState = {
  meals: [],
  mealItems: [],
  supplements: [],
  supplementItems: [],
  mealCategories: mealsDirectory.categories,
  mealsDirectory: mealsDirectory.meals,
};

const createGeneratedId = () => Math.random().toString(36).slice(2);

const createMeal = data => ({
  ...data,
  id: createGeneratedId(),
  items: [],
});

const createSupplement = data => ({
  ...data,
  id: createGeneratedId(),
  items: [],
});

const getMealItemsById = (meals, mealId) =>
  meals.find(i => i.id === mealId).items;

const getSupplementItemsById = (supplements, supplementId) =>
  supplements.find(i => i.id === supplementId).items;

const addMealItem = (items, data) => {
  const copyItems = Array.from(items);
  copyItems.push({
    ...data,
    id: createGeneratedId(),
  });
  return copyItems;
};

const addSupplementItem = (items, data) => {
  const copyItems = Array.from(items);
  copyItems.push({
    ...data,
    id: createGeneratedId(),
  });
  return copyItems;
};

const replaceMealItem = (items, itemId, data) => {
  const copyItems = Array.from(items);
  const itemIndex = copyItems.findIndex(i => i.id === itemId);
  copyItems[itemIndex] = data;
  return copyItems;
};

const replaceSupplementItem = (items, itemId, data) => {
  const copyItems = Array.from(items);
  const itemIndex = copyItems.findIndex(i => i.id === itemId);
  copyItems[itemIndex] = data;
  return copyItems;
};

const removeMealItem = (items, itemId) => {
  const copyItems = Array.from(items);
  const itemIndex = copyItems.findIndex(i => i.id === itemId);
  copyItems.splice(itemIndex, 1);
  return copyItems;
};

const removeSupplementItem = (items, itemId) => {
  const copyItems = Array.from(items);
  const itemIndex = copyItems.findIndex(i => i.id === itemId);
  copyItems.splice(itemIndex, 1);
  return copyItems;
};

const updateMealItemsState = (meals, mealId, updateItems) => {
  const nextMeals = Array.from(meals);
  const mealIndex = nextMeals.findIndex(i => i.id === mealId);
  const nextItems = updateItems(nextMeals[mealIndex].items);

  nextMeals[mealIndex].items = nextItems;

  return {
    meals: nextMeals,
    mealItems: nextItems,
  };
};

const updateSupplementItemsState = (supplements, supplementId, updateItems) => {
  const nextSupplements = Array.from(supplements);
  const supplementIndex = nextSupplements.findIndex(i => i.id === supplementId);
  const nextItems = updateItems(nextSupplements[supplementIndex].items);

  nextSupplements[supplementIndex].items = nextItems;

  return {
    supplements: nextSupplements,
    supplementItems: nextItems,
  };
};

const nutritionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MEALS: {
      return {
        ...state,
        meals: action.payload,
      };
    }
    case ADD_MEAL: {
      return {
        ...state,
        meals: [...state.meals, createMeal(action.payload)],
      };
    }
    case DELETE_MEAL: {
      return {
        ...state,
        meals: state.meals.filter(i => i.id !== action.payload.id),
      };
    }
    case SET_MEAL_ITEMS: {
      return {
        ...state,
        mealItems: action.payload,
      };
    }
    case GET_MEAL_ITEMS: {
      return {
        ...state,
        mealItems: getMealItemsById(state.meals, action.payload.id),
      };
    }
    case ADD_MEAL_ITEMS: {
      return {
        ...state,
        ...updateMealItemsState(state.meals, action.payload.id, items =>
          addMealItem(items, action.payload.data),
        ),
      };
    }
    case EDIT_MEAL_ITEMS: {
      return {
        ...state,
        ...updateMealItemsState(state.meals, action.payload.meal_id, items =>
          replaceMealItem(items, action.payload.item_id, action.payload.data),
        ),
      };
    }
    case DELETE_MEAL_ITEMS: {
      return {
        ...state,
        ...updateMealItemsState(state.meals, action.payload.meal_id, items =>
          removeMealItem(items, action.payload.item_id),
        ),
      };
    }
    case GET_SUPPLEMENTS: {
      return {
        ...state,
        supplements: action.payload,
      };
    }
    case ADD_SUPPLEMENT: {
      return {
        ...state,
        supplements: [...state.supplements, createSupplement(action.payload)],
      };
    }
    case DELETE_SUPPLEMENT: {
      return {
        ...state,
        supplements: state.supplements.filter(i => i.id !== action.payload.id),
      };
    }
    case SET_SUPPLEMENT_ITEMS: {
      return {
        ...state,
        supplementItems: action.payload,
      };
    }
    case GET_SUPPLEMENT_ITEMS: {
      const supplement = state.supplements.find(
        i => i.id === action.payload.id,
      );

      return {
        ...state,
        supplementItems: getSupplementItemsById(state.supplements, supplement.id),
      };
    }
    case ADD_SUPPLEMENT_ITEMS: {
      return {
        ...state,
        ...updateSupplementItemsState(
          state.supplements,
          action.payload.id,
          items => addSupplementItem(items, action.payload.data),
        ),
      };
    }
    case EDIT_SUPPLEMENT_ITEMS: {
      return {
        ...state,
        ...updateSupplementItemsState(
          state.supplements,
          action.payload.supplement_id,
          items =>
            replaceSupplementItem(
              items,
              action.payload.item_id,
              action.payload.data,
            ),
        ),
      };
    }
    case DELETE_SUPPLEMENT_ITEMS: {
      return {
        ...state,
        ...updateSupplementItemsState(
          state.supplements,
          action.payload.supplement_id,
          items => removeSupplementItem(items, action.payload.item_id),
        ),
      };
    }
    case GET_MEAL_CATEGORIES: {
      return {
        ...state,
        mealCategories: action.payload,
      };
    }
    case GET_MEALS_DIRECTORY: {
      return {
        ...state,
        mealsDirectory: action.payload,
      };
    }
    default:
      return state;
  }
};

export default nutritionReducer;
