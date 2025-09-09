import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Headline, Modal, Portal, RadioButton, Text } from 'react-native-paper';
import { colors, strings } from '../../../resources';
import CloseIcon from './CloseIcon';
import ModalButton from './ModalButton';
import styles from './style';

const CalendarMenu = ({
  visibleCalendarMenu,
  hideCalendarMenu,
  checkedCalendarMenu,
  checkTheme,
  checkTodo,
  openEditModal,
  showMyTheme,
}) => (
  <Portal>
    <Modal
      visible={visibleCalendarMenu}
      onDismiss={hideCalendarMenu}
      contentContainerStyle={styles.editModalContainer}
    >
      <View style={styles.modalHead}>
        <Headline style={styles.headline}>
          {strings.calendarMenu.title}
        </Headline>
        <CloseIcon onPress={hideCalendarMenu} />
      </View>
      <Headline style={styles.editTitle}>
        {strings.calendarMenu.select}
      </Headline>
      <View style={{ flexDirection: 'row' }}>
        <RadioButton.Android
          value="Theme"
          status={checkedCalendarMenu === 'Theme' ? 'checked' : 'unchecked'}
          onPress={checkTheme}
          uncheckedColor={colors.nonEditableOverlays}
        />
        <Text style={styles.modalText}>{strings.calendarMenu.themes}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <RadioButton.Android
          value="Todo"
          status={checkedCalendarMenu === 'Todo' ? 'checked' : 'unchecked'}
          onPress={checkTodo}
          uncheckedColor={colors.nonEditableOverlays}
        />
        <Text style={styles.modalText}>{strings.calendarMenu.todo}</Text>
      </View>
      <ModalButton
        onPress={checkedCalendarMenu === 'Todo' ? openEditModal : showMyTheme}
        label={strings.button.next}
      />
    </Modal>
  </Portal>
);

CalendarMenu.propTypes = {
  visibleCalendarMenu: PropTypes.bool.isRequired,
  hideCalendarMenu: PropTypes.func.isRequired,
  checkedCalendarMenu: PropTypes.string.isRequired,
  checkTheme: PropTypes.func.isRequired,
  checkTodo: PropTypes.func.isRequired,
  openEditModal: PropTypes.func.isRequired,
  showMyTheme: PropTypes.func.isRequired,
};
export default CalendarMenu;
