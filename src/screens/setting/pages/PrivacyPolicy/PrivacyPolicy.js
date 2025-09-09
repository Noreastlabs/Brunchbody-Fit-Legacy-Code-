/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {connect} from 'react-redux';
import {PrivacyPolicy} from '../../components';

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}

PrivacyPolicyPage.propTypes = {};

export const PrivacyPolicyWrapper = connect(null, null)(PrivacyPolicyPage);
