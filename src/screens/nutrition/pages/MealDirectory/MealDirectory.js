/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MealDirectory } from '../../components';

export default function MealDirectoryPage(props) {
  const { mealsDirectory } = props;
  const [search, setSearch] = useState('');

  return (
    <MealDirectory
      {...props}
      search={search}
      setSearch={setSearch}
      directoryList={mealsDirectory}
    />
  );
}

MealDirectoryPage.propTypes = {
  mealsDirectory: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  mealsDirectory: state.nutrition?.mealsDirectory,
});

export const MealDirectoryWrapper = connect(
  mapStateToProps,
  null,
)(MealDirectoryPage);
