import React, {Component} from 'react';
import {connect} from 'react-redux';
import Welcome from '../../components';

export class WelcomePage extends Component {
  render() {
    return <Welcome />;
  }
}

export const WelcomeWrapper = connect(null, null)(WelcomePage);
