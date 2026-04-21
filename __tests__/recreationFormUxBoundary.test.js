import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const mockDispatch = jest.fn();
const mockTodayKey = {
  today: '2024/01/01',
  date: 1,
  month: 1,
  year: 2024,
  todoListDate: '2024/01/01',
  setDate: jest.fn(),
  setMonth: jest.fn(),
  setYear: jest.fn(),
  setTodoListDate: jest.fn(),
  resetToToday: jest.fn(),
};

jest.mock('react-redux', () => ({
  connect: () => Component => Component,
  useDispatch: () => mockDispatch,
}));

jest.mock('../src/context/DateProvider', () => ({
  useTodayKey: () => mockTodayKey,
}));

jest.mock('../src/redux/actions', () => ({
  addCompletedWorkout: jest.fn(() => ({type: 'ADD_COMPLETED_WORKOUT'})),
  addCustomPlan: jest.fn(() => ({type: 'ADD_CUSTOM_PLAN'})),
  addExercise: jest.fn(() => ({type: 'ADD_EXERCISE'})),
  addMyWorkout: jest.fn(() => ({type: 'ADD_MY_WORKOUT'})),
  addRoutine: jest.fn(() => ({type: 'ADD_ROUTINE'})),
  addRoutineTask: jest.fn(() => ({type: 'ADD_ROUTINE_TASK'})),
  addWeekPlan: jest.fn(() => ({type: 'ADD_WEEK_PLAN'})),
  deleteCustomPlan: jest.fn(() => ({type: 'DELETE_CUSTOM_PLAN'})),
  deleteExercise: jest.fn(() => ({type: 'DELETE_EXERCISE'})),
  deleteMyWorkout: jest.fn(() => ({type: 'DELETE_MY_WORKOUT'})),
  deleteRoutine: jest.fn(() => ({type: 'DELETE_ROUTINE'})),
  deleteRoutineTask: jest.fn(() => ({type: 'DELETE_ROUTINE_TASK'})),
  editExercise: jest.fn(() => ({type: 'EDIT_EXERCISE'})),
  editMyWorkout: jest.fn(() => ({type: 'EDIT_MY_WORKOUT'})),
  editRoutineTask: jest.fn(() => ({type: 'EDIT_ROUTINE_TASK'})),
  editWeekPlan: jest.fn(() => ({type: 'EDIT_WEEK_PLAN'})),
  getBrunchBodyPlans: jest.fn(() => ({type: 'GET_BRUNCH_BODY_PLANS'})),
  getBrunchBodyWeekPlan: jest.fn(() => ({type: 'GET_BRUNCH_BODY_WEEK_PLAN'})),
  getCustomPlans: jest.fn(() => ({type: 'GET_CUSTOM_PLANS'})),
  getExerciseDirectory: jest.fn(() => ({type: 'GET_EXERCISE_DIRECTORY'})),
  getExercises: jest.fn(() => ({type: 'GET_EXERCISES'})),
  getRoutines: jest.fn(() => ({type: 'GET_ROUTINES'})),
  getWeekPlans: jest.fn(() => ({type: 'GET_WEEK_PLANS'})),
  getWorkouts: jest.fn(() => ({type: 'GET_WORKOUTS'})),
  mergeExercises: jest.fn(() => ({type: 'MERGE_EXERCISES'})),
  profile: jest.fn(() => ({type: 'PROFILE'})),
}));

jest.mock('../src/resources', () => ({
  __esModule: true,
  wheelPickerItems: {
    weeks: [
      {id: 1, value: '1'},
      {id: 2, value: '2'},
      {id: 3, value: '3'},
      {id: 4, value: '4'},
    ],
    sets: [
      {id: 1, value: '1'},
      {id: 2, value: '2'},
      {id: 3, value: '3'},
    ],
    exerciseUnits: [
      {id: 1, value: 'Reps', unit: 'Rp'},
      {id: 2, value: 'Minutes', unit: 'Mn'},
    ],
  },
}));

jest.mock('../src/screens/recreation/components', () => {
  const ReactLocal = require('react');

  return {
    Recreation: props =>
      ReactLocal.createElement('mock-recreation-screen', props),
    EditRoutine: props =>
      ReactLocal.createElement('mock-edit-routine-screen', props),
    MyExercises: props =>
      ReactLocal.createElement('mock-my-exercises-screen', props),
    EditProgram: props =>
      ReactLocal.createElement('mock-edit-program-screen', props),
  };
});

import RecreationPage from '../src/screens/recreation/pages/Recreation/Recreation';
import EditRoutinePage from '../src/screens/recreation/pages/EditRoutine/EditRoutine';
import MyExercisesPage from '../src/screens/recreation/pages/MyExercises/MyExercises';
import EditProgramPage from '../src/screens/recreation/pages/EditProgram/EditProgram';

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

describe('recreation form UX boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RecreationPage validates routine/program creation inline, resets stale modal state, and guards duplicate create dispatches', async () => {
    const createPlanDeferred = createDeferred();
    const props = {
      navigation: {navigate: jest.fn()},
      myCustomPlans: [],
      onAddRoutine: jest.fn().mockResolvedValue(true),
      myRoutines: [],
      getUserRoutines: jest.fn().mockResolvedValue(true),
      onDeleteRoutine: jest.fn().mockResolvedValue(true),
      getUserCustomPlans: jest.fn().mockResolvedValue(true),
      onAddCustomPlan: jest.fn().mockImplementation(() => createPlanDeferred.promise),
      onDeleteCustomPlan: jest.fn().mockResolvedValue(true),
      onGetExercises: jest.fn().mockResolvedValue(true),
      brunchBodyPlans: [],
      onGetBrunchBodyPlans: jest.fn().mockResolvedValue(true),
      onAddMyWorkout: jest.fn().mockResolvedValue(true),
      onGetMyWorkouts: jest.fn().mockResolvedValue(true),
      myWorkouts: [],
      onDeleteWorkout: jest.fn().mockResolvedValue(true),
      onEditMyWorkout: jest.fn().mockResolvedValue(true),
      onGetWeekPlan: jest.fn().mockResolvedValue(true),
      myWeekPlan: {weekDays: []},
      getAllExerciseDirectory: jest.fn().mockResolvedValue(true),
      onMergeExercises: jest.fn().mockResolvedValue(true),
      onGetBrunchBodyWeekPlan: jest.fn().mockResolvedValue({}),
      updateUserProfile: jest.fn().mockResolvedValue(true),
      onCompleteWorkout: jest.fn().mockResolvedValue(true),
      user: {completedWorkouts: {}, deletedWorkouts: {}},
      allExercises: [],
      completedWorkouts: [],
    };

    const renderer = await renderInAct(<RecreationPage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-recreation-screen').props;

    ReactTestRenderer.act(() => {
      getProps().openCreateRoutineModal();
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onCreateItem();
    });

    expect(getProps().createItemErrorText).toBe(
      'Check the highlighted routine fields before creating it.',
    );
    expect(getProps().createItemFields[0].errorText).toBe(
      'Enter a routine name.',
    );
    expect(getProps().permissionModal).toBe(false);

    ReactTestRenderer.act(() => {
      getProps().onCreateItemTitleChange('Morning Routine');
      getProps().closeCreateItemModal();
      getProps().openCreateRoutineModal();
    });

    expect(getProps().createItemFields[0].value).toBe('');
    expect(getProps().createItemErrorText).toBe('');

    ReactTestRenderer.act(() => {
      getProps().setSelectedProgramMenuOption('CREATE A PLAN');
    });
    ReactTestRenderer.act(() => {
      expect(getProps().selectedProgramMenuOption).toBe('CREATE A PLAN');
      getProps().onProgramMenuSelect();
    });
    ReactTestRenderer.act(() => {
      getProps().onCreateItemTitleChange('Starter Block');
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onCreateItem();
    });

    expect(getProps().createItemFields[1].errorText).toBe(
      'Select the number of weeks.',
    );

    ReactTestRenderer.act(() => {
      getProps().setPickerItems([{id: 1, value: '4'}]);
      getProps().setPickerType('Weeks');
    });
    ReactTestRenderer.act(() => {
      getProps().onPickerItemSelect(1);
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onCreateItem();
      const second = getProps().onCreateItem();

      expect(props.onAddCustomPlan).toHaveBeenCalledTimes(1);
      createPlanDeferred.resolve(true);
      await first;
      await second;
    });

    expect(props.onAddCustomPlan).toHaveBeenCalledWith({
      name: 'Starter Block',
      numOfWeeks: '4',
    });
  });

  test('EditRoutinePage keeps task validation inline, resets modal state, and guards duplicate add/delete dispatches', async () => {
    const addDeferred = createDeferred();
    const deleteDeferred = createDeferred();
    const props = {
      route: {
        params: {
          selectedItem: {id: 'routine-1', name: 'Morning Routine'},
        },
      },
      onAddRoutineTask: jest.fn().mockImplementation(() => addDeferred.promise),
      onDeleteRoutineTask: jest
        .fn()
        .mockImplementation(() => deleteDeferred.promise),
      onEditRoutineTask: jest.fn().mockResolvedValue(true),
      myRoutineTasks: [],
    };

    const renderer = await renderInAct(<EditRoutinePage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-edit-routine-screen').props;

    ReactTestRenderer.act(() => {
      getProps().onOpenCreateTaskModal();
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onCreateItem();
    });

    expect(getProps().createItemFormErrorText).toBe(
      'Check the highlighted task field before saving.',
    );
    expect(getProps().createTaskFields[0].errorText).toBe('Enter a task name.');
    expect(getProps().permissionModal).toBe(false);

    ReactTestRenderer.act(() => {
      getProps().onTaskNameChange('Stretch');
      getProps().closeCreateTaskModal();
      getProps().onOpenCreateTaskModal();
    });

    expect(getProps().createTaskFields[0].value).toBe('');
    expect(getProps().createItemFormErrorText).toBe('');

    ReactTestRenderer.act(() => {
      getProps().onTaskNameChange('Stretch');
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onCreateItem();
      const second = getProps().onCreateItem();

      expect(props.onAddRoutineTask).toHaveBeenCalledTimes(1);
      addDeferred.resolve(true);
      await first;
      await second;
    });

    ReactTestRenderer.act(() => {
      getProps().onRoutineTaskHandler({id: 'task-1', name: 'Stretch'});
      getProps().setCheck('delete');
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onDonePermissionModal();
      const second = getProps().onDonePermissionModal();

      expect(props.onDeleteRoutineTask).toHaveBeenCalledTimes(1);
      deleteDeferred.resolve(true);
      await first;
      await second;
    });
  });

  test('MyExercisesPage keeps validation inline, resets stale state, and derives equivalent picker options from the current exercise type', async () => {
    const allExercises = [
      {id: 'exercise-1', name: 'Push Up', type: 'Exercise', met: '3.5', rpm: '30', mph: 0},
      {id: 'cardio-1', name: 'Run', type: 'Cardio', met: '7', rpm: 0, mph: '7.5'},
      {id: 'sport-1', name: 'Tennis', type: 'Sport', met: '5', rpm: 0, mph: 0},
    ];
    const props = {
      userExercises: [
        {
          id: 'custom-1',
          name: 'My Run',
          equivalentExercise: 'Run',
          type: 'cardio',
        },
      ],
      onCreateExercise: jest.fn().mockResolvedValue(true),
      onDeleteExercise: jest.fn().mockResolvedValue(true),
      onUpdateExercise: jest.fn().mockResolvedValue(true),
      allExercises,
    };

    const renderer = await renderInAct(<MyExercisesPage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-my-exercises-screen').props;

    ReactTestRenderer.act(() => {
      getProps().onOpenCreateExerciseTypeModal();
    });
    ReactTestRenderer.act(() => {
      getProps().setExerciseType('CARDIO');
    });
    ReactTestRenderer.act(() => {
      getProps().onNextBtnPress();
    });

    expect(getProps().availableEquivalentExercises).toEqual([
      allExercises[1],
    ]);

    await ReactTestRenderer.act(async () => {
      await getProps().onAddExercise();
    });

    expect(getProps().createItemFormErrorText).toBe(
      'Check the highlighted exercise fields before saving.',
    );
    expect(getProps().createExerciseFields[0].errorText).toBe(
      'Enter an exercise name.',
    );
    expect(getProps().permissionModal).toBe(false);

    ReactTestRenderer.act(() => {
      getProps().closeCreateItemModal();
      getProps().onOpenCreateExerciseTypeModal();
    });

    expect(getProps().exerciseType).toBe('EXERCISE');
    expect(getProps().createItemFormErrorText).toBe('');

    ReactTestRenderer.act(() => {
      getProps().onOpenExerciseActions(props.userExercises[0]);
    });

    expect(getProps().availableEquivalentExercises).toEqual([
      allExercises[1],
    ]);
  });

  test('MyExercisesPage guards duplicate add, edit, and delete dispatches', async () => {
    const createExerciseDeferred = createDeferred();
    const updateExerciseDeferred = createDeferred();
    const deleteExerciseDeferred = createDeferred();
    const allExercises = [
      {id: 'exercise-1', name: 'Push Up', type: 'Exercise', met: '3.5', rpm: '30', mph: 0},
      {id: 'cardio-1', name: 'Run', type: 'Cardio', met: '7', rpm: 0, mph: '7.5'},
    ];
    const props = {
      userExercises: [
        {
          id: 'custom-1',
          name: 'My Run',
          equivalentExercise: 'Run',
          type: 'cardio',
        },
      ],
      onCreateExercise: jest
        .fn()
        .mockImplementation(() => createExerciseDeferred.promise),
      onDeleteExercise: jest
        .fn()
        .mockImplementation(() => deleteExerciseDeferred.promise),
      onUpdateExercise: jest
        .fn()
        .mockImplementation(() => updateExerciseDeferred.promise),
      allExercises,
    };

    const renderer = await renderInAct(<MyExercisesPage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-my-exercises-screen').props;

    ReactTestRenderer.act(() => {
      getProps().onOpenCreateExerciseTypeModal();
    });
    ReactTestRenderer.act(() => {
      getProps().setExerciseType('CARDIO');
    });
    ReactTestRenderer.act(() => {
      getProps().onNextBtnPress();
    });
    ReactTestRenderer.act(() => {
      getProps().onExerciseNameChange('Intervals');
      getProps().onEquivalentExerciseSelect(1);
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onAddExercise();
      const second = getProps().onAddExercise();

      expect(props.onCreateExercise).toHaveBeenCalledTimes(1);
      createExerciseDeferred.resolve(true);
      await first;
      await second;
    });

    ReactTestRenderer.act(() => {
      getProps().onOpenExerciseActions(props.userExercises[0]);
      getProps().onOpenEditExerciseModal();
      getProps().onExerciseNameChange('My Faster Run');
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onEditExercise();
      const second = getProps().onEditExercise();

      expect(props.onUpdateExercise).toHaveBeenCalledTimes(1);
      updateExerciseDeferred.resolve(true);
      await first;
      await second;
    });

    ReactTestRenderer.act(() => {
      getProps().onOpenExerciseActions(props.userExercises[0]);
      getProps().setCheck('delete');
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onDonePermissionModal();
      const second = getProps().onDonePermissionModal();

      expect(props.onDeleteExercise).toHaveBeenCalledTimes(1);
      deleteExerciseDeferred.resolve(true);
      await first;
      await second;
    });
  });

  test('EditProgramPage keeps single/cardio/superset validation inside the active modal and guards duplicate local entry adds', async () => {
    const exerciseOption = {
      id: 'exercise-1',
      name: 'Push Up',
      type: 'Exercise',
      met: '3.5',
      rpm: '30',
      mph: 0,
    };
    const cardioOption = {
      id: 'cardio-1',
      name: 'Run',
      type: 'Cardio',
      met: '7',
      rpm: 0,
      mph: '7.5',
    };
    const props = {
      route: {
        params: {
          selectedProgram: {id: 'program-1', name: 'Starter'},
          selectedDay: {week: 1, day: 1, plan: [], note: ''},
        },
      },
      onAddWeekPlan: jest.fn().mockResolvedValue(true),
      onEditWeekPlan: jest.fn().mockResolvedValue(true),
      myWeekPlan: {week: 1, weekDays: []},
      user: {weight: '180'},
      myExercises: [exerciseOption, cardioOption],
    };

    const renderer = await renderInAct(<EditProgramPage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-edit-program-screen').props;

    ReactTestRenderer.act(() => {
      getProps().onAddBtnPress();
    });
    ReactTestRenderer.act(() => {
      getProps().onNextBtnPress();
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onAddSingleExercise();
    });

    expect(getProps().singleExerciseFormErrorText).toBe(
      'Check the highlighted exercise fields before saving.',
    );
    expect(getProps().singleExerciseFieldErrors.exercise).toBe(
      'Select an exercise.',
    );
    expect(getProps().isPermissionModal).toBe(false);

    ReactTestRenderer.act(() => {
      getProps().setPickerItems([exerciseOption]);
      getProps().setPickerType('Exercise');
    });
    ReactTestRenderer.act(() => {
      getProps().onPickerItemSelect(1);
    });
    ReactTestRenderer.act(() => {
      getProps().setPickerItems([{id: 1, value: '3'}]);
      getProps().setPickerType('Sets');
    });
    ReactTestRenderer.act(() => {
      getProps().onPickerItemSelect(1);
    });
    ReactTestRenderer.act(() => {
      getProps().onSingleAmountChange('abc');
    });
    ReactTestRenderer.act(() => {
      getProps().setPickerItems([{id: 1, unit: 'Rp'}]);
      getProps().setPickerType('Unit');
    });
    ReactTestRenderer.act(() => {
      getProps().onPickerItemSelect(1);
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onAddSingleExercise();
    });

    expect(getProps().singleExerciseFieldErrors.amount).toBe(
      'Amount must be a number.',
    );

    ReactTestRenderer.act(() => {
      getProps().onSingleAmountChange('10');
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onAddSingleExercise();
      await getProps().onAddSingleExercise();
    });

    expect(getProps().allDayPlan).toHaveLength(1);

    ReactTestRenderer.act(() => {
      getProps().onAddBtnPress();
    });
    ReactTestRenderer.act(() => {
      getProps().setSelectedExerciseOption('CARDIO');
    });
    ReactTestRenderer.act(() => {
      getProps().onNextBtnPress();
    });
    ReactTestRenderer.act(() => {
      getProps().setPickerItems([cardioOption]);
      getProps().setPickerType('Exercise');
    });
    ReactTestRenderer.act(() => {
      getProps().onPickerItemSelect(1);
    });
    ReactTestRenderer.act(() => {
      getProps().onCardioAmountChange('1');
    });
    ReactTestRenderer.act(() => {
      getProps().setPickerItems([{id: 1, unit: 'Rp'}]);
      getProps().setPickerType('Unit');
    });
    ReactTestRenderer.act(() => {
      getProps().onPickerItemSelect(1);
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onAddCardioExe();
    });

    expect(getProps().cardioFieldErrors.unit).toBe(
      'Select a unit that matches the chosen exercise.',
    );
    expect(getProps().isPermissionModal).toBe(false);

    ReactTestRenderer.act(() => {
      getProps().onAddBtnPress();
    });
    ReactTestRenderer.act(() => {
      getProps().setSelectedExerciseOption('SUPERSET');
    });
    ReactTestRenderer.act(() => {
      getProps().onNextBtnPress();
    });

    ReactTestRenderer.act(() => {
      getProps().onSupersetModalBtnPress();
    });

    expect(getProps().supersetSetupFormErrorText).toBe(
      'Check the highlighted superset fields before continuing.',
    );
    expect(getProps().supersetSetupFieldErrors.numberOfExercises).toBe(
      'Select the number of exercises.',
    );

    ReactTestRenderer.act(() => {
      getProps().setPickerItems([{id: 1, value: '2'}]);
      getProps().setPickerType('Number of Exercises');
    });
    ReactTestRenderer.act(() => {
      getProps().onPickerItemSelect(1);
    });
    ReactTestRenderer.act(() => {
      getProps().setPickerItems([{id: 1, value: '3'}]);
      getProps().setPickerType('Sets');
    });
    ReactTestRenderer.act(() => {
      getProps().onPickerItemSelect(1);
    });
    ReactTestRenderer.act(() => {
      getProps().onSupersetModalBtnPress();
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onAddSupersetExercises();
    });

    expect(getProps().supersetFieldErrors[0].exercise).toBe(
      'Select an exercise.',
    );
    expect(getProps().supersetItemsFormErrorText).toBe(
      'Check the highlighted superset exercise fields before saving.',
    );
  });
});
