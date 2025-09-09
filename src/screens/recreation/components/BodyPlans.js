import PropTypes from 'prop-types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CustomText } from '../../../components';
import { colors } from '../../../resources';
import styles from './style';

export default function BodyPlans(props) {
  const {
    brunchBodyPlans,
    myPlans,
    setSelectedItem,
    setIsVisible,
    setHeading,
    setScreen,
    setBtnTitle,
    setSubText,
    setShowDeleteBtn,
    setProgram,
    setProgramMenuModal,
  } = props;

  return (
    <View style={styles.setMargin}>
      <View style={styles.flexRowView}>
        <View style={{flex: 0.2}} />
        <Text style={styles.textStyle1}>My Plans</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setProgramMenuModal(true)}>
          <MaterialIcons
            name="more-vert"
            size={RFValue(30)}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      {myPlans.map(item => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.5}
          style={styles.setMargin2}
          onPress={() => {
            setIsVisible(true);
            setSelectedItem(item);
            setHeading(item.name);
            setSubText('');
            setBtnTitle('Edit');
            setScreen('ProgramManager');
            setShowDeleteBtn(true);
            setProgram('Custom Program');
          }}>
          <CustomText text={item.name} />
        </TouchableOpacity>
      ))}

      <View style={styles.lineStyle} />

      <Text style={styles.textStyle1}>Brunch Body Plans</Text>

      {brunchBodyPlans
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.5}
            style={styles.setMargin2}
            onPress={() => {
              setIsVisible(true);
              setSelectedItem(item);
              setHeading(item.name);
              setSubText('');
              setBtnTitle('View');
              setScreen('ProgramManager');
              setShowDeleteBtn(false);
              setProgram('Brunch Program');
            }}>
            <CustomText text={item.name} />
          </TouchableOpacity>
        ))}
    </View>
  );
}

BodyPlans.propTypes = {
  brunchBodyPlans: PropTypes.arrayOf(PropTypes.any).isRequired,
  myPlans: PropTypes.arrayOf(PropTypes.any).isRequired,
  setIsVisible: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setHeading: PropTypes.func.isRequired,
  setScreen: PropTypes.func.isRequired,
  setBtnTitle: PropTypes.func.isRequired,
  setSubText: PropTypes.func.isRequired,
  setShowDeleteBtn: PropTypes.func.isRequired,
  setProgram: PropTypes.func.isRequired,
  setProgramMenuModal: PropTypes.func.isRequired,
};
