import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {AddButton, CustomText} from '../../../components';
import styles from './style';

const createRoutineFields = [
  {
    id: 1,
    fieldName: 'Routine Name',
    placeholder: 'Enter Name',
  },
];

export default function MyRoutines(props) {
  const {
    myRoutines,
    setSelectedItem,
    setIsVisible,
    setHeading,
    setScreen,
    setBtnTitle,
    setCreateItemModal,
    setCreateItemFields,
    setSubText,
    setShowDeleteBtn,
    setProgram,
  } = props;

  return (
    <View style={styles.setMargin}>
      <Text style={styles.textStyle1}>My Routines</Text>
      {myRoutines.map(item => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.5}
          style={styles.setMargin2}
          onPress={() => {
            setIsVisible(true);
            setSelectedItem(item);
            setHeading(`My ${item.name}`);
            setBtnTitle('View');
            setScreen('RoutineManager');
            setShowDeleteBtn(true);
          }}>
          <CustomText text={item.name} />
        </TouchableOpacity>
      ))}
      <View style={styles.setMargin2}>
        <AddButton
          onPress={() => {
            setCreateItemModal(true);
            setHeading('Create Routine');
            setSubText('');
            setBtnTitle('Create');
            setProgram('Routine Program');
            setCreateItemFields(createRoutineFields);
          }}
        />
      </View>
    </View>
  );
}

MyRoutines.propTypes = {
  myRoutines: PropTypes.arrayOf(PropTypes.any).isRequired,
  setIsVisible: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setHeading: PropTypes.func.isRequired,
  setScreen: PropTypes.func.isRequired,
  setBtnTitle: PropTypes.func.isRequired,
  setCreateItemModal: PropTypes.func.isRequired,
  setCreateItemFields: PropTypes.func.isRequired,
  setSubText: PropTypes.func.isRequired,
  setShowDeleteBtn: PropTypes.func.isRequired,
  setProgram: PropTypes.func.isRequired,
};
