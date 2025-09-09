/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {connect} from 'react-redux';
import {Abbrevations} from '../../components';

const abbrevationList = [
  {
    id: 1,
    shortName: 'Hr',
    longName: 'Hour',
  },
  {
    id: 2,
    shortName: 'Mn',
    longName: 'Minute',
  },
  {
    id: 3,
    shortName: 'Sc',
    longName: 'Second',
  },
  {
    id: 4,
    shortName: 'ft',
    longName: 'Feet',
  },
  {
    id: 5,
    shortName: 'in',
    longName: 'Inch',
  },
  {
    id: 6,
    shortName: 'km',
    longName: 'Kilometer',
  },
  {
    id: 7,
    shortName: 'cm',
    longName: 'Centimeter',
  },
  {
    id: 8,
    shortName: 'Tbsp',
    longName: 'Tablespoon',
  },
  {
    id: 9,
    shortName: 'Tsp',
    longName: 'Teaspoon',
  },
  {
    id: 10,
    shortName: 'c',
    longName: 'Cup',
  },
  {
    id: 11,
    shortName: 'pt',
    longName: 'Pint',
  },
  {
    id: 12,
    shortName: 'l',
    longName: 'Liter',
  },
  {
    id: 13,
    shortName: 'ml',
    longName: 'Millimiter',
  },
  {
    id: 14,
    shortName: 'lbs',
    longName: 'Pounds',
  },
  {
    id: 15,
    shortName: 'oz',
    longName: 'Ounce',
  },
  {
    id: 16,
    shortName: 'kg',
    longName: 'Kilogram',
  },
  {
    id: 17,
    shortName: 'g',
    longName: 'Gram',
  },
  {
    id: 18,
    shortName: 'mg',
    longName: 'Milligram',
  },
  {
    id: 19,
    shortName: 'mcg',
    longName: 'Microgram',
  },
  // {
  //   id: 20,
  //   shortName: 'IU',
  //   longName: 'International Unit',
  // },
  {
    id: 21,
    shortName: 'PRT',
    longName: 'Protein',
  },
  {
    id: 22,
    shortName: 'CHO',
    longName: 'Carbohydrate',
  },
  {
    id: 23,
    shortName: 'Cal',
    longName: 'Calories',
  },
  {
    id: 24,
    shortName: 'BMI',
    longName: 'Body Mass Index',
  },
  {
    id: 25,
    shortName: 'BMR',
    longName: 'Basal Metabolic Rate',
  },
  {
    id: 26,
    shortName: 'RTD',
    longName: 'Reps, Time, Distance',
  },
];

export default function AbbrevationsPage() {
  return <Abbrevations abbrevationList={abbrevationList} />;
  // }
}

AbbrevationsPage.propTypes = {};

export const AbbrevationsWrapper = connect(null, null)(AbbrevationsPage);
