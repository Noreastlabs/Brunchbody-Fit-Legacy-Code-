/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {connect} from 'react-redux';
import {TermsOfUse} from '../../components';

export default function TermsOfUsePage() {
  return <TermsOfUse />;
  // }
}

TermsOfUsePage.propTypes = {};

export const TermsOfUseWrapper = connect(null, null)(TermsOfUsePage);
