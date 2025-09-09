import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AddButton, CustomText } from '../../../components';
import styles from './style';
import moment from 'moment';

export default function MyWorkout(props) {
  const {
    myWorkout,
    onSelectWorkout,
    // setIsVisible,
    setHeading,
    setScreen,
    setBtnTitle,
    setSubText,
    setWorkoutModal,
    setDatePickerModal,
    setShowDeleteBtn,
    date,
    month,
    year,
    isDateSelected,
    incrementDate,
    decrementDate,
    getWeekOrDays,
  } = props;

  const newDate = moment({ year, month: month - 1, day: date }).toDate();

  return (
    <View style={styles.setMargin}>
      <Text style={styles.textStyle1}>Daily Reminder</Text>
      <Text style={styles.textStyle2}>DON&apos;T FORGET TO STRETCH</Text>

      <View style={styles.dateView}>
        <TouchableOpacity activeOpacity={0.5} onPress={decrementDate}>
          <MaterialIcons
            name="keyboard-arrow-left"
            size={30}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setDatePickerModal(true);
          }}
        >
          <Text style={styles.dateText}>
            {isDateSelected
              ? `${month}/${date}/${year}`
              : `${
                  new Date().getMonth() + 1
                }/${new Date().getDate()}/${new Date().getFullYear()}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={incrementDate}>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={30}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={myWorkout}
        scrollEnabled={false}
        keyExtractor={item =>
          item.id?.toString() || `${item.name}-${item.createdAt}`
        }
        renderItem={({ item }) => {
          const dayVal = Number(item.day) > 0 ? Number(item.day) : 1;
          return (
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.textView}
              onPress={() => {
                setScreen('');
                setBtnTitle('View');
                setHeading(item.name);
                setShowDeleteBtn(true);
                onSelectWorkout(item);
                setSubText(
                  `Week ${
                    parseInt(item.week, 10) +
                    getWeekOrDays(
                      new Date(item.createdAt),
                      new Date(
                        newDate.getFullYear(),
                        newDate.getMonth(),
                        newDate.getDate(),
                      ),
                      true,
                      parseInt(item.day, 10),
                    )
                  } Day ${getWeekOrDays(
                    new Date(item.createdAt),
                    new Date(
                      newDate.getFullYear(),
                      newDate.getMonth(),
                      newDate.getDate(),
                    ),
                    false,
                    dayVal,
                  )}`,
                );
              }}
            >
              <CustomText text={item.name} style={styles.setMargin3} />
              <CustomText
                text={
                  parseInt(item.week, 10) +
                  getWeekOrDays(
                    new Date(item.createdAt),
                    new Date(
                      newDate.getFullYear(),
                      newDate.getMonth(),
                      newDate.getDate(),
                    ),
                    true,
                    parseInt(item.day, 10),
                  )
                }
                style={styles.customTextStyle}
              />
              <CustomText
                text={getWeekOrDays(
                  new Date(item.createdAt),
                  new Date(
                    newDate.getFullYear(),
                    newDate.getMonth(),
                    newDate.getDate(),
                  ),
                  false,
                  dayVal,
                )}
                style={styles.customTextStyle}
              />
            </TouchableOpacity>
          );
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.setMargin2}>
        <AddButton
          onPress={() => {
            setWorkoutModal(true);
            setHeading('Add Workout');
            setSubText('Select');
            setBtnTitle('Next');
          }}
        />
      </View>
    </View>
  );
}

MyWorkout.propTypes = {
  myWorkout: PropTypes.arrayOf(PropTypes.any).isRequired,
  // setIsVisible: PropTypes.func.isRequired,
  onSelectWorkout: PropTypes.func.isRequired,
  setHeading: PropTypes.func.isRequired,
  setScreen: PropTypes.func.isRequired,
  setBtnTitle: PropTypes.func.isRequired,
  setSubText: PropTypes.func.isRequired,
  setWorkoutModal: PropTypes.func.isRequired,
  setDatePickerModal: PropTypes.func.isRequired,
  setShowDeleteBtn: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  isDateSelected: PropTypes.bool.isRequired,
  incrementDate: PropTypes.func.isRequired,
  decrementDate: PropTypes.func.isRequired,
  getWeekOrDays: PropTypes.func.isRequired,
};
