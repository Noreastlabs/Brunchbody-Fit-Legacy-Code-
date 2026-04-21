import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {AddButton, CustomText} from '../../../components';
import { RECREATION_ROUTES } from '../../../navigation/routeNames';
import styles from './style';

export default function MyRoutines(props) {
  const {
    myRoutines,
    setSelectedItem,
    setIsVisible,
    setHeading,
    setScreen,
    setBtnTitle,
    setShowDeleteBtn,
    openCreateRoutineModal,
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
            setScreen(RECREATION_ROUTES.ROUTINE_MANAGER);
            setShowDeleteBtn(true);
          }}>
          <CustomText text={item.name} />
        </TouchableOpacity>
      ))}
      <View style={styles.setMargin2}>
        <AddButton
          onPress={() => {
            openCreateRoutineModal();
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
  setShowDeleteBtn: PropTypes.func.isRequired,
  openCreateRoutineModal: PropTypes.func.isRequired,
};
