import React from 'react';
import {Button} from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from './style';
import {colors} from '../../../resources/colors';

const SomedayButton = ({showModal, task}) => (
  <Button
    mode="contained"
    uppercase={false}
    onPress={() => showModal(task)}
    labelStyle={{color: colors.white}}
    style={styles.taskSomeday}>
    {task.name}
  </Button>
);

SomedayButton.propTypes = {
  showModal: PropTypes.func.isRequired,
  task: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SomedayButton;
