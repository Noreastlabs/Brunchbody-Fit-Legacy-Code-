import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton';
import ProgramTable from '../ProgramTable';
import TextButton from '../TextButton';
import Button from '../Button';
import { colors } from '../../resources';
import styles from './NutritionStyle';

export default function ProgramDetailModal(props) {
  const {
    heading,
    subHeading,
    hideModal,
    programData,
    btnTitle,
    isNote,
    isDeleteBtn,
    onDeleteBtnPress,
    showTable,
    completedWorkout,
    onBtnPress,
    loader,
    planLoader,
  } = props;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View />
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headingStyle}>
            {heading !== '' ? `"${heading}"` : null}
          </Text>
          {subHeading ? (
            <Text style={styles.headingStyle}>{subHeading}</Text>
          ) : null}
        </View>
        <CloseButton
          closeIconSize={25}
          iconColor={colors.nonEditableOverlays}
          style={{ backgroundColor: colors.white }}
          onPress={hideModal}
        />
      </View>
      {/* {planLoader ? (
        <ActivityIndicator
          size="large"
          color="white"
          style={{ marginTop: 20 }}
        />
      ) : programData.length === 0 ? (
        <View>
          <Text style={styles.restingTextStyle}>Resting Day</Text>
        </View>
      ) : (
        <ProgramTable
          isModal
          isNote={isNote}
          data={completedWorkout || programData}
        />
      )} */}

      {planLoader ? (
        <ActivityIndicator
          size="large"
          color="white"
          style={{ marginTop: 20 }}
        />
      ) : programData.length > 0 ? (
        <ProgramTable
          isModal
          isNote={isNote}
          data={completedWorkout || programData}
        />
      ) : (
        <View style={{padding: 16}}>
          <Text style={{color: colors.white, textAlign: 'center'}}>No exercises for this day</Text>
        </View>
      )}
      {btnTitle && btnTitle.trim() !== '' ? (
        <View style={styles.btnView2}>
          <Button loader={loader} title={btnTitle} onPress={onBtnPress} />
        </View>
      ) : null}
      {isDeleteBtn && (
        <View style={styles.bottomTextView}>
          <TextButton onPress={onDeleteBtnPress} title="Delete" />
        </View>
      )}

      {/* {showTable ? (
        planLoader ? (
          <ActivityIndicator
            size="large"
            color="white"
            style={{ marginTop: 20 }}
          />
        ) : programData.length === 0 ? (
          <View>
            <Text style={styles.restingTextStyle}>Resting Day</Text>
          </View>
        ) : (
          <ProgramTable
            isModal
            isNote={isNote}
            data={completedWorkout || programData}
          />
        )
      ) : (
        <View style={styles.totalItemsView2}>
          <Text style={styles.tableHeadingStyle}>Total</Text>
          <Text style={styles.totalText}>{completedWorkout?.totalCal}</Text>
        </View>
      )}

      {btnTitle !== '' ? (
        <View style={styles.btnView2}>
          <Button loader={loader} title={btnTitle} onPress={onBtnPress} />
        </View>
      ) : null}

      {isDeleteBtn && (
        <View style={styles.bottomTextView}>
          <TextButton onPress={onDeleteBtnPress} title="Delete" />
        </View>
      )} */}
    </View>
  );
}

ProgramDetailModal.defaultProps = {
  hideModal: () => {},
  btnTitle: '',
  isNote: true,
  isDeleteBtn: false,
  onDeleteBtnPress: () => {},
  showTable: true,
  loader: false,
  programData: [],
};

ProgramDetailModal.propTypes = {
  heading: PropTypes.string.isRequired,
  subHeading: PropTypes.string.isRequired,
  hideModal: PropTypes.func,
  programData: PropTypes.arrayOf(PropTypes.any),
  btnTitle: PropTypes.string,
  isNote: PropTypes.bool,
  isDeleteBtn: PropTypes.bool,
  onDeleteBtnPress: PropTypes.func,
  showTable: PropTypes.bool,
  completedWorkout: PropTypes.objectOf(PropTypes.any).isRequired,
  onBtnPress: PropTypes.func.isRequired,
  loader: PropTypes.bool,
  planLoader: PropTypes.bool.isRequired,
};
