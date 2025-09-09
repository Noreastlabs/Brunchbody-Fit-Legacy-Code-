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
        meals: [
          ...state.meals,
          {
            ...action.payload,
            id: Math.random().toString(36).slice(2),
            items: [],
          },
        ],
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
      const meal = state.meals.find(i => i.id === action.payload.id);

      return {
        ...state,
        mealItems: meal.items,
      };
    }
    case ADD_MEAL_ITEMS: {
      const temp = Array.from(state.meals);
      const index = temp.findIndex(i => i.id === action.payload.id);
      const copyItems = Array.from(temp[index].items);
      copyItems.push({
        ...action.payload.data,
        id: Math.random().toString(36).slice(2),
      });
      temp[index].items = copyItems;

      return {
        ...state,
        meals: temp,
        mealItems: copyItems,
      };
    }
    case EDIT_MEAL_ITEMS: {
      const temp = Array.from(state.meals);
      const mealIndex = temp.findIndex(i => i.id === action.payload.meal_id);
      const copyItems = Array.from(temp[mealIndex].items);
      const itemIndex = copyItems.findIndex(
        i => i.id === action.payload.item_id,
      );
      copyItems[itemIndex] = action.payload.data;
      temp[mealIndex].items = copyItems;

      return {
        ...state,
        meals: temp,
        mealItems: copyItems,
      };
    }
    case DELETE_MEAL_ITEMS: {
      const temp = Array.from(state.meals);
      const mealIndex = temp.findIndex(i => i.id === action.payload.meal_id);
      const copyItems = Array.from(temp[mealIndex].items);
      const itemIndex = copyItems.findIndex(
        i => i.id === action.payload.item_id,
      );
      copyItems.splice(itemIndex, 1);
      temp[mealIndex].items = copyItems;

      return {
        ...state,
        meals: temp,
        mealItems: copyItems,
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
        supplements: [
          ...state.supplements,
          {
            ...action.payload,
            id: Math.random().toString(36).slice(2),
            items: [],
          },
        ],
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
        supplementItems: supplement.items,
      };
    }
    case ADD_SUPPLEMENT_ITEMS: {
      const temp = Array.from(state.supplements);
      const index = temp.findIndex(i => i.id === action.payload.id);
      const copyItems = Array.from(temp[index].items);
      copyItems.push({
        ...action.payload.data,
        id: Math.random().toString(36).slice(2),
      });
      temp[index].items = copyItems;

      return {
        ...state,
        supplements: temp,
        supplementItems: copyItems,
      };
    }
    case EDIT_SUPPLEMENT_ITEMS: {
      const temp = Array.from(state.supplements);
      const mealIndex = temp.findIndex(
        i => i.id === action.payload.supplement_id,
      );
      const copyItems = Array.from(temp[mealIndex].items);
      const itemIndex = copyItems.findIndex(
        i => i.id === action.payload.item_id,
      );
      copyItems[itemIndex] = action.payload.data;
      temp[mealIndex].items = copyItems;

      return {
        ...state,
        supplements: temp,
        supplementItems: copyItems,
      };
    }
    case DELETE_SUPPLEMENT_ITEMS: {
      const temp = Array.from(state.supplements);
      const suppIndex = temp.findIndex(
        i => i.id === action.payload.supplement_id,
      );
      const copyItems = Array.from(temp[suppIndex].items);
      const itemIndex = copyItems.findIndex(
        i => i.id === action.payload.item_id,
      );
      copyItems.splice(itemIndex, 1);
      temp[suppIndex].items = copyItems;

      return {
        ...state,
        supplements: temp,
        supplementItems: copyItems,
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
