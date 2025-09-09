import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton';
import SelectComp from '../SelectComp';
import TextButton from '../TextButton';
import Button from '../Button';
import styles from './style';

export default function ClearTheme(props) {
  const {
    hideModal,
    clearDays,
    showWheelPicker,
    btnLoader,
    onBtnPress,
    setPermissionModal,
  } = props;

  return (
    <View style={styles.contentContainer}>
      <View style={styles.modalHead}>
        <Text style={styles.textStyle1}>Clear Theme</Text>
        <CloseButton onPress={hideModal} />
      </View>

      <View style={styles.flexRowView4}>
        <View style={{flex: 1}}>
          <SelectComp
            title="Select Range"
            type={clearDays || 'Select'}
            onPress={showWheelPicker}
            style={styles.selectCompStyle}
            pickerViewStyle={{width: '100%'}}
          />
        </View>
        <View style={{flex: 1}}>
          <TextButton
            title="Delete"
            disabled={!clearDays}
            onPress={setPermissionModal}
            style={{marginBottom: 13}}
          />
        </View>
      </View>

      <View style={styles.btnView2}>
        <Button
          loader={btnLoader}
          disabled={!clearDays}
          title="Done"
          onPress={onBtnPress}
        />
      </View>

      {/* <View style={styles.setMargin3}>
        <TextButton
          title="Cancel"
          onPress={hideModal}
          titleStyle={styles.cancelText2}
        />
      </View> */}
    </View>
  );
}

ClearTheme.propTypes = {
  hideModal: PropTypes.func.isRequired,
  showWheelPicker: PropTypes.func.isRequired,
  clearDays: PropTypes.string.isRequired,
  btnLoader: PropTypes.bool.isRequired,
  onBtnPress: PropTypes.func.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
};
