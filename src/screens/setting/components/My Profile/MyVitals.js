/* eslint-disable react/jsx-props-no-spreading */
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
import {colors, strings} from '../../../../resources';

const renderSupportingText = (text, style) => {
  if (!text) {
    return null;
  }

  return <Text style={style}>{text}</Text>;
};

export default function MyVitals(props) {
  const {
    datePickerModal,
    heightPickerModal,
    tempDate,
    setTempDate,
    tempMonth,
    setTempMonth,
    tempYear,
    setTempYear,
    tempFeet,
    setTempFeet,
    tempInches,
    setTempInches,
    draftDobText,
    draftHeightText,
    draftName,
    setDraftName,
    draftGender,
    onSelectGender,
    onOpenDatePicker,
    onConfirmDatePicker,
    onCancelDatePicker,
    onOpenHeightPicker,
    onConfirmHeightPicker,
    onCancelHeightPicker,
    dobErrorText,
    heightErrorText,
    formErrorText,
    onUpdateHandler,
    loader,
    isPermissionModal,
    closePermissionModal,
    alertHeading,
    alertText,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>Profile details</Text>
          <Text style={styles.headingText3}>Saved on this device only.</Text>
        </View>
        <View>
          <View style={styles.listView}>
            <Text style={styles.textStyle1}>Nickname (optional)</Text>
            <View style={styles.linkView}>
              <View style={{flex: 1}}>
                <TextInput
                  value={draftName}
                  onChangeText={text => setDraftName(text)}
                  style={styles.TextInput}
                  placeholder="Enter a nickname"
                  placeholderTextColor={colors.grey}
                />
              </View>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.listView}>
            <Text style={styles.textStyle1}>Date of Birth</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.linkView}
              onPress={onOpenDatePicker}>
              <View style={styles.TextView}>
                <Text style={styles.TextInput}>{draftDobText}</Text>
              </View>
            </TouchableOpacity>
            {renderSupportingText(
              strings.completeProfile.helperText.dob,
              [styles.supportingText, styles.supportingTextInfo],
            )}
            {renderSupportingText(
              dobErrorText,
              [styles.supportingText, styles.supportingTextError],
            )}
          </View>
        </View>
        <View>
          <View style={styles.listView}>
            <Text style={styles.textStyle1}>Gender</Text>
            <View style={styles.linkView}>
              <View style={styles.genderStyle}>
                <TouchableOpacity
                  style={styles.genderSelectionStyle}
                  onPress={() => onSelectGender('male')}>
                  <View
                    style={[
                      styles.radioOuterStyle,
                      {
                        borderColor:
                          draftGender === 'male' ? '#56ccf2' : colors.grey,
                      },
                    ]}>
                    <View
                      style={[
                        styles.radioInnerStyle,
                        {
                          backgroundColor:
                            draftGender === 'male' ? '#56ccf2' : null,
                        },
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
                  onPress={() => onSelectGender('female')}>
                  <View
                    style={[
                      styles.radioOuterStyle,
                      {
                        borderColor:
                          draftGender === 'female' ? '#56ccf2' : colors.grey,
                      },
                    ]}>
                    <View
                      style={[
                        styles.radioInnerStyle,
                        {
                          backgroundColor:
                            draftGender === 'female' ? '#56ccf2' : null,
                        },
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
            {renderSupportingText(
              strings.completeProfile.helperText.gender,
              [styles.supportingText, styles.supportingTextInfo],
            )}
          </View>
        </View>
        <View>
          <View style={styles.listView}>
            <Text style={styles.textStyle1}>Height</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.linkView}
              onPress={onOpenHeightPicker}>
              <View style={styles.TextView}>
                <Text style={styles.TextInput}>{draftHeightText}</Text>
              </View>
            </TouchableOpacity>
            {renderSupportingText(
              strings.completeProfile.helperText.height,
              [styles.supportingText, styles.supportingTextInfo],
            )}
            {renderSupportingText(
              heightErrorText,
              [styles.supportingText, styles.supportingTextError],
            )}
          </View>
        </View>

        <View style={{margin: 40}}>
          <Button loader={loader} title="Save" onPress={onUpdateHandler} />
          {renderSupportingText(
            formErrorText,
            [
              styles.supportingText,
              styles.supportingTextError,
              {textAlign: 'center'},
            ],
          )}
        </View>
      </ScrollView>

      <CustomModal
        isVisible={datePickerModal}
        onDismiss={onCancelDatePicker}
        content={
          <DatePickerModal
            date={tempDate}
            month={tempMonth}
            year={tempYear}
            setDate={setTempDate}
            setMonth={setTempMonth}
            setYear={setTempYear}
            onConfirm={onConfirmDatePicker}
            onCancel={onCancelDatePicker}
          />
        }
      />

      <CustomModal
        isVisible={heightPickerModal}
        onDismiss={onCancelHeightPicker}
        content={
          <HeightPickerModal
            feet={tempFeet}
            setFeet={setTempFeet}
            inches={tempInches}
            setInches={setTempInches}
            onConfirm={onConfirmHeightPicker}
            onCancel={onCancelHeightPicker}
          />
        }
      />

      <CustomModal
        isVisible={isPermissionModal}
        onDismiss={closePermissionModal}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={closePermissionModal}
            onCancel={closePermissionModal}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

MyVitals.propTypes = {
  datePickerModal: PropTypes.bool.isRequired,
  heightPickerModal: PropTypes.bool.isRequired,
  tempDate: PropTypes.number.isRequired,
  setTempDate: PropTypes.func.isRequired,
  tempMonth: PropTypes.number.isRequired,
  setTempMonth: PropTypes.func.isRequired,
  tempYear: PropTypes.number.isRequired,
  setTempYear: PropTypes.func.isRequired,
  tempFeet: PropTypes.number.isRequired,
  setTempFeet: PropTypes.func.isRequired,
  tempInches: PropTypes.number.isRequired,
  setTempInches: PropTypes.func.isRequired,
  draftDobText: PropTypes.string.isRequired,
  draftHeightText: PropTypes.string.isRequired,
  draftName: PropTypes.string.isRequired,
  setDraftName: PropTypes.func.isRequired,
  draftGender: PropTypes.string.isRequired,
  onSelectGender: PropTypes.func.isRequired,
  onOpenDatePicker: PropTypes.func.isRequired,
  onConfirmDatePicker: PropTypes.func.isRequired,
  onCancelDatePicker: PropTypes.func.isRequired,
  onOpenHeightPicker: PropTypes.func.isRequired,
  onConfirmHeightPicker: PropTypes.func.isRequired,
  onCancelHeightPicker: PropTypes.func.isRequired,
  dobErrorText: PropTypes.string.isRequired,
  heightErrorText: PropTypes.string.isRequired,
  formErrorText: PropTypes.string.isRequired,
  onUpdateHandler: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
  isPermissionModal: PropTypes.bool.isRequired,
  closePermissionModal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
};
