/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-expressions */
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import {RFValue} from 'react-native-responsive-fontsize';
import styles from './style';
import {
  CustomHeader,
  Button,
  CustomModal,
  DatePickerModal,
  HeightPickerModal,
  PermissionModal,
  SafeAreaWrapper,
} from '../../../../components';

export default function MyVitals(props) {
  const {
    isEnabled,
    toggleSwitch,
    datePickerModal,
    setDatePickerModal,
    heightPickerModal,
    setHeightPickerModal,
    date,
    month,
    year,
    isDateSelected,
    setIsDateSelected,
    feet,
    inches,
    isHeightSelected,
    setIsHeightSelected,
    setName,
    user,
    onUpdateHandler,
    loader,
    name,
    isPermissionModal,
    setIsPermissionModal,
    alertHeading,
    alertText,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>My Vitals</Text>
        </View>
        <View>
          <View style={styles.listView}>
            <Text style={styles.textStyle1}>Name</Text>
            <TouchableOpacity activeOpacity={0.5} style={styles.linkView}>
              <View style={{flex: 1}}>
                <TextInput
                  value={name}
                  onChangeText={text => setName(text)}
                  style={styles.TextInput}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={styles.listView}>
            <Text style={styles.textStyle1}>Date of Birth</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.linkView}
              onPress={() => setDatePickerModal(true)}>
              <View style={styles.TextView}>
                <Text style={styles.TextInput}>
                  {isDateSelected
                    ? `${month}/${date}/${year}`
                    : `${user?.dob.split('/')[1]}/${user?.dob.split('/')[0]}/${
                        user?.dob.split('/')[2]
                      }`}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={styles.listView}>
            <Text style={styles.textStyle1}>Gender</Text>
            <View activeOpacity={0.5} style={styles.linkView}>
              <View style={styles.genderStyle}>
                <TouchableOpacity
                  style={styles.genderSelectionStyle}
                  onPress={() => toggleSwitch('male')}>
                  <View
                    style={[
                      styles.radioOuterStyle,
                      {borderColor: !isEnabled ? '#56ccf2' : 'grey'},
                    ]}>
                    <View
                      style={[
                        styles.radioInnerStyle,
                        {backgroundColor: !isEnabled ? '#56ccf2' : null},
                      ]}
                    />
                  </View>
                  <View style={{marginHorizontal: 15}}>
                    <Text style={{color: 'white', fontSize: RFValue(20)}}>
                      M
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderSelectionStyle, {marginLeft: 20}]}
                  onPress={() => toggleSwitch('female')}>
                  <View
                    style={[
                      styles.radioOuterStyle,
                      {borderColor: isEnabled ? '#56ccf2' : 'grey'},
                    ]}>
                    <View
                      style={[
                        styles.radioInnerStyle,
                        {backgroundColor: isEnabled ? '#56ccf2' : null},
                      ]}
                    />
                  </View>
                  <View style={{marginHorizontal: 15}}>
                    <Text style={{color: 'white', fontSize: RFValue(20)}}>
                      F
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.listView}>
            <Text style={styles.textStyle1}>Height</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.linkView}
              onPress={() => setHeightPickerModal(true)}>
              <View style={styles.TextView}>
                <Text style={styles.TextInput}>
                  {isHeightSelected
                    ? `${feet}'${inches}''`
                    : `${user.height.split('.')[0]}'${
                        user.height.split('.')[1]
                      }''`}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{margin: 40}}>
          <Button loader={loader} title="Save" onPress={onUpdateHandler} />
        </View>
      </ScrollView>

      <CustomModal
        isVisible={datePickerModal}
        onDismiss={() => setDatePickerModal(false)}
        content={
          <DatePickerModal
            {...props}
            onConfirm={() => {
              setIsDateSelected(true);
              setDatePickerModal(false);
            }}
            onCancel={() => {
              setIsDateSelected(false);
              setDatePickerModal(false);
            }}
          />
        }
      />

      <CustomModal
        isVisible={heightPickerModal}
        onDismiss={() => setHeightPickerModal(false)}
        content={
          <HeightPickerModal
            {...props}
            onConfirm={() => {
              setIsHeightSelected(true);
              setHeightPickerModal(false);
            }}
            onCancel={() => {
              setIsHeightSelected(false);
              setHeightPickerModal(false);
            }}
          />
        }
      />

      <CustomModal
        isVisible={isPermissionModal}
        onDismiss={() => setIsPermissionModal(false)}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={() => setIsPermissionModal(false)}
            onCancel={() => setIsPermissionModal(false)}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

MyVitals.propTypes = {
  toggleSwitch: PropTypes.func.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  datePickerModal: PropTypes.bool.isRequired,
  setDatePickerModal: PropTypes.func.isRequired,
  heightPickerModal: PropTypes.bool.isRequired,
  setHeightPickerModal: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  isDateSelected: PropTypes.bool.isRequired,
  setIsDateSelected: PropTypes.func.isRequired,
  feet: PropTypes.number.isRequired,
  inches: PropTypes.number.isRequired,
  isHeightSelected: PropTypes.bool.isRequired,
  setIsHeightSelected: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  onUpdateHandler: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  isPermissionModal: PropTypes.bool.isRequired,
  setIsPermissionModal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
};
