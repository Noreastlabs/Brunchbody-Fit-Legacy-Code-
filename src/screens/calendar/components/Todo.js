import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import {colors, strings} from '../../../resources';
import SomedayButton from './SomedayButton';
import TodayButton from './TodayButton';
import styles from './style';

const containerStyle = {margin: 20};
const titleStyle = {
  fontSize: 30,
  color: colors.secondary,
  fontWeight: 'bold',
};
const emptyStateStyle = {
  fontSize: 20,
  color: colors.secondary,
  fontWeight: 'bold',
};

const Todo = ({tasks, showModal, todoListDate}) => (
  <View style={containerStyle}>
    <Text style={titleStyle}>{strings.editTask.title}</Text>
    <View>
      <Text style={styles.todoSubheading}>
        {moment(todoListDate).format('YYYY-MM-DD') ===
        moment().format('YYYY-MM-DD')
          ? strings.todo.today
          : moment(todoListDate).format('MM/DD/YYYY')}
      </Text>
      {tasks.filter(
        i =>
          moment(i.day).format('YYYY-MM-DD') ===
          moment(todoListDate).format('YYYY-MM-DD'),
      ).length === 0 ? (
        <Text style={emptyStateStyle}>{strings.editTask.noTasks}</Text>
      ) : (
        tasks
          .filter(
            i =>
              moment(i.day).format('YYYY-MM-DD') ===
              moment(todoListDate).format('YYYY-MM-DD'),
          )
          .map(filteredTask => (
            <View key={filteredTask.id}>
              <TodayButton showModal={showModal} task={filteredTask} />
            </View>
          ))
      )}
    </View>

    <View>
      <Text style={styles.todoSubheading}>{strings.todo.someday}</Text>
      {tasks.filter(task => task.day === strings.todo.someday).length === 0 ? (
        <Text style={emptyStateStyle}>{strings.editTask.noTasks}</Text>
      ) : (
        tasks
          .filter(task => task.day === strings.todo.someday)
          .map(filteredTask => (
            <View key={filteredTask.id}>
              <SomedayButton showModal={showModal} task={filteredTask} />
            </View>
          ))
      )}
    </View>
  </View>
);

Todo.propTypes = {
  showModal: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.any).isRequired,
  todoListDate: PropTypes.string.isRequired,
};

export default Todo;
