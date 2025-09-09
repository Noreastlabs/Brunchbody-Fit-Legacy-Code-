/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { EditRoutine } from '../../components';
import {
  addRoutineTask,
  deleteRoutineTask,
  editRoutineTask,
} from '../../../../redux/actions';

const createTaskFields = [
  {
    id: 1,
    value: '',
    fieldName: 'Task Name',
    placeholder: 'Enter Name',
  },
];

export default function EditRoutinePage(props) {
  const { route, onAddRoutineTask, onDeleteRoutineTask, onEditRoutineTask } =
    props;
  const { selectedItem } = route.params; // selectedItem = selectedRoutine
  const [loader, setLoader] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [createItemModal, setCreateItemModal] = useState(false);
  const [editTaskModal, setEditTaskModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [heading, setHeading] = useState('');
  const [itemName, setItemName] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [check, setCheck] = useState('');

  const onRoutineTaskHandler = task => {
    setIsVisible(true);
    setSelectedTask(task);
    setHeading(task.name);
    setItemName(task.name);
    createTaskFields[0].value = task.name;
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onCreateItem = async () => {
    setLoader(true);
    const d = new Date();

    if (itemName.trim()) {
      const response = await onAddRoutineTask(selectedItem.id, {
        name: itemName,
        createdOn: d.getTime(),
      });

      if (response === true) {
        setItemName('');
        setLoader(false);
        setCreateItemModal(false);
      } else {
        setLoader(false);
        showMessage('Error!', response);
      }
    } else {
      setLoader(false);
      showMessage('Error!', 'All fields are required.');
    }
  };

  const onEditItem = async () => {
    setLoader(true);

    const data = {
      name: itemName,
    };

    if (itemName.trim()) {
      const response = await onEditRoutineTask({
        data,
        routine_id: selectedItem.id,
        task_id: selectedTask.id,
      });

      if (response === true) {
        setItemName('');
        setLoader(false);
        setEditTaskModal(false);
      } else {
        setLoader(false);
        showMessage('Error!', response);
      }
    } else {
      setLoader(false);
      showMessage('Error!', 'All fields are required.');
    }
  };

  const onDonePermissionModal = async () => {
    if (check === 'delete') {
      setLoader(true);

      const response = await onDeleteRoutineTask({
        routine_id: selectedItem.id,
        task_id: selectedTask.id,
      });

      if (response === true) {
        setCheck('');
        setLoader(false);
        setIsVisible(false);
        setPermissionModal(false);
      } else {
        setCheck('');
        setLoader(false);
        showMessage('Error!', response);
      }
    } else {
      setCheck('');
      setPermissionModal(false);
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    }
  };

  return (
    <EditRoutine
      {...props}
      loader={loader}
      heading={heading}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      createTaskFields={createTaskFields}
      createItemModal={createItemModal}
      setCreateItemModal={setCreateItemModal}
      editTaskModal={editTaskModal}
      setEditTaskModal={setEditTaskModal}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      onRoutineTaskHandler={onRoutineTaskHandler}
      itemName={itemName}
      setItemName={setItemName}
      onCreateItem={onCreateItem}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      setCheck={setCheck}
      onEditItem={onEditItem}
    />
  );
}

EditRoutinePage.defaultProps = {
  route: {},
};

EditRoutinePage.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  onAddRoutineTask: PropTypes.func.isRequired,
  onDeleteRoutineTask: PropTypes.func.isRequired,
  onEditRoutineTask: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  myRoutineTasks: state.recreation?.routineTasks,
});

const mapDispatchToProps = dispatch => ({
  onAddRoutineTask: (id, data) => dispatch(addRoutineTask(id, data)),
  onEditRoutineTask: data => dispatch(editRoutineTask(data)),
  onDeleteRoutineTask: data => dispatch(deleteRoutineTask(data)),
});

export const EditRoutineWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditRoutinePage);
