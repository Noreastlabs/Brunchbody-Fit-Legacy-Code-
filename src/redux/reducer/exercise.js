import {exercisesDirectory} from '../../resources';
import {
  ADD_EXERCISE,
  DELETE_EXERCISE,
  EDIT_EXERCISE,
  GET_EXERCISES,
  GET_EXERCISE_DIRECTORY,
  MERGE_EXERCISES,
} from '../constants';

const initialState = {
  exercises: [],
  allExercises: [],
  wholeExercises: [],
  exerciseDirectory: exercisesDirectory.exercises.filter(
    i => i.type.toLowerCase() !== 'brunch body',
  ),
};

const exerciseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EXERCISE_DIRECTORY: {
      return {
        ...state,
        exerciseDirectory: action.payload.filter(
          i => i.type.toLowerCase() !== 'brunch body',
        ),
      };
    }
    case GET_EXERCISES: {
      return {
        ...state,
        exercises: action.payload,
      };
    }
    case MERGE_EXERCISES: {
      const allExe = [];
      const temp = [...state.exercises, ...state.exerciseDirectory];
      temp.map((item, index) =>
        allExe.push({...item, wheelPickerId: index + 1}),
      );

      return {
        ...state,
        allExercises: allExe,
        wholeExercises: [...state.exercises, ...exercisesDirectory.exercises],
      };
    }
    case ADD_EXERCISE: {
      const exeData = {
        ...action.payload,
        id: Math.random().toString(36).slice(2),
      };
      const {wheelPickerId} = state.allExercises[state.allExercises.length - 1];

      return {
        ...state,
        exercises: [...state.exercises, exeData],
        allExercises: [
          ...state.allExercises,
          {
            ...exeData,
            wheelPickerId: wheelPickerId + 1,
          },
        ],
      };
    }
    case EDIT_EXERCISE: {
      const temp = Array.from(state.exercises);
      const index = temp.findIndex(i => i.id === action.payload.id);
      temp[index] = {...temp[index], ...action.payload.data};

      const allExe = state.allExercises;
      const exeIndex = allExe.findIndex(i => i.id === action.payload.id);
      allExe[exeIndex] = {...allExe[exeIndex], ...action.payload.data};

      return {
        ...state,
        exercises: temp,
        allExercises: allExe,
      };
    }
    case DELETE_EXERCISE: {
      const temp = Array.from(state.exercises);
      const index = temp.findIndex(i => i.id === action.payload.id);
      temp.splice(index, 1);

      const allExe = Array.from(state.allExercises);
      const exeIndex = allExe.findIndex(i => i.id === action.payload.id);
      allExe.splice(exeIndex, 1);

      return {
        ...state,
        exercises: temp,
        allExercises: allExe,
      };
    }
    default:
      return state;
  }
};

export default exerciseReducer;
