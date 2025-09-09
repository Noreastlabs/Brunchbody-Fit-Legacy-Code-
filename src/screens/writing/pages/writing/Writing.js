/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Writing } from '../../components';
import { timeBlock } from '../../../../resources';

export default function WritingPage(props) {
  const { currentTheme } = props;
  const [timeData, setTimeData] = useState([]);
  const [isItineraryDetailModal, setIsItineraryDetailModal] = useState(false);
  const [modalHeading, setModalHeading] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [itineraryItem, setItineraryItem] = useState({});

  useEffect(() => {
    updateTimeBlock();

    setInterval(() => {
      const time = moment().format('H:mm');
      setCurrentTime(time);
    }, 1000);
  }, [currentTheme]);

  const updateTimeBlock = () => {
    const temp = [...timeBlock.data];
    const itineraries = [...currentTheme.itinerary];

    temp.map((item, index) => {
      const itemMin = item.min;

      itineraries
        ?.sort((a, b) => a.fromTime.split(':')[0] - b.fromTime.split(':')[0])
        .map(a => {
          let itineraryFromHour = parseInt(
            a.fromTime.split(' ')[0].split(':')[0],
            10,
          );
          const itineraryFromMin = parseInt(
            a.fromTime.split(' ')[0].split(':')[1],
            10,
          );
          const itineraryFromFormat = a.fromTime.split(' ')[1];

          if (itineraryFromFormat === 'pm' && itineraryFromHour !== 12)
            itineraryFromHour += 12;
          if (itineraryFromFormat === 'am' && itineraryFromHour === 12)
            itineraryFromHour -= 12;

          const itineraryFromTime = itineraryFromHour * 60 + itineraryFromMin;

          let itineraryToHour = parseInt(
            a.toTime.split(' ')[0].split(':')[0],
            10,
          );
          const itineraryToMin = parseInt(
            a.toTime.split(' ')[0].split(':')[1],
            10,
          );
          const itineraryToFormat = a.toTime.split(' ')[1];

          if (itineraryToFormat === 'pm' && itineraryToHour !== 12)
            itineraryToHour += 12;
          if (itineraryToFormat === 'am' && itineraryToHour === 12)
            itineraryToHour -= 12;

          const itineraryToTime = itineraryToHour * 60 + itineraryToMin;

          if (itemMin >= itineraryFromTime && itemMin <= itineraryToTime) {
            temp[index] = {
              ...temp[index],
              taskName: a.taskName,
              taskColor: a.taskColor,
            };
          }
        });
    });

    setTimeData(temp);
  };

  return (
    <Writing
      {...props}
      timeData={timeData}
      setTimeData={setTimeData}
      itineraryItem={itineraryItem}
      setItineraryItem={setItineraryItem}
      isItineraryDetailModal={isItineraryDetailModal}
      setIsItineraryDetailModal={setIsItineraryDetailModal}
      modalHeading={modalHeading}
      setModalHeading={setModalHeading}
      currentTime={currentTime}
    />
  );
}

WritingPage.defaultProps = {
  currentTheme: {},
};

WritingPage.propTypes = {
  currentTheme: PropTypes.objectOf(PropTypes.any),
};

const mapStateToProps = state => ({
  currentTheme: state.calendar?.currentTheme,
});

export const WritingWrapper = connect(mapStateToProps, null)(WritingPage);
