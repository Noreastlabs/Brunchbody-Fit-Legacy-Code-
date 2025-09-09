import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {strings} from '../../../resources';
import style from './style';

function Details(props) {
  const {user, currentTheme} = props;

  return (
    <View style={{flex: 1}}>
      <View style={style.row}>
        <Text style={style.detailsText}>
          {strings.dashboard.details.greetings}
        </Text>
        <Text style={style.detailsText}> {user.name}</Text>
      </View>

      <View style={style.row}>
        <Text style={style.detailsText}>{strings.dashboard.details.today}</Text>
        {currentTheme?.name ? (
          <View style={{flexWrap: 'wrap'}}>
            <View
              style={[
                style.themeContainer,
                {backgroundColor: currentTheme.color},
              ]}>
              <Text style={style.themeText}>
                {currentTheme?.name || 'Empty'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={style.emptyDayView}>
            <Text style={style.emptyDayText}>
              {strings.dashboard.details.empty}
            </Text>
          </View>
        )}
        <Text style={style.detailsText}>{strings.dashboard.details.day}</Text>
      </View>
    </View>
  );
}

Details.defaultProps = {
  currentTheme: {},
};

Details.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  currentTheme: PropTypes.objectOf(PropTypes.any),
};

export default Details;
