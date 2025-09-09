import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { Button, Headline, Modal, Portal, Text } from 'react-native-paper';
import { colors, strings } from '../../../resources';
import CloseIcon from './CloseIcon';
import ModalButton from './ModalButton';
import styles from './style';

const ClearTheme = ({
  visibleClearTheme,
  hideClearTheme,
  showWheelPicker,
  showDialog,
}) => (
  <Portal>
    <Modal
      visible={visibleClearTheme}
      onDismiss={hideClearTheme}
      contentContainerStyle={styles.editModalContainer}
    >
      <View style={styles.modalHead}>
        <Headline style={styles.headline}>{strings.clearTheme.title}</Headline>
        <CloseIcon onPress={hideClearTheme} />
      </View>

      <Headline style={styles.editTitle}>
        {strings.clearTheme.selectRange}
      </Headline>
      <View style={{ flexDirection: 'row' }}>
        <Button
          mode="contained"
          icon="chevron-down"
          onPress={showWheelPicker}
          style={styles.select}
        >
          {strings.calendarMenu.select}
        </Button>
        <TouchableOpacity style={{ margin: 7 }} onPress={showDialog}>
          <Text style={{ color: colors.qccentError, fontSize: 20 }}>
            {strings.button.delete}
          </Text>
        </TouchableOpacity>
      </View>
      <ModalButton label={strings.button.save} onPress={hideClearTheme} />
      <Button
        mode="contained"
        labelStyle={{
          color: colors.tertiary,
          fontSize: 20,
        }}
        style={{ backgroundColor: colors.background, margin: 10 }}
        uppercase={false}
        onPress={hideClearTheme}
      >
        {strings.button.cancel}
      </Button>
    </Modal>
  </Portal>
);

ClearTheme.propTypes = {
  visibleClearTheme: PropTypes.bool.isRequired,
  hideClearTheme: PropTypes.func.isRequired,
  showWheelPicker: PropTypes.func.isRequired,
  showDialog: PropTypes.func.isRequired,
};
export default ClearTheme;
