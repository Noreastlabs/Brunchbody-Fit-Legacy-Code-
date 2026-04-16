import {exercisesDirectory} from '../../resources';
import {
  ADD_EXERCISE,
  DELETE_EXERCISE,
  EDIT_EXERCISE,
  GET_EXERCISES,
  GET_EXERCISE_DIRECTORY,
  MERGE_EXERCISES,
} from '../constants';

const isBrunchBodyExercise = exercise =>
  exercise.type.toLowerCase() === 'brunch body';

const filterDirectoryExercises = exercises =>
  exercises.filter(exercise => !isBrunchBodyExercise(exercise));

const withWheelPickerIds = exercises =>
  exercises.map((exercise, index) => ({
    ...exercise,
    wheelPickerId: index + 1,
  }));

const buildAllExercises = (exercises, exerciseDirectory) =>
  withWheelPickerIds([...exercises, ...exerciseDirectory]);

const buildWholeExercises = exercises => [
  ...exercises,
  ...exercisesDirectory.exercises,
];

const getNextWheelPickerId = allExercises => {
  const {wheelPickerId} = allExercises[allExercises.length - 1];
  return wheelPickerId + 1;
};

const updateExerciseById = (exercises, id, data) => {
  const nextExercises = Array.from(exercises);
  const exerciseIndex = nextExercises.findIndex(exercise => exercise.id === id);

  if (exerciseIndex >= 0) {
    nextExercises[exerciseIndex] = {
      ...nextExercises[exerciseIndex],
      ...data,
    };
  }

  return nextExercises;
};

const removeExerciseById = (exercises, id) => {
  const nextExercises = Array.from(exercises);
  const exerciseIndex = nextExercises.findIndex(exercise => exercise.id === id);

  if (exerciseIndex >= 0) {
    nextExercises.splice(exerciseIndex, 1);
  }

  return nextExercises;
};

const initialState = {
  exercises: [],
  allExercises: [],
  wholeExercises: [],
  exerciseDirectory: filterDirectoryExercises(exercisesDirectory.exercises),
};

const exerciseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EXERCISE_DIRECTORY: {
      return {
        ...state,
        exerciseDirectory: filterDirectoryExercises(action.payload),
      };
    }
    case GET_EXERCISES: {
      return {
        ...state,
        exercises: action.payload,
      };
    }
    case MERGE_EXERCISES: {
      return {
        ...state,
        allExercises: buildAllExercises(state.exercises, state.exerciseDirectory),
        wholeExercises: buildWholeExercises(state.exercises),
      };
    }
    case ADD_EXERCISE: {
      const exeData = {
        ...action.payload,
        id: Math.random().toString(36).slice(2),
      };

      return {
        ...state,
        exercises: [...state.exercises, exeData],
        allExercises: [
          ...state.allExercises,
          {
            ...exeData,
            wheelPickerId: getNextWheelPickerId(state.allExercises),
          },
        ],
      };
    }
    case EDIT_EXERCISE: {
      return {
        ...state,
        exercises: updateExerciseById(
          state.exercises,
          action.payload.id,
          action.payload.data,
        ),
        allExercises: updateExerciseById(
          state.allExercises,
          action.payload.id,
          action.payload.data,
        ),
      };
    }
    case DELETE_EXERCISE: {
      return {
        ...state,
        exercises: removeExerciseById(state.exercises, action.payload.id),
        allExercises: removeExerciseById(state.allExercises, action.payload.id),
      };
    }
    default:
      return state;
  }
};

export default exerciseReducer;
