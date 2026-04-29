import React from 'react';
import {connect} from 'react-redux';
import {HelpAndSupport} from '../../components';

export default function HelpAndSupportPage() {
  return <HelpAndSupport />;
}

HelpAndSupportPage.propTypes = {};

export const HelpAndSupportWrapper = connect(null, null)(HelpAndSupportPage);
