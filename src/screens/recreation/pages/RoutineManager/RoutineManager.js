/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRoutineTasks } from '../../../../redux/actions';
import { RoutineManager } from '../../components';

export default function RoutineManagerPage(props) {
  const { route, onGetRoutineTasks } = props;
  const { selectedItem } = route.params;
  const [loader, setLoader] = useState(true);

  const getAllRoutineItems = async () => {
    await onGetRoutineTasks(selectedItem.id);

    setLoader(false);
  };

  useEffect(() => {
    getAllRoutineItems();
  }, []);

  return <RoutineManager {...props} loader={loader} />;
}

RoutineManagerPage.defaultProps = {
  route: {},
};

RoutineManagerPage.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  onGetRoutineTasks: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  myRoutineTasks: state.recreation?.routineTasks,
});

const mapDispatchToProps = dispatch => ({
  onGetRoutineTasks: id => dispatch(getRoutineTasks(id)),
});

export const RoutineManagerWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoutineManagerPage);
