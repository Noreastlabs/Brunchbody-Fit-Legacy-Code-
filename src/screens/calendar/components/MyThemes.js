import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { Headline, Modal, Portal, RadioButton, Text } from 'react-native-paper';
import { colors, strings } from '../../../resources';
import CloseIcon from './CloseIcon';
import ModalButton from './ModalButton';
import styles from './style';

const MyThemes = ({
  checkedTheme,
  setTheme,
  visibleMyTheme,
  hideMyTheme,
  openThemeModal,
}) => (
  <Portal>
    <Modal
      visible={visibleMyTheme}
      onDismiss={hideMyTheme}
      contentContainerStyle={styles.editModalContainer}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.headline, { fontSize: 24, fontWeight: 'bold' }]}>{strings.myThemes.title}</Text>
        <CloseIcon onPress={hideMyTheme} />
      </View>
      <Text style={[styles.editTitle, { fontSize: 20, fontWeight: '600' }]}>
        {strings.calendarMenu.select}
      </Text>
      <RadioButton.Group
        value={checkedTheme}
        onValueChange={val => setTheme(val)}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flexDirection: 'row' }}
          onPress={() => setTheme('create')}
        >
          <RadioButton.Android
            value="create"
            uncheckedColor={colors.nonEditableOverlays}
          />
          <Text style={styles.modalText}>{strings.myThemes.create}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flexDirection: 'row' }}
          onPress={() => setTheme('manage')}
        >
          <RadioButton.Android
            value="manage"
            uncheckedColor={colors.nonEditableOverlays}
          />
          <Text style={styles.modalText}>{strings.myThemes.manage}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flexDirection: 'row' }}
          onPress={() => setTheme('add/remove')}
        >
          <RadioButton.Android
            value="add/remove"
            uncheckedColor={colors.nonEditableOverlays}
          />
          <Text style={styles.modalText}>{strings.myThemes.addRemove}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flexDirection: 'row' }}
          onPress={() => setTheme('clear')}
        >
          <RadioButton.Android
            value="clear"
            uncheckedColor={colors.nonEditableOverlays}
          />
          <Text style={styles.modalText}>{strings.myThemes.clear}</Text>
        </TouchableOpacity>
      </RadioButton.Group>
      <ModalButton onPress={openThemeModal} label={strings.button.next} />
    </Modal>
  </Portal>
);

MyThemes.propTypes = {
  checkedTheme: PropTypes.string.isRequired,
  setTheme: PropTypes.func.isRequired,
  visibleMyTheme: PropTypes.bool.isRequired,
  hideMyTheme: PropTypes.func.isRequired,
  openThemeModal: PropTypes.func.isRequired,
};
export default MyThemes;
