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
  CustomTextArea,
  PermissionModal,
  TextButton,
  SafeAreaWrapper,
} from '../../../components';
import { colors } from '../../../resources';
import styles from './style';

export default function WeeklyEntry(props) {
  const {
    loader,
    questions,
    permissionModal,
    setPermissionModal,
    setEntryName,
    onSaveHandler,
    entryName,
    onChangeText,
    onSetRating,
    effectiveness,
    focusRating,
    alertHeading,
    alertText,
    onDonePermissionModal,
    setCheck,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.headingText2}>Weekly Entry</Text>
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Entry Name</Text>
          <TextInput
            value={entryName}
            editable={false}
            placeholder="<Date> Weekly Entry"
            placeholderTextColor={colors.grey}
            onChangeText={text => setEntryName(text)}
            style={[styles.textInputStyle, { color: colors.grey }]}
          />
        </View>

        {questions.map((item, index) => (
          <View key={item.id}>
            <CustomTextArea
              {...props}
              value={item.value}
              title={item.title}
              checked={
                item.state === 'effectiveness' ? effectiveness : focusRating
              }
              setChecked={val => onSetRating(val, item.state)}
              isTextArea={item.isTextArea}
              placeholder={item.placeholder}
              onChangeText={text => onChangeText(text, item.state, index)}
            />
          </View>
        ))}

        <View style={styles.btnView}>
          <Button loader={loader} title="Save" onPress={onSaveHandler} />
        </View>

        <TouchableOpacity activeOpacity={0.5} style={styles.bottomTextView}>
          <TextButton
            title="Clear Entry"
            onPress={() => {
              setPermissionModal(true);
              setCheck('clearEntry');
            }}
          />
        </TouchableOpacity>
      </ScrollView>

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => {
          setPermissionModal(false);
          setCheck('');
        }}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDonePermissionModal}
            onCancel={() => {
              setPermissionModal(false);
              setCheck('');
            }}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

WeeklyEntry.propTypes = {
  loader: PropTypes.bool.isRequired,
  questions: PropTypes.arrayOf(PropTypes.any).isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  entryName: PropTypes.string.isRequired,
  setEntryName: PropTypes.func.isRequired,
  onSaveHandler: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSetRating: PropTypes.func.isRequired,
  effectiveness: PropTypes.any.isRequired,
  focusRating: PropTypes.any.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  setCheck: PropTypes.func.isRequired,
};
