import PropTypes from 'prop-types';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  CustomHeader,
  CustomModal,
  PermissionModal,
  SafeAreaWrapper,
  TextButton,
} from '../../../components';
import { colors } from '../../../resources';
import styles from './style'; 

export default function WeightLog(props) {
  const {
    loader,
    permissionModal,
    entryName,
    setEntryName,
    weight,
    setWeight,
    note,
    setNote,
    onSaveHandler,
    alertHeading,
    alertText,
    onDonePermissionModal,
    onClosePermissionModal,
    onPromptClearEntry,
    weightErrorText,
    formErrorText,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.headingText2}>Weight Log</Text>
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Entry Name</Text>
          <TextInput
            value={entryName}
            editable={false}
            placeholder="<Date> Weight Log"
            placeholderTextColor={colors.grey}
            onChangeText={text => setEntryName(text)}
            style={[styles.textInputStyle, { color: colors.grey }]}
          />
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Enter Weight (lbs)</Text>
          <TextInput
            value={weight}
            placeholder="lbs"
            placeholderTextColor={colors.grey}
            onChangeText={text => setWeight(text)}
            keyboardType="number-pad"
            style={styles.textInputStyle}
          />
          {weightErrorText ? (
            <Text style={[styles.supportingText, styles.supportingTextError]}>
              {weightErrorText}
            </Text>
          ) : null}
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Note</Text>
          <TextInput
            multiline
            value={note}
            placeholder="Notes"
            style={styles.textArea}
            placeholderTextColor={colors.grey}
            onChangeText={text => setNote(text)}
          />
        </View>

        <View style={styles.btnView}>
          <Button loader={loader} title="Save" onPress={onSaveHandler} />
          {formErrorText ? (
            <Text style={[styles.supportingText, styles.supportingTextError]}>
              {formErrorText}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity activeOpacity={0.5} style={styles.bottomTextView}>
          <TextButton title="Clear Entry" onPress={onPromptClearEntry} />
        </TouchableOpacity>
      </ScrollView>

      <CustomModal
        isVisible={permissionModal}
        onDismiss={onClosePermissionModal}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDonePermissionModal}
            onCancel={onClosePermissionModal}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

WeightLog.propTypes = {
  loader: PropTypes.bool.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  entryName: PropTypes.string.isRequired,
  setEntryName: PropTypes.func.isRequired,
  weight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setWeight: PropTypes.func.isRequired,
  note: PropTypes.string.isRequired,
  setNote: PropTypes.func.isRequired,
  onSaveHandler: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  onClosePermissionModal: PropTypes.func.isRequired,
  onPromptClearEntry: PropTypes.func.isRequired,
  weightErrorText: PropTypes.string.isRequired,
  formErrorText: PropTypes.string.isRequired,
};
