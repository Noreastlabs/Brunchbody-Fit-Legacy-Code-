/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
import { useFocusEffect } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { getAllJournalEntries } from '../../../../redux/actions';
import Dashboard from '../../components';

const daysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsName = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const tabs = [
  { id: 1, title: 'D' },
  { id: 2, title: 'W' },
  { id: 3, title: 'M' },
  { id: 4, title: 'Y' },
];

export function DashboardPage(props) {
  const { getAllUserEntries } = props;
  const [loader, setLoader] = useState(true);
  const [days] = useState([]);
  const [months] = useState([]);
  const [years] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);

  const backAction = () => {
    BackHandler.exitApp();
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  const getData = async () => {
    setLoader(true);
    await getAllUserEntries();
    setLoader(false);
  };

  const setGraphLabels = () => {
    let currentDay = new Date().getDay();
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    for (let i = 0; i < 7; i += 1) {
      days.push(daysName[currentDay]);
      if (currentDay === 0) currentDay = 6;
      else currentDay -= 1;
    }

    for (let i = 0; i < 7; i += 1) {
      months.push(monthsName[currentMonth]);
      if (currentMonth === 0) currentMonth = 11;
      else currentMonth -= 1;
    }

    for (let i = 0; i < 7; i += 1) {
      years.push(currentYear);
      currentYear -= 1;
    }
  };

  useEffect(() => {
    setGraphLabels();
    getData();
  }, []);

  return (
    <Dashboard
      {...props}
      loader={loader}
      days={days}
      months={months}
      years={years}
      tabs={tabs}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
  );
}

DashboardPage.propTypes = {
  getAllUserEntries: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth?.user,
  currentTheme: state.calendar?.currentTheme,
});

const mapDispatchToProps = dispatch => ({
  getAllUserEntries: () => dispatch(getAllJournalEntries()),
});

export const DashboardWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardPage);
