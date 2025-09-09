import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  CustomModal,
  DatePickerModal,
  ModalContent,
  PermissionModal,
  SafeAreaWrapper,
} from '../../../components';
import { colors } from '../../../resources';
import styles from './style';

export default function Journal(props) {
  const {
    navigation,
    loader,
    listData,
    isVisible,
    pageDetail,
    setIsVisible,
    setPageDetail,
    permissionModal,
    setPermissionModal,
    datePickerModal,
    setDatePickerModal,
    date,
    month,
    year,
    isDateSelected,
    incrementDate,
    decrementDate,
    journalEntries,
    onDeleteJournalEntry,
    onConfirmDatePicker,
    onCancelDatePicker,
    entryId,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>Journal</Text>
        </View>

        <View style={styles.dateView}>
          <TouchableOpacity activeOpacity={0.5} onPress={decrementDate}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={30}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setDatePickerModal(true);
            }}
          >
            <Text style={styles.dateText}>
              {isDateSelected
                ? `${month}/${date}/${year}`
                : `${
                    new Date().getMonth() + 1
                  }/${new Date().getDate()}/${new Date().getFullYear()}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={incrementDate}>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={30}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>

        {loader ? (
          <ActivityIndicator size="large" color={colors.white} />
        ) : (
          listData.map(item => (
            <View key={item.id} style={styles.listView}>
              <Text style={styles.textStyle1}>{item.heading}</Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.linkView}
                onPress={() => {
                  setPageDetail(
                    journalEntries?.[item.title] &&
                      !journalEntries?.[item.title].isDeleted
                      ? {
                          ...journalEntries?.[item.title],
                          heading: item.heading,
                          screen: item.screen,
                          title: item.title,
                          date: `${year}/${month}/${date}`,
                          entryId,
                        }
                      : { ...item, date: `${year}/${month}/${date}` },
                  );
                  setIsVisible(true);
                }}
              >
                {journalEntries?.[item.title] &&
                !journalEntries?.[item.title].isDeleted ? (
                  <Text style={styles.textStyle2}>
                    --{`${month}/${date}/${year}`} {item.heading.toUpperCase()}
                    --
                  </Text>
                ) : (
                  <Text style={styles.textStyle2}>--EMPTY--</Text>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}

        <CustomModal
          isVisible={isVisible}
          onDismiss={() => setIsVisible(false)}
          content={
            <ModalContent
              heading={pageDetail.heading}
              subText={
                pageDetail.isEmpty
                  ? '--EMPTY--'
                  : `--${`${month}/${date}/${year}`} ${pageDetail.heading}--`
              }
              hideModal={() => setIsVisible(false)}
              btnTitle={pageDetail.isEmpty ? 'Create' : 'Edit'}
              onBtnPress={() => {
                navigation.navigate(pageDetail.screen, {
                  entryData: pageDetail,
                  entryId,
                });
                setIsVisible(false);
              }}
              isDeleteBtn={!pageDetail.isEmpty}
              onDeleteBtnPress={() => setPermissionModal(true)}
            />
          }
        />

        <CustomModal
          isVisible={datePickerModal}
          onDismiss={() => setDatePickerModal(false)}
          content={
            <DatePickerModal
              {...props}
              onConfirm={onConfirmDatePicker}
              onCancel={onCancelDatePicker}
            />
          }
        />

        <CustomModal
          isVisible={permissionModal}
          onDismiss={() => setPermissionModal(false)}
          content={
            <PermissionModal
              onDone={onDeleteJournalEntry}
              onCancel={() => setPermissionModal(false)}
            />
          }
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
}

Journal.defaultProps = {
  journalEntries: {},
  entryId: '',
};

Journal.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  loader: PropTypes.bool.isRequired,
  listData: PropTypes.arrayOf(PropTypes.any).isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsVisible: PropTypes.func.isRequired,
  pageDetail: PropTypes.objectOf(PropTypes.any).isRequired,
  setPageDetail: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  datePickerModal: PropTypes.bool.isRequired,
  setDatePickerModal: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  isDateSelected: PropTypes.bool.isRequired,
  incrementDate: PropTypes.func.isRequired,
  decrementDate: PropTypes.func.isRequired,
  journalEntries: PropTypes.objectOf(PropTypes.any),
  onDeleteJournalEntry: PropTypes.func.isRequired,
  onConfirmDatePicker: PropTypes.func.isRequired,
  onCancelDatePicker: PropTypes.func.isRequired,
  entryId: PropTypes.string,
};
