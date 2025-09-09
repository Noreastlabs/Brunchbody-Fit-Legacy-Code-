/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
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

export default function DailyEntryPage(props) {
  const {
    route,
    navigation,
    onCreateEntry,
    getAllJournalEntries,
    onEditEntry,
  } = props;
  const traitFromDirectory = route?.params?.trait;
  const { entryData, entryId } = route.params;
  const [loader, setLoader] = useState(false);
  const [feelingRate, setFeelingRate] = useState(entryData.feelingRate || 1);
  const [isVisible, setIsVisible] = useState(false);
  const [createItemModal, setCreateItemModal] = useState(false);
  const [colorPickerModal, setColorPickerModal] = useState(false);
  const [color, setColor] = useState(colors.darkBlue2);
  const [addToFavorite, setAddToFavorite] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [selectedTraits, setSelectedTraits] = useState(entryData.traits || []);
  const [entryName, setEntryName] = useState(
    moment(entryData.date, 'YYYY/MM/DD').format('M/DD/YYYY'),
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

  useEffect(() => {
    if (traitFromDirectory) {
      setNewTrait(traitFromDirectory);
    }
  }, [traitFromDirectory]);

  const showMessage = (heading, text) => {
    setAlertHeading(heading);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onDonePermissionModal = () => {
    setPermissionModal(false);
    if (check === 'clearEntry') {
      setTask('');
      setThought('');
      setSelectedTraits([]);
      setFeelingRate(1);
      setCheck('');
    } else if (check === 'removeTrait') {
      const temp = [...selectedTraits];
      const index = temp.findIndex(x => x.id === selectedOption.id);
      temp.splice(index, 1);
      setSelectedTraits(temp);
      setCheck('');
    } else {
      if (alertHeading === 'Success!') {
        navigation.goBack();
      }
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    }
  };

  const onTraitSelect = () => {
    if (selectedTraits.length < 4) selectedTraits.push(selectedOption);
    else showMessage('Error!', `You can't select traits more than 4.`);

    setIsVisible(false);
    setIsRemove(false);
    setSelectedOption({});
    setDisabled(true);
  };

  const onAddTrait = async () => {
    const data = {
      id: traits.length + 1,
      title: newTrait,
      bgColor: color,
      isFavorite: addToFavorite,
    };

    if (selectedTraits.length === 4) {
      showMessage('Error!', `You can't select traits more than 4.`);
    } else if (addToFavorite && traits.length === 8) {
      showMessage('Error!', `8 favorites max.`);
    } else {
      traits.push(data);
      selectedTraits.push(data);
      setNewTrait('');
      setIsVisible(false);
      setCreateItemModal(false);
    }
  };

  const onRemoveTrait = async id => {
    const traitArray = [...traits];
    const index = traitArray.findIndex(x => x.id === id);
    traitArray.splice(index, 1);
    setTraits(traitArray);
  };

  const onSaveHandler = async () => {
    setLoader(true);
    let response = null;
    // Replace slashes with dashes for consistent date parsing
    const d = new Date(entryData.date.replace(/\//g, '-'));
    console.log(d.toString(), 'fiuasdfiasdgfjasgdf', entryData.date);
    d.setHours(0, 0, 0, 0);

    if (d.getTime() > new Date().getTime()) {
      showMessage('Error!', 'You cannot enter data on future dates.');
    } else if (selectedTraits.length < 1) {
      showMessage('Error!', 'Please add atleast one trait.');
    } else {
      if (entryId) {
        response = await onEditEntry(entryId, {
          DailyEntry: {
            // entryDate: d.getTime(),
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
            // entryDate: d.getTime(),
            task,
            thought,
            traits: selectedTraits,
            feelingRate,
            isDeleted: false,
          },
        });
      }

      if (response === true) {
        setLoader(false);
        showMessage('Success!', 'Entry updated successfully.');
        await getAllJournalEntries(d.getTime());
      } else {
        showMessage('Error!', response);
      }
    }

    setLoader(false);
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
      setTask={setTask}
      thought={thought}
      setThought={setThought}
      onSaveHandler={onSaveHandler}
      newTrait={newTrait}
      setNewTrait={setNewTrait}
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
      setCheck={setCheck}
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
