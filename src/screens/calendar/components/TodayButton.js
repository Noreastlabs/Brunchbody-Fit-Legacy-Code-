import React from 'react';
import {Button} from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from './style';
import {colors} from '../../../resources';

const TodayButton = ({showModal, task}) => (
  <Button
    mode="contained"
    style={styles.taskToday}
    uppercase={false}
    onPress={() => showModal(task)}
    labelStyle={{color: colors.white}}>
    {task.name}
  </Button>
);
TodayButton.propTypes = {
  showModal: PropTypes.func.isRequired,
  task: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default TodayButton;
