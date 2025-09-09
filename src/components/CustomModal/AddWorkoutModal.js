import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {RadioButton} from 'react-native-paper';
import SelectComp from '../SelectComp';
import CloseButton from '../CloseButton';
import Button from '../Button';
import styles from './style';
import {colors, wheelPickerItems} from '../../resources';

export default function AddWorkoutModal(props) {
  const {
    heading,
    subHeading,
    btnTitle,
    onBtnPress,
    hideModal,
    options,
    onOptionSelect,
    selected,
    onDropdownSelect,
    day,
    week,
    loader,
    selectedWorkout,
  } = props;

  return (
    <View style={styles.contentContainer}>
      <View style={styles.modalHead}>
        <Text style={styles.textStyle1}>{heading}</Text>
        <CloseButton onPress={hideModal} />
      </View>

      <View style={styles.setMargin2}>
        <Text style={styles.subHeading2}>{subHeading}</Text>
      </View>

      <View style={styles.setMargin2}>
        <Text style={styles.subHeading}>Select</Text>

        <SelectComp
          title="WEEK"
          type={week || 'Week'}
          textStyle={styles.miniText}
          onPress={() =>
            onDropdownSelect(
              wheelPickerItems.weeks.slice(
                0,
                selectedWorkout?.weeks || selectedWorkout?.numOfWeeks,
              ),
              'Weeks',
            )
          }
          style={styles.selectCompStyle}
        />

        <SelectComp
          title="DAY"
          type={day || 'Day'}
          textStyle={styles.miniText}
          onPress={() => onDropdownSelect(wheelPickerItems.workoutDays, 'Days')}
          style={styles.selectCompStyle}
        />
      </View>

      <View style={styles.setMargin2}>
        <Text style={styles.subHeading}>Sequence</Text>

        <View style={styles.setMargin1}>
          {options.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.5}
              style={styles.selectOptionsView}
              onPress={() => onOptionSelect(item.option)}>
              <RadioButton.Android
                value="Theme"
                status={selected === item.option ? 'checked' : 'unchecked'}
                onPress={() => onOptionSelect(item.option)}
                uncheckedColor={colors.nonEditableOverlays}
              />
              <Text style={styles.optionText}>{item.option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.btnView2}>
        <Button loader={loader} title={btnTitle} onPress={onBtnPress} />
      </View>
    </View>
  );
}

AddWorkoutModal.defaultProps = {
  day: '',
  week: '',
  loader: false,
};

AddWorkoutModal.propTypes = {
  heading: PropTypes.string.isRequired,
  subHeading: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  onOptionSelect: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  onDropdownSelect: PropTypes.func.isRequired,
  day: PropTypes.string,
  week: PropTypes.string,
  loader: PropTypes.bool,
  selectedWorkout: PropTypes.objectOf(PropTypes.any).isRequired,
};
