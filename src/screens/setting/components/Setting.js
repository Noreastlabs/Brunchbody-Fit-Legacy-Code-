import PropTypes from 'prop-types';
import {
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {
  CustomModal,
  PermissionModal,
  TimePickerModal,
  SafeAreaWrapper,
  } from '../../../components';
import styles from './style';

export default function Setting(props) {
  const {
    navigation,
    onChangeHandler,
    state,
    listing,
    onLogoutPermission,
    onAddAlarmHandler,
    setIndex,
    onLogoutHandler,
    isPermissionModal,
    setIsPermissionModal,
    alertHeading,
    alertText,
    setAlarmHeading,
    isWarningModal,
    setIsWarningModal,
    onDoneWarningModal,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>Settings</Text>
        </View>
        <View style={{ paddingVertical: 10, marginHorizontal: 20 }}>
          {listing.map(item => (
            <View key={item.id} style={styles.listView}>
              <Text style={styles.textStyle1}>{item.title}</Text>
              {item.options.map((option, index) => (
                <>
                  <TouchableOpacity
                    key={option.id}
                    activeOpacity={0.5}
                    style={styles.linkView}
                    onPress={() => {
                      option.screen
                        ? navigation.navigate(option.screen)
                        : option.link
                        ? Linking.openURL(option.link)
                        : option.name === 'Logout'
                        ? onLogoutPermission()
                        : {};
                    }}
                  >
                    {option.type === 'toggle' ? (
                      <Switch
                        trackColor={{ false: '#BBBBBB', true: '#0088D1' }}
                        thumbColor="#81D3F9"
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={val => {
                          onChangeHandler({
                            name: option.toggleName,
                            value: val,
                          });
                        }}
                        value={state[option.toggleName]}
                        style={{ marginRight: 10 }}
                      />
                    ) : (
                      <View />
                    )}

                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={styles.textStyle2}>{option.name}</Text>
                      <AntDesign
                        name="right"
                        size={15}
                        style={[
                          styles.iconStyle,
                          { display: option.screen !== '' ? 'flex' : 'none' },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>

                  {item.title === 'Alerts' && state[option.toggleName] ? (
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.clockAlertView}
                      onPress={() => {
                        setIndex(index);
                        onChangeHandler({
                          name: 'isTimePickerModal',
                          value: true,
                        });
                        setAlarmHeading(option.name);
                      }}
                    >
                      <Feather name="clock" size={20} color="white" />
                      <Text style={styles.timeText}>{option.alarmTime}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                </>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <CustomModal
        isVisible={state.isTimePickerModal}
        onDismiss={() =>
          onChangeHandler({
            name: 'isTimePickerModal',
            value: false,
          })
        }
        content={
          <TimePickerModal
            {...props}
            onConfirm={onAddAlarmHandler}
            onCancel={() =>
              onChangeHandler({
                name: 'isTimePickerModal',
                value: false,
              })
            }
          />
        }
      />

      <CustomModal
        isVisible={isPermissionModal}
        onDismiss={() => setIsPermissionModal(false)}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onLogoutHandler}
            onCancel={() => setIsPermissionModal(false)}
          />
        }
      />

      <CustomModal
        isVisible={isWarningModal}
        onDismiss={() => setIsWarningModal(false)}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDoneWarningModal}
            onCancel={() => setIsWarningModal(false)}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

Setting.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  listData: PropTypes.arrayOf(PropTypes.any).isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  onAddAlarmHandler: PropTypes.func.isRequired,
  onLogoutPermission: PropTypes.func.isRequired,
  setIndex: PropTypes.func.isRequired,
  state: PropTypes.objectOf(PropTypes.any).isRequired,
  listing: PropTypes.arrayOf(PropTypes.any).isRequired,
  onLogoutHandler: PropTypes.func.isRequired,
  isPermissionModal: PropTypes.bool.isRequired,
  setIsPermissionModal: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  setAlarmHeading: PropTypes.func.isRequired,
  isWarningModal: PropTypes.bool.isRequired,
  setIsWarningModal: PropTypes.func.isRequired,
  onDoneWarningModal: PropTypes.func.isRequired,
};
