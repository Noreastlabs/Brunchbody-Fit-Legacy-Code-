import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { colors } from '../../../../resources';
import { DailyEntry } from '../../components';
import {
  addJournalEntry,
  editJournalEntry,
  getJournalEntries,
} from '../../../../redux/actions';

const traitOptions = [
  {
    id: 1,
    title: 'Alert',
    bgColor: colors.red,
    isFavorite: true,
  },
  {
    id: 2,
    title: 'Confident',
    bgColor: colors.blue,
    isFavorite: true,
  },
  {
    id: 3,
    title: 'Creative',
    bgColor: colors.yellow,
    isFavorite: true,
  },
  {
    id: 4,
    title: 'Resourceful',
    bgColor: colors.greenish,
    isFavorite: true,
  },
];

const DEFAULT_FEELING_RATE = 1;
const DEFAULT_TRAIT_COLOR = colors.darkBlue2;
const TRAIT_LIMIT = 4;
const FAVORITE_LIMIT = 8;

export default function DailyEntryPage(props) {
  const {
    route,
    navigation,
    onCreateEntry,
    getAllJournalEntries,
    onEditEntry,
  } = props;
  const entryData = route?.params?.entryData || {};
  const entryId = route?.params?.entryId;
  const traitFromDirectory = route?.params?.trait;
  const openCreateTrait = route?.params?.openCreateTrait;
  const entryDate = entryData.date || moment().format('YYYY/MM/DD');
  const savePendingRef = useRef(false);
  const selectTraitPendingRef = useRef(false);
  const addTraitPendingRef = useRef(false);
  const [loader, setLoader] = useState(false);
  const [feelingRate, setFeelingRate] = useState(
    entryData.feelingRate || DEFAULT_FEELING_RATE,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [createItemModal, setCreateItemModal] = useState(false);
  const [colorPickerModal, setColorPickerModal] = useState(false);
  const [color, setColor] = useState(DEFAULT_TRAIT_COLOR);
  const [addToFavorite, setAddToFavorite] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [selectedTraits, setSelectedTraits] = useState(entryData.traits || []);
  const [entryName, setEntryName] = useState(
    moment(entryDate, 'YYYY/MM/DD').format('M/DD/YYYY'),
  );
  const [task, setTask] = useState(entryData.task || '');
  const [thought, setThought] = useState(entryData.thought || '');
  const [newTrait, setNewTrait] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState({});
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [check, setCheck] = useState('');
  const [traits, setTraits] = useState(traitOptions);
  const [traitErrorText, setTraitErrorText] = useState('');
  const [createTraitErrorText, setCreateTraitErrorText] = useState('');
  const [saveErrorText, setSaveErrorText] = useState('');
  const [selectTraitPending, setSelectTraitPending] = useState(false);
  const [addTraitPending, setAddTraitPending] = useState(false);

  useEffect(() => {
    if (traitFromDirectory) {
      setColor(DEFAULT_TRAIT_COLOR);
      setAddToFavorite(false);
      setNewTrait(traitFromDirectory);
      setCreateItemModal(true);
      setIsVisible(false);
      setIsRemove(false);
      setSelectedOption({});
      setDisabled(true);
      setColorPickerModal(false);
      setTraitErrorText('');
      setCreateTraitErrorText('');
      if ((openCreateTrait || traitFromDirectory) &&
          typeof navigation.setParams === 'function') {
        navigation.setParams({
          trait: undefined,
          openCreateTrait: undefined,
        });
      }
    }
  }, [navigation, openCreateTrait, traitFromDirectory]);

  useEffect(() => {
    if (!isVisible) {
      selectTraitPendingRef.current = false;
      setSelectTraitPending(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!createItemModal) {
      addTraitPendingRef.current = false;
      setAddTraitPending(false);
    }
  }, [createItemModal]);

  const clearAlert = () => {
    setAlertHeading('');
    setAlertText('');
  };

  const clearCreateTraitDraft = () => {
    setNewTrait('');
    setColor(DEFAULT_TRAIT_COLOR);
    setAddToFavorite(false);
    setCreateTraitErrorText('');
    setColorPickerModal(false);
  };

  const closeCreateTraitModal = () => {
    setCreateItemModal(false);
    clearCreateTraitDraft();
  };

  const closeTraitSelectModal = () => {
    setIsVisible(false);
    setIsRemove(false);
    setSelectedOption({});
    setDisabled(true);
    setTraitErrorText('');
  };

  const closePermissionModal = () => {
    setPermissionModal(false);
    setCheck('');
    clearAlert();
  };

  const showMessage = (heading, text) => {
    setAlertHeading(heading);
    setAlertText(text);
    setPermissionModal(true);
  };

  const openClearEntryConfirmation = () => {
    setAlertHeading('Clear Entry');
    setAlertText('Clear this daily entry form?');
    setCheck('clearEntry');
    setPermissionModal(true);
  };

  const openRemoveTraitConfirmation = item => {
    setSelectedOption(item);
    setAlertHeading('Remove Trait');
    setAlertText(`Remove ${item.title} from this entry?`);
    setCheck('removeTrait');
    setPermissionModal(true);
  };

  const onDonePermissionModal = () => {
    setPermissionModal(false);
    if (check === 'clearEntry') {
      setTask('');
      setThought('');
      setSelectedTraits([]);
      setFeelingRate(DEFAULT_FEELING_RATE);
      clearCreateTraitDraft();
      setTraitErrorText('');
      setSaveErrorText('');
      setSelectedOption({});
      setDisabled(true);
      setCheck('');
      clearAlert();
    } else if (check === 'removeTrait') {
      setSelectedTraits(prev =>
        prev.filter(item => item.id !== selectedOption.id),
      );
      setTraitErrorText('');
      setSaveErrorText('');
      setSelectedOption({});
      setCheck('');
      clearAlert();
    } else {
      if (alertHeading === 'Success!') {
        navigation.goBack();
      }
      clearAlert();
    }
  };

  const onTraitSelect = () => {
    if (selectTraitPendingRef.current) {
      return;
    }

    if (!selectedOption.id) {
      setTraitErrorText('Select a favorite trait to continue.');
      return;
    }

    if (selectedTraits.length >= TRAIT_LIMIT) {
      setTraitErrorText(`You can't select traits more than 4.`);
      return;
    }

    selectTraitPendingRef.current = true;
    setSelectTraitPending(true);
    setSelectedTraits(prev => [...prev, selectedOption]);
    setTraitErrorText('');
    setSaveErrorText('');
    closeTraitSelectModal();
  };

  const onAddTrait = async () => {
    if (addTraitPendingRef.current) {
      return;
    }

    const trimmedTrait = newTrait.trim();
    const favoriteCount = traits.filter(item => item.isFavorite).length;

    if (!trimmedTrait) {
      setCreateTraitErrorText('Enter a trait name before creating it.');
      return;
    }

    if (selectedTraits.length >= TRAIT_LIMIT) {
      setCreateTraitErrorText(`You can't select traits more than 4.`);
      setTraitErrorText(`You can't select traits more than 4.`);
      return;
    }

    if (addToFavorite && favoriteCount >= FAVORITE_LIMIT) {
      setCreateTraitErrorText('8 favorites max.');
      return;
    }

    addTraitPendingRef.current = true;
    setAddTraitPending(true);
    const data = {
      id: traits.length + 1,
      title: trimmedTrait,
      bgColor: color,
      isFavorite: addToFavorite,
    };

    setTraits(prev => [...prev, data]);
    setSelectedTraits(prev => [...prev, data]);
    setTraitErrorText('');
    setSaveErrorText('');
    setIsVisible(false);
    closeCreateTraitModal();
  };

  const onRemoveTrait = async id => {
    const traitArray = [...traits];
    const index = traitArray.findIndex(x => x.id === id);
    traitArray.splice(index, 1);
    setTraits(traitArray);
  };

  const onSaveHandler = async () => {
    if (savePendingRef.current) {
      return;
    }

    savePendingRef.current = true;
    setLoader(true);
    let response = null;
    // Replace slashes with dashes for consistent date parsing
    const d = new Date(entryDate.replace(/\//g, '-'));
    d.setHours(0, 0, 0, 0);

    if (d.getTime() > new Date().getTime()) {
      setSaveErrorText('You cannot enter data on future dates.');
      setLoader(false);
      savePendingRef.current = false;
      return;
    }

    if (selectedTraits.length < 1) {
      setTraitErrorText('Please add atleast one trait.');
      setSaveErrorText('');
      setLoader(false);
      savePendingRef.current = false;
      return;
    }

    try {
      setTraitErrorText('');
      setSaveErrorText('');

      if (entryId) {
        response = await onEditEntry(entryId, {
          DailyEntry: {
            task,
            thought,
            traits: selectedTraits,
            feelingRate,
            isDeleted: false,
          },
        });
      } else {
        response = await onCreateEntry(d.getTime(), {
          DailyEntry: {
            task,
            thought,
            traits: selectedTraits,
            feelingRate,
            isDeleted: false,
          },
        });
      }

      if (response === true) {
        showMessage('Success!', 'Entry updated successfully.');
        await getAllJournalEntries(d.getTime());
      } else {
        showMessage('Error!', response || 'Failed to save entry.');
      }
    } catch (error) {
      console.error('Save error:', error);
      showMessage('Error!', 'An unexpected error occurred while saving.');
    } finally {
      setLoader(false);
      savePendingRef.current = false;
    }
  };

  return (
    <DailyEntry
      {...props}
      loader={loader}
      traitOptions={traits}
      feelingRate={feelingRate}
      setFeelingRate={setFeelingRate}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      createItemModal={createItemModal}
      setCreateItemModal={setCreateItemModal}
      colorPickerModal={colorPickerModal}
      setColorPickerModal={setColorPickerModal}
      color={color}
      setColor={setColor}
      addToFavorite={addToFavorite}
      setAddToFavorite={setAddToFavorite}
      isRemove={isRemove}
      setIsRemove={setIsRemove}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      entryName={entryName}
      setEntryName={setEntryName}
      task={task}
      setTask={text => {
        setTask(text);
        setSaveErrorText('');
      }}
      thought={thought}
      setThought={text => {
        setThought(text);
        setSaveErrorText('');
      }}
      onSaveHandler={onSaveHandler}
      newTrait={newTrait}
      setNewTrait={text => {
        setNewTrait(text);
        setCreateTraitErrorText('');
      }}
      disabled={disabled}
      setDisabled={setDisabled}
      onTraitSelect={onTraitSelect}
      onAddTrait={onAddTrait}
      onRemoveTrait={onRemoveTrait}
      selectedTraits={selectedTraits}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      onClosePermissionModal={closePermissionModal}
      onOpenCreateTraitModal={() => {
        setCreateTraitErrorText('');
        setCreateItemModal(true);
      }}
      onCloseCreateTraitModal={closeCreateTraitModal}
      onPromptClearEntry={openClearEntryConfirmation}
      onPromptRemoveTrait={openRemoveTraitConfirmation}
      onCloseTraitSelectModal={closeTraitSelectModal}
      onToggleFavorite={() => {
        setAddToFavorite(prev => !prev);
        setCreateTraitErrorText('');
      }}
      onTraitOptionSelect={option => {
        setSelectedOption(option);
        setDisabled(false);
        setTraitErrorText('');
      }}
      onSelectModalToggleRemove={() => {
        setIsRemove(prev => !prev);
        setTraitErrorText('');
      }}
      onOpenColorPicker={() => setColorPickerModal(true)}
      onCloseColorPicker={() => setColorPickerModal(false)}
      onChangeColor={selectedColor => {
        setColor(selectedColor);
        setCreateTraitErrorText('');
      }}
      traitErrorText={traitErrorText}
      createTraitErrorText={createTraitErrorText}
      saveErrorText={saveErrorText}
      selectTraitPending={selectTraitPending}
      addTraitPending={addTraitPending}
    />
  );
}

DailyEntryPage.defaultProps = {
  route: {},
};

DailyEntryPage.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  onCreateEntry: PropTypes.func.isRequired,
  getAllJournalEntries: PropTypes.func.isRequired,
  onEditEntry: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onCreateEntry: (date, data) => dispatch(addJournalEntry(date, data)),
  getAllJournalEntries: date => dispatch(getJournalEntries(date)),
  onEditEntry: (id, data) => dispatch(editJournalEntry(id, data)),
});

export const DailyEntryWrapper = connect(
  null,
  mapDispatchToProps,
)(DailyEntryPage);
