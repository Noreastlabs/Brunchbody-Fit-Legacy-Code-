import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {TouchableOpacity} from 'react-native';

jest.mock('react-native-vector-icons/AntDesign', () => 'AntDesign');
jest.mock('react-native-vector-icons/Entypo', () => 'Entypo');
jest.mock('react-native-vector-icons/Feather', () => 'Feather');
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-responsive-fontsize', () => ({
  RFValue: value => value,
}));
jest.mock('react-native-paper', () => {
  const ReactLocal = require('react');

  return {
    IconButton: props => ReactLocal.createElement('mock-icon-button', props),
  };
});
jest.mock('../src/resources', () => ({
  __esModule: true,
  colors: {
    background: 'background',
    black: 'black',
    blackTransparent: 'blackTransparent',
    dullGrey: 'dullGrey',
    grey: 'grey',
    icon: 'icon',
    lightestGrey: 'lightestGrey',
    mainFont: 'mainFont',
    nonEditableOverlays: 'nonEditableOverlays',
    red: 'red',
    searchBarBackground: 'searchBarBackground',
    secondary: 'secondary',
    textGrey: 'textGrey',
    white: 'white',
  },
  images: {
    arrow: 1,
  },
}));

import AddButton from '../src/components/AddButton/AddButton';
import CloseButton from '../src/components/CloseButton/CloseButton';
import CustomOptions from '../src/components/CustomOptions/CustomOptions';
import SearchBar from '../src/components/SearchBar/SearchBar';
import SelectComp from '../src/components/SelectComp/SelectComp';
import BackButton from '../src/screens/completeProfile/components/BackButton';
import CloseIcon from '../src/screens/calendar/components/CloseIcon';
import AddIcon from '../src/screens/writing/components/AddIcon';

const render = element => {
  let renderer;

  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(element);
  });

  return renderer;
};

describe('form accessibility control boundary', () => {
  test('shared icon buttons expose backward-compatible default labels', () => {
    const closeButton = render(<CloseButton onPress={jest.fn()} />)
      .root.findByType(TouchableOpacity);
    const addButton = render(<AddButton onPress={jest.fn()} />)
      .root.findByType(TouchableOpacity);

    expect(closeButton.props.accessibilityRole).toBe('button');
    expect(closeButton.props.accessibilityLabel).toBe('Close');
    expect(addButton.props.accessibilityRole).toBe('button');
    expect(addButton.props.accessibilityLabel).toBe('Add');
  });

  test('shared icon buttons allow caller-specific accessible action names', () => {
    const addButton = render(
      <AddButton
        accessibilityHint="Adds this row"
        accessibilityLabel="Add calories out"
        onPress={jest.fn()}
      />,
    ).root.findByType(TouchableOpacity);

    expect(addButton.props.accessibilityLabel).toBe('Add calories out');
    expect(addButton.props.accessibilityHint).toBe('Adds this row');
  });

  test('non-close shared close-button callers keep action-specific labels', () => {
    const searchRenderer = render(
      <SearchBar value="meal" onChangeText={jest.fn()} />,
    );
    const optionsRenderer = render(
      <CustomOptions
        data={[{id: 'focus', name: 'Focus', color: 'green'}]}
        isRemove
        onRemove={jest.fn()}
      />,
    );

    expect(searchRenderer.root.findByType(CloseButton).props.accessibilityLabel)
      .toBe('Clear search');
    expect(
      optionsRenderer.root.findByType(CloseButton).props.accessibilityLabel,
    ).toBe('Remove Focus');
  });

  test('select trigger accessible labels are computed from visible text', () => {
    const selectButton = render(
      <SelectComp
        accessibilityHint="Opens available units"
        onPress={jest.fn()}
        title="Unit"
        type="Pounds"
      />,
    ).root.findByType(TouchableOpacity);

    expect(selectButton.props.accessibilityRole).toBe('button');
    expect(selectButton.props.accessibilityLabel).toBe('Unit, Pounds');
    expect(selectButton.props.accessibilityHint).toBe('Opens available units');
  });

  test('complete profile back icon exposes label and disabled state', () => {
    const backButton = render(
      <BackButton
        currentScreen={jest.fn()}
        disabled
        previousScreen="Name"
      />,
    ).root.findByType(TouchableOpacity);

    expect(backButton.props.accessibilityRole).toBe('button');
    expect(backButton.props.accessibilityLabel).toBe('Back');
    expect(backButton.props.accessibilityState).toEqual({disabled: true});
  });

  test('calendar and writing icon wrappers pass explicit labels to IconButton', () => {
    const closeIcon = render(<CloseIcon onPress={jest.fn()} />)
      .root.findByType('mock-icon-button');
    const addIcon = render(<AddIcon onPress={jest.fn()} />)
      .root.findByType('mock-icon-button');

    expect(closeIcon.props.accessibilityRole).toBe('button');
    expect(closeIcon.props.accessibilityLabel).toBe('Close');
    expect(addIcon.props.accessibilityRole).toBe('button');
    expect(addIcon.props.accessibilityLabel).toBe('Add itinerary item');
  });
});
