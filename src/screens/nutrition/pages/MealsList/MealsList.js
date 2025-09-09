/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MealsList } from '../../components';

export default function MealsListPage(props) {
  const { mealCategories } = props;
  const [search, setSearch] = useState('');

  return (
    <MealsList
      search={search}
      setSearch={setSearch}
      mealCategories={mealCategories}
    />
  );
}

MealsListPage.propTypes = {
  mealCategories: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  mealCategories: state.nutrition?.mealCategories,
});

export const MealsListWrapper = connect(mapStateToProps, null)(MealsListPage);
