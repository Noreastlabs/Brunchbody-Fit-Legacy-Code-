import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const mockDispatch = jest.fn();
const mockUseNavigation = jest.fn();

jest.mock('react-redux', () => ({
  connect: () => Component => Component,
  useDispatch: () => mockDispatch,
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockUseNavigation(),
}));

jest.mock('../src/redux/actions', () => ({
  addJournalEntry: jest.fn(() => ({type: 'ADD_JOURNAL_ENTRY'})),
  editJournalEntry: jest.fn(() => ({type: 'EDIT_JOURNAL_ENTRY'})),
  getJournalEntries: jest.fn(() => ({type: 'GET_JOURNAL_ENTRIES'})),
  profile: jest.fn(data => ({type: 'PROFILE', payload: data})),
}));

jest.mock('../src/resources', () => ({
  __esModule: true,
  colors: {
    darkBlue2: 'darkBlue2',
    red: 'red',
    blue: 'blue',
    yellow: 'yellow',
    greenish: 'greenish',
    secondary: 'secondary',
    tertiary: 'tertiary',
    white: 'white',
    grey: 'grey',
    background: 'background',
    nonEditableOverlays: 'nonEditableOverlays',
    textGrey: 'textGrey',
    qccentError: 'qccentError',
    mainFont: 'mainFont',
  },
  strings: {
    weeklyEntry: {
      content1: 'Weekly Rating',
      content2: 'Communication',
      content3: 'Focus Thoughts',
      content4: 'Focus Rating',
      content5: 'Focus Actions',
      content6: 'Situations',
    },
    quarterlyEntry: {
      content1: 'Presence',
      content2: 'Projects',
      content3: 'Project Actions',
      content4: 'Subjects',
      content5: 'Subject Actions',
      content6: 'Clear Things',
      content7: 'Let Go',
      content8: 'Dietary',
      content9: 'Routine',
    },
  },
}));

jest.mock('react-native-vector-icons/AntDesign', () => 'AntDesign');
jest.mock('react-native-responsive-fontsize', () => ({
  RFValue: value => value,
}));

jest.mock('../src/components', () => {
  const ReactLocal = require('react');

  return {
    CustomHeader: props => ReactLocal.createElement('mock-custom-header', props),
    SearchBar: props => ReactLocal.createElement('mock-search-bar', props),
  };
});

jest.mock('../src/screens/journal/components', () => {
  const ReactLocal = require('react');

  return {
    DailyEntry: props =>
      ReactLocal.createElement('mock-journal-daily-entry', props),
    WeeklyEntry: props =>
      ReactLocal.createElement('mock-journal-weekly-entry', props),
    QuarterlyEntry: props =>
      ReactLocal.createElement('mock-journal-quarterly-entry', props),
    WeightLog: props =>
      ReactLocal.createElement('mock-journal-weight-log', props),
  };
});

import {JOURNAL_ROUTES} from '../src/navigation/routeNames';
import {profile} from '../src/redux/actions';
import DailyEntryPage from '../src/screens/journal/pages/DailyEntry/DailyEntry';
import WeeklyEntryPage from '../src/screens/journal/pages/WeeklyEntry/WeeklyEntry';
import QuarterlyEntryPage from '../src/screens/journal/pages/QuarterlyEntry/QuarterlyEntry';
import WeightLogPage from '../src/screens/journal/pages/WeightLog/WeightLog';
import TraitDirectory from '../src/screens/journal/components/TraitDirectory';

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

const getQuestionValue = (questions, state) =>
  questions.find(question => question.state === state)?.value;

describe('journal form UX boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TraitDirectory uses the minimal merged DailyEntry handoff', async () => {
    const navigate = jest.fn();
    mockUseNavigation.mockReturnValue({navigate});

    const renderer = await renderInAct(
      <TraitDirectory
        directoryList={[{id: 1, name: 'Calm'}]}
        search=""
        setSearch={jest.fn()}
      />,
    );

    const touchables = renderer.root.findAll(
      node =>
        typeof node.props.onPress === 'function' &&
        node.props.activeOpacity === 0.5,
    );

    ReactTestRenderer.act(() => {
      touchables[0].props.onPress();
    });

    expect(navigate).toHaveBeenCalledWith({
      name: JOURNAL_ROUTES.DAILY_ENTRY,
      params: {
        trait: 'Calm',
        openCreateTrait: true,
      },
      merge: true,
    });
  });

  test('DailyEntryPage keeps trait validation inline, resets modal state, and consumes one-shot directory params', async () => {
    const navigation = {
      goBack: jest.fn(),
      setParams: jest.fn(),
    };
    const props = {
      navigation,
      route: {
        params: {
          entryData: {
            date: '2024/01/01',
            traits: [{id: 1, title: 'Alert'}],
            feelingRate: 1,
            task: 'Task',
            thought: 'Thought',
          },
          trait: 'Calm',
          openCreateTrait: true,
        },
      },
      onCreateEntry: jest.fn().mockResolvedValue(true),
      getAllJournalEntries: jest.fn().mockResolvedValue(undefined),
      onEditEntry: jest.fn().mockResolvedValue(true),
    };

    const renderer = await renderInAct(<DailyEntryPage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-journal-daily-entry').props;

    expect(getProps().newTrait).toBe('Calm');
    expect(getProps().createItemModal).toBe(true);
    expect(navigation.setParams).toHaveBeenCalledWith({
      trait: undefined,
      openCreateTrait: undefined,
    });

    ReactTestRenderer.act(() => {
      getProps().onCloseCreateTraitModal();
    });

    expect(getProps().newTrait).toBe('');
    expect(getProps().color).toBe('darkBlue2');
    expect(getProps().addToFavorite).toBe(false);

    ReactTestRenderer.act(() => {
      getProps().onPromptRemoveTrait({id: 1, title: 'Alert'});
    });

    expect(getProps().alertHeading).toBe('Remove Trait');
    expect(getProps().alertText).toBe('Remove Alert from this entry?');

    ReactTestRenderer.act(() => {
      getProps().onClosePermissionModal();
    });

    expect(getProps().alertHeading).toBe('');
    expect(getProps().alertText).toBe('');

    ReactTestRenderer.act(() => {
      getProps().onPromptClearEntry();
    });

    expect(getProps().alertHeading).toBe('Clear Entry');
    expect(getProps().alertText).toBe('Clear this daily entry form?');

    ReactTestRenderer.act(() => {
      getProps().onDonePermissionModal();
    });

    expect(getProps().selectedTraits).toEqual([]);
    expect(getProps().newTrait).toBe('');
    expect(getProps().addToFavorite).toBe(false);

    await ReactTestRenderer.act(async () => {
      await getProps().onSaveHandler();
    });

    expect(getProps().traitErrorText).toBe('Please add atleast one trait.');
    expect(getProps().permissionModal).toBe(false);
  });

  test('DailyEntryPage counts favorites correctly and guards duplicate add/save actions', async () => {
    const saveDeferred = createDeferred();
    const props = {
      navigation: {
        goBack: jest.fn(),
        setParams: jest.fn(),
      },
      route: {
        params: {
          entryData: {
            date: '2024/01/01',
            traits: [],
            feelingRate: 1,
            task: '',
            thought: '',
          },
        },
      },
      onCreateEntry: jest.fn().mockImplementation(() => saveDeferred.promise),
      getAllJournalEntries: jest.fn().mockResolvedValue(undefined),
      onEditEntry: jest.fn().mockResolvedValue(true),
    };

    const renderer = await renderInAct(<DailyEntryPage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-journal-daily-entry').props;

    const addTrait = async title => {
      ReactTestRenderer.act(() => {
        getProps().onOpenCreateTraitModal();
        getProps().setNewTrait(title);
      });

      await ReactTestRenderer.act(async () => {
        await getProps().onAddTrait();
      });
    };

    await addTrait('Trait 1');
    await addTrait('Trait 2');
    await addTrait('Trait 3');
    await addTrait('Trait 4');

    expect(getProps().traitOptions).toHaveLength(8);

    ReactTestRenderer.act(() => {
      getProps().onPromptClearEntry();
    });

    ReactTestRenderer.act(() => {
      getProps().onDonePermissionModal();
    });

    expect(getProps().selectedTraits).toHaveLength(0);

    ReactTestRenderer.act(() => {
      getProps().onOpenCreateTraitModal();
      getProps().setNewTrait('Bonus Favorite');
      getProps().onToggleFavorite();
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onAddTrait();
    });

    expect(
      getProps().traitOptions.filter(item => item.isFavorite),
    ).toHaveLength(5);
    expect(getProps().createTraitErrorText).toBe('');

    ReactTestRenderer.act(() => {
      getProps().onOpenCreateTraitModal();
      getProps().setNewTrait('No Double');
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onAddTrait();
      const second = getProps().onAddTrait();

      await first;
      await second;
    });

    expect(
      getProps().traitOptions.filter(item => item.title === 'No Double'),
    ).toHaveLength(1);

    await ReactTestRenderer.act(async () => {
      const first = getProps().onSaveHandler();
      const second = getProps().onSaveHandler();

      expect(props.onCreateEntry).toHaveBeenCalledTimes(1);
      saveDeferred.resolve(true);
      await first;
      await second;
    });

    expect(props.getAllJournalEntries).toHaveBeenCalledTimes(1);
  });

  test('WeeklyEntryPage rehydrates derived questions on focus and clears local state', async () => {
    let focusHandler = () => {};
    const navigation = {
      addListener: jest.fn((event, callback) => {
        focusHandler = callback;
        return jest.fn();
      }),
      goBack: jest.fn(),
    };
    const props = {
      navigation,
      route: {
        params: {
          entryData: {
            date: '2024/01/01',
            effectiveness: 2,
            communicationThoughts: 'Communicate',
            focusThoughts: 'Focus',
            focus: 4,
            focusActions: 'Act',
            newSitutionThoughts: 'Resolve',
          },
        },
      },
      onCreateEntry: jest.fn().mockResolvedValue(true),
      getAllJournalEntries: jest.fn().mockResolvedValue(undefined),
      onEditEntry: jest.fn().mockResolvedValue(true),
    };

    const renderer = await renderInAct(<WeeklyEntryPage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-journal-weekly-entry').props;

    expect(
      getQuestionValue(getProps().questions, 'communicationThoughts'),
    ).toBe('Communicate');

    ReactTestRenderer.act(() => {
      getProps().onChangeText('Changed', 'communicationThoughts');
    });

    expect(
      getQuestionValue(getProps().questions, 'communicationThoughts'),
    ).toBe('Changed');

    props.route.params.entryData = {
      date: '2024/01/08',
      effectiveness: 7,
      communicationThoughts: 'Fresh',
      focusThoughts: 'Sharper',
      focus: 9,
      focusActions: 'Retry',
      newSitutionThoughts: 'Resolved',
    };

    ReactTestRenderer.act(() => {
      focusHandler();
    });

    expect(getProps().entryName).toBe('1/08/2024');
    expect(getProps().effectiveness).toBe(7);
    expect(getProps().focusRating).toBe(9);
    expect(getQuestionValue(getProps().questions, 'communicationThoughts')).toBe(
      'Fresh',
    );
    expect(getQuestionValue(getProps().questions, 'focusThoughts')).toBe(
      'Sharper',
    );

    ReactTestRenderer.act(() => {
      getProps().onPromptClearEntry();
    });

    ReactTestRenderer.act(() => {
      getProps().onDonePermissionModal();
    });

    expect(getProps().effectiveness).toBe(1);
    expect(getProps().focusRating).toBe(1);
    expect(
      getQuestionValue(getProps().questions, 'communicationThoughts'),
    ).toBe('');
    expect(getQuestionValue(getProps().questions, 'focusActions')).toBe('');
  });

  test('QuarterlyEntryPage rehydrates derived questions on focus and clears local state', async () => {
    let focusHandler = () => {};
    const navigation = {
      addListener: jest.fn((event, callback) => {
        focusHandler = callback;
        return jest.fn();
      }),
      goBack: jest.fn(),
    };
    const props = {
      navigation,
      route: {
        params: {
          entryData: {
            date: '2024/01/01',
            presenceThoughts: 'Present',
            personalProjectThoughts: 'Project',
            personalProjectActions: 'Ship',
            subjectToLearnThoughts: 'Learn',
            subjectToLearnActions: 'Study',
            clearThingsThoughts: 'Clear',
            letGoThoughts: 'Release',
            dietaryExpectionsThoughts: 'Macros',
            routineThoughts: 'Routine',
          },
        },
      },
      onCreateEntry: jest.fn().mockResolvedValue(true),
      getAllJournalEntries: jest.fn().mockResolvedValue(undefined),
      onEditEntry: jest.fn().mockResolvedValue(true),
    };

    const renderer = await renderInAct(<QuarterlyEntryPage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-journal-quarterly-entry').props;

    ReactTestRenderer.act(() => {
      getProps().onChangeText('Changed', 'presenceThoughts');
    });

    expect(getQuestionValue(getProps().questions, 'presenceThoughts')).toBe(
      'Changed',
    );

    props.route.params.entryData = {
      date: '2024/04/01',
      presenceThoughts: 'Rehydrated',
      personalProjectThoughts: 'New Project',
      personalProjectActions: 'Plan',
      subjectToLearnThoughts: 'Topic',
      subjectToLearnActions: 'Practice',
      clearThingsThoughts: 'Clarify',
      letGoThoughts: 'Let Go',
      dietaryExpectionsThoughts: 'Nutrition',
      routineThoughts: 'Habits',
    };

    ReactTestRenderer.act(() => {
      focusHandler();
    });

    expect(getProps().entryName).toBe('4/01/2024');
    expect(getQuestionValue(getProps().questions, 'presenceThoughts')).toBe(
      'Rehydrated',
    );
    expect(
      getQuestionValue(getProps().questions, 'personalProjectActions'),
    ).toBe('Plan');

    ReactTestRenderer.act(() => {
      getProps().onPromptClearEntry();
    });

    ReactTestRenderer.act(() => {
      getProps().onDonePermissionModal();
    });

    expect(getQuestionValue(getProps().questions, 'presenceThoughts')).toBe('');
    expect(getQuestionValue(getProps().questions, 'routineThoughts')).toBe('');
  });

  test('WeightLogPage keeps required-weight feedback inline and only profiles after a successful guarded save', async () => {
    const saveDeferred = createDeferred();
    const props = {
      navigation: {goBack: jest.fn()},
      route: {
        params: {
          entryData: {
            date: '2024/01/01',
            weight: '',
            note: '',
          },
        },
      },
      onCreateEntry: jest.fn().mockImplementation(() => saveDeferred.promise),
      getAllJournalEntries: jest.fn().mockResolvedValue(undefined),
      onEditEntry: jest.fn().mockResolvedValue(true),
    };

    const renderer = await renderInAct(<WeightLogPage {...props} />);
    const getProps = () =>
      renderer.root.findByType('mock-journal-weight-log').props;

    await ReactTestRenderer.act(async () => {
      await getProps().onSaveHandler();
    });

    expect(getProps().weightErrorText).toBe('Weight is required.');
    expect(getProps().permissionModal).toBe(false);

    ReactTestRenderer.act(() => {
      getProps().setWeight('180');
    });

    await ReactTestRenderer.act(async () => {
      const first = getProps().onSaveHandler();
      const second = getProps().onSaveHandler();

      expect(props.onCreateEntry).toHaveBeenCalledTimes(1);
      expect(mockDispatch).not.toHaveBeenCalled();
      saveDeferred.resolve(true);
      await first;
      await second;
    });

    expect(profile).toHaveBeenCalledWith({weight: '180'});
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
