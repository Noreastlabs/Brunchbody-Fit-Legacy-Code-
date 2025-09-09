import React from 'react';
import {View, Text, ScrollView, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {
  CustomHeader,
  SelectComp,
  Button,
  Dashed,
  TextButton,
  CustomModal,
  WheelPickerContent,
  PermissionModal,
  SafeAreaWrapper,
} from '../../../components';
import styles from './style';
import {colors, wheelPickerItems} from '../../../resources';

export default function MealDetail(props) {
  const {
    route,
    fat,
    prt,
    cho,
    cal,
    unit,
    loader,
    amount,
    setUnit,
    setAmount,
    wheelPickerModal,
    setWheelPickerModal,
    permissionModal,
    setPermissionModal,
    onCalculateHandler,
    onDonePermissionModal,
    onAddMeal,
    alertHeading,
    alertText,
    quantity,
    // itemUnit,
  } = props;
  const {meal} = route.params;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.headingText2}>{meal.name}</Text>
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.subHeading}>Amount</Text>
          <TextInput
            value={amount}
            placeholder="Amount"
            placeholderTextColor={colors.grey}
            style={styles.textInputStyle}
            keyboardType="decimal-pad"
            onChangeText={text => setAmount(text)}
          />
          <SelectComp
            title="Select Unit"
            type={unit || 'Unit'}
            onPress={() => setWheelPickerModal(true)}
            style={styles.selectCompStyle}
          />
        </View>

        <View style={styles.btnView}>
          <Button
            title="Calculate"
            onPress={onCalculateHandler}
            style={styles.btnStyle}
            titleStyle={styles.btnTitle}
          />
        </View>

        <View style={styles.setMargin1}>
          <Dashed />
        </View>

        <View style={styles.tableContainer}>
          <Text style={styles.subHeading3}>{meal.name}</Text>
          <View style={styles.flexRowView}>
            <View style={{marginRight: 25}}>
              <Text style={styles.subHeading3}>QTY</Text>
              <Text style={styles.miniText}>
                {Math.round(quantity * 100) / 100}
              </Text>
            </View>
            <View>
              <Text style={styles.subHeading3}>UNT</Text>
              {/* <Text style={styles.miniText}>{itemUnit}</Text> */}
              <Text style={styles.miniText}>{unit}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableContent}>
            <Text style={styles.itemText}>FAT</Text>
            <Text style={styles.itemText2}>{Math.round(fat * 100) / 100}</Text>
          </View>
          <View style={styles.tableContent}>
            <Text style={styles.itemText}>PRT</Text>
            <Text style={styles.itemText2}>{Math.round(prt * 100) / 100}</Text>
          </View>
          <View style={styles.tableContent}>
            <Text style={styles.itemText}>CHO</Text>
            <Text style={styles.itemText2}>{Math.round(cho * 100) / 100}</Text>
          </View>
          <View style={styles.tableContent}>
            <Text style={styles.itemText}>CAL</Text>
            <Text style={styles.itemText2}>{Math.round(cal * 100) / 100}</Text>
          </View>
        </View>

        <View style={styles.btnView}>
          <Button title="Add to Meal" loader={loader} onPress={onAddMeal} />
        </View>

        <View style={styles.bottomTextView}>
          <TextButton title="Clear" onPress={() => setPermissionModal(true)} />
        </View>
      </ScrollView>

      <CustomModal
        isVisible={wheelPickerModal}
        onDismiss={() => setWheelPickerModal(false)}
        content={
          <WheelPickerContent
            pickerItems={wheelPickerItems.mealUnits}
            onValueChange={index =>
              setUnit(wheelPickerItems.mealUnits[index - 1].value)
            }
            onConfirm={() => setWheelPickerModal(false)}
            onCancel={() => setWheelPickerModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => setPermissionModal(false)}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDonePermissionModal}
            onCancel={() => setPermissionModal(false)}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

MealDetail.defaultProps = {
  route: {},
};

MealDetail.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  loader: PropTypes.bool.isRequired,
  fat: PropTypes.string.isRequired,
  prt: PropTypes.string.isRequired,
  cho: PropTypes.string.isRequired,
  cal: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  setAmount: PropTypes.func.isRequired,
  unit: PropTypes.string.isRequired,
  setUnit: PropTypes.func.isRequired,
  wheelPickerModal: PropTypes.bool.isRequired,
  setWheelPickerModal: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  onCalculateHandler: PropTypes.func.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  onAddMeal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  quantity: PropTypes.string.isRequired,
  // itemUnit: PropTypes.string.isRequired,
};
