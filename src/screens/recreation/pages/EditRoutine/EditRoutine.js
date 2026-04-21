/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { EditRoutine } from '../../components';
import {
  addRoutineTask,
  deleteRoutineTask,
  editRoutineTask,
} from '../../../../redux/actions';

const getCreateTaskFields = ({ itemName, fieldErrors }) => [
  {
    id: 1,
    value: itemName,
    state: 'itemName',
    fieldName: 'Task Name',
    placeholder: 'Enter Name',
    helperText: 'Use a clear label for this task.',
    errorText: fieldErrors.itemName,
  },
];

export default function EditRoutinePage(props) {
  const { route, onAddRoutineTask, onDeleteRoutineTask, onEditRoutineTask } =
    props;
  const { selectedItem } = route.params; // selectedItem = selectedRoutine
  const [isVisible, setIsVisible] = useState(false);
  const [createItemModal, setCreateItemModal] = useState(false);
  const [editTaskModal, setEditTaskModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [heading, setHeading] = useState('');
  const [itemName, setItemName] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [createItemFormErrorText, setCreateItemFormErrorText] = useState('');
  const [editItemFormErrorText, setEditItemFormErrorText] = useState('');
  const [createItemPending, setCreateItemPending] = useState(false);
  const [editItemPending, setEditItemPending] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [check, setCheck] = useState('');
  const submitLockRef = useRef(false);
  const deleteLockRef = useRef(false);
  const createTaskFields = getCreateTaskFields({ itemName, fieldErrors });

  const onRoutineTaskHandler = task => {
    setIsVisible(true);
    setSelectedTask(task);
    setHeading(task.name);
  };

  const resetTaskForm = () => {
    setItemName('');
    setFieldErrors({});
    setCreateItemFormErrorText('');
    setEditItemFormErrorText('');
  };

  const closeCreateTaskModal = () => {
    submitLockRef.current = false;
    setCreateItemPending(false);
    setCreateItemModal(false);
    resetTaskForm();
  };

  const closeEditTaskModal = () => {
    submitLockRef.current = false;
    setEditItemPending(false);
    setEditTaskModal(false);
    resetTaskForm();
  };

  const onOpenCreateTaskModal = () => {
    submitLockRef.current = false;
    setCreateItemPending(false);
    resetTaskForm();
    setCreateItemModal(true);
  };

  const onOpenEditTaskModal = () => {
    if (!selectedTask) {
      return;
    }

    submitLockRef.current = false;
    setEditItemPending(false);
    setFieldErrors({});
    setCreateItemFormErrorText('');
    setEditItemFormErrorText('');
    setItemName(selectedTask.name || '');
    setIsVisible(false);
    setEditTaskModal(true);
  };

  const onTaskNameChange = text => {
    setItemName(text);
    setFieldErrors(currentErrors => ({
      ...currentErrors,
      itemName: '',
    }));
    setCreateItemFormErrorText('');
    setEditItemFormErrorText('');
  };

  const validateTaskForm = mode => {
    const errors = {};

    if (!itemName.trim()) {
      errors.itemName = 'Enter a task name.';
    }

    setFieldErrors(errors);

    const formErrorText =
      Object.keys(errors).length > 0
        ? 'Check the highlighted task field before saving.'
        : '';

    if (mode === 'create') {
      setCreateItemFormErrorText(formErrorText);
    } else {
      setEditItemFormErrorText(formErrorText);
    }

    return Object.keys(errors).length === 0;
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onCreateItem = async () => {
    if (submitLockRef.current || createItemPending) {
      return;
    }

    if (!validateTaskForm('create')) {
      return;
    }

    submitLockRef.current = true;
    setCreateItemPending(true);

    const response = await onAddRoutineTask(selectedItem.id, {
      name: itemName.trim(),
      createdOn: new Date().getTime(),
    });

    submitLockRef.current = false;
    setCreateItemPending(false);

    if (response === true) {
      closeCreateTaskModal();
    } else {
      showMessage('Error!', response);
    }
  };

  const onEditItem = async () => {
    if (submitLockRef.current || editItemPending || !selectedTask) {
      return;
    }

    const data = {
      name: itemName.trim(),
    };

    if (!validateTaskForm('edit')) {
      return;
    }

    submitLockRef.current = true;
    setEditItemPending(true);

    const response = await onEditRoutineTask({
      data,
      routine_id: selectedItem.id,
      task_id: selectedTask.id,
    });

    submitLockRef.current = false;
    setEditItemPending(false);

    if (response === true) {
      closeEditTaskModal();
    } else {
      showMessage('Error!', response);
    }
  };

  const onDonePermissionModal = async () => {
    if (check === 'delete') {
      if (deleteLockRef.current || !selectedTask) {
        return;
      }

      deleteLockRef.current = true;
      setDeleteLoader(true);

      const response = await onDeleteRoutineTask({
        routine_id: selectedItem.id,
        task_id: selectedTask.id,
      });

      deleteLockRef.current = false;
      setDeleteLoader(false);

      if (response === true) {
        setCheck('');
        setIsVisible(false);
        setPermissionModal(false);
        setSelectedTask(null);
        resetTaskForm();
      } else {
        setCheck('');
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
      heading={heading}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      createTaskFields={createTaskFields}
      createItemModal={createItemModal}
      closeCreateTaskModal={closeCreateTaskModal}
      editTaskModal={editTaskModal}
      closeEditTaskModal={closeEditTaskModal}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      onRoutineTaskHandler={onRoutineTaskHandler}
      itemName={itemName}
      onTaskNameChange={onTaskNameChange}
      onCreateItem={onCreateItem}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      setCheck={setCheck}
      onEditItem={onEditItem}
      onOpenCreateTaskModal={onOpenCreateTaskModal}
      onOpenEditTaskModal={onOpenEditTaskModal}
      createItemFormErrorText={createItemFormErrorText}
      editItemFormErrorText={editItemFormErrorText}
      createItemPending={createItemPending}
      editItemPending={editItemPending}
      deleteLoader={deleteLoader}
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
