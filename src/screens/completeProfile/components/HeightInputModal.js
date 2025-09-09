import React from 'react';
import {View, TextInput, Text, TouchableOpacity, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import PropTypes from 'prop-types';
import style from './style';
import {strings, colors} from '../../../resources';
import {DropdownWrapper} from '../pages/completeProfile/Dropdown';

const InputModal = ({
  height,
  settingFeet,
  settingInches,
  toggleModal,
  feet,
  modalVisible,
}) => (
  <View style={style.dropdownInput}>
    <TouchableOpacity onPress={toggleModal}>
      <TextInput
        style={style.input}
        placeholder={strings.completeProfile.placeholders.height}
        placeholderTextColor={colors.grey}
        underlineColorAndroid="transparent"
        editable={false}
        value={feet > 0 ? height : <Text />}
      />
    </TouchableOpacity>

    <TouchableOpacity onPress={toggleModal}>
      <Icon style={style.arrowIcon} name="caretdown" size={20} color="#000" />
    </TouchableOpacity>

    <Modal transparent visible={modalVisible}>
      <View style={style.modalWrapper}>
        <View style={style.modal}>
          <View style={style.heightPickerView}>
            <DropdownWrapper
              settingValue={settingFeet}
              data={strings.completeProfile.dropdown.feetlist}
            />
            <Text style={style.heightUnitText}>
              {strings.completeProfile.height.feet}
            </Text>
            <DropdownWrapper
              settingValue={settingInches}
              data={strings.completeProfile.dropdown.incheslist}
            />
            <Text style={style.heightUnitText}>
              {strings.completeProfile.height.inch}
            </Text>
          </View>
          <TouchableOpacity style={style.okBtn} onPress={toggleModal}>
            <Text style={style.okText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
);
InputModal.propTypes = {
  height: PropTypes.string.isRequired,
  settingFeet: PropTypes.func.isRequired,
  settingInches: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  feet: PropTypes.number.isRequired,
  modalVisible: PropTypes.bool.isRequired,
};

export default InputModal;
