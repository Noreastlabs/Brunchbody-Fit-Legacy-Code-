import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  getOnboardingDraftValue,
  setOnboardingDraftValue,
} from '../../../../redux/actions/onboardingStorage';
import {Height} from '../../components';

export const HeightPage = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isHeightSelected, setIsHeightSelected] = useState(true);
  const [feet, setFeet] = useState(1);
  const [inches, setInches] = useState(0);

  useEffect(() => {
    getHeight();
  }, []);

  const getHeight = async () => {
    const height = await getOnboardingDraftValue('height');

    if (height) {
      const temp = height.split('.');
      setFeet(parseInt(temp[0], 10));
      setInches(parseInt(temp[1], 10));
    } else {
      setOnboardingDraftValue('height', `${feet}.${inches}`);
    }
  };

  return (
    <Height
      {...props}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      feet={feet}
      setFeet={setFeet}
      inches={inches}
      setInches={setInches}
      isHeightSelected={isHeightSelected}
      setIsHeightSelected={setIsHeightSelected}
    />
  );
};

HeightPage.propTypes = {
  currentScreen: PropTypes.func.isRequired,
};

export const HeightWrapper = connect(null, null)(HeightPage);
