import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Height} from '../../components';

const DEFAULT_HEIGHT = {
  feet: 1,
  inches: 0,
};

export const HeightPage = ({
  selectedHeight,
  isHeightConfirmed,
  onConfirmHeight,
  ...props
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [feet, setFeet] = useState(selectedHeight?.feet || DEFAULT_HEIGHT.feet);
  const [inches, setInches] = useState(
    selectedHeight?.inches || DEFAULT_HEIGHT.inches,
  );

  useEffect(() => {
    if (!selectedHeight) {
      return;
    }

    setFeet(selectedHeight.feet);
    setInches(selectedHeight.inches);
  }, [selectedHeight]);

  return (
    <Height
      {...props}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      feet={feet}
      setFeet={setFeet}
      inches={inches}
      setInches={setInches}
      isHeightSelected={isHeightConfirmed}
      onConfirmHeight={() => {
        onConfirmHeight({feet, inches});
      }}
    />
  );
};

HeightPage.defaultProps = {
  selectedHeight: null,
  errorText: '',
};

HeightPage.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  selectedHeight: PropTypes.shape({
    feet: PropTypes.number.isRequired,
    inches: PropTypes.number.isRequired,
  }),
  isHeightConfirmed: PropTypes.bool.isRequired,
  onConfirmHeight: PropTypes.func.isRequired,
  errorText: PropTypes.string,
};

export const HeightWrapper = connect(null, null)(HeightPage);
