import React from 'react';
import {connect} from 'react-redux';
import {PrivacyAndData} from '../../components';

export default function PrivacyAndDataPage() {
  return <PrivacyAndData />;
}

PrivacyAndDataPage.propTypes = {};

export const PrivacyAndDataWrapper = connect(null, null)(PrivacyAndDataPage);
