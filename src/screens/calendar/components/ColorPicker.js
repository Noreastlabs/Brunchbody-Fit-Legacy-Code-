import PropTypes from 'prop-types';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { Headline, Modal } from 'react-native-paper';
import WheelColorPicker from 'react-native-wheel-color-picker';
import { colors, strings } from '../../../resources';
import CloseIcon from './CloseIcon';
import ModalButton from './ModalButton';
import styles from './style';

const Picker = ({
  visibleColorPicker,
  hideColorPicker,
  closeColorPicker,
  newColor,
  changeColor,
}) => (
  <Modal
    visible={visibleColorPicker}
    onDismiss={hideColorPicker}
    contentContainerStyle={styles.editModalContainer}
  >
    <View style={styles.backdrop}>
      <View style={styles.editModalContainer}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Headline style={styles.headline}>
              {strings.colorPicker.title}
            </Headline>
            <CloseIcon onPress={hideColorPicker} />
          </View>
          <View>
            <WheelColorPicker
              color={newColor}
              onColorChangeComplete={changeColor}
              thumbStyle={{ height: 30, width: 30, borderRadius: 15 }}
              sliderHidden
              style={{
                width: Dimensions.get('window').width * 0.8,
                height: 400,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 24, color: colors.white, padding: 10 }}>
                {strings.colorPicker.hex}
              </Text>
              <View style={styles.colorBackground}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: newColor,
                  }}
                />
                <Text style={styles.modalTaskText}>{newColor}</Text>
              </View>
            </View>
          </View>
          <ModalButton label={strings.button.save} onPress={hideColorPicker} />
        </ScrollView>
      </View>
    </View>
  </Modal>
);

Picker.propTypes = {
  visibleColorPicker: PropTypes.bool.isRequired,
  hideColorPicker: PropTypes.func.isRequired,
  closeColorPicker: PropTypes.func.isRequired,
  newColor: PropTypes.string.isRequired,
  changeColor: PropTypes.func.isRequired,
};

export default Picker;
