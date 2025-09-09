import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Headline, IconButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import { strings } from '../../../resources';
import { colors } from '../../../resources/colors';
import styles from './style';

const Writing = ({ showCalendarMenu, navigation, currentTheme }) => (
  <View style={styles.writingContainer}>
    <View
      style={{
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Headline style={{ color: colors.white }}>
        {strings.writingText.today}
      </Headline>
      {currentTheme?.name ? (
        <TouchableOpacity
          activeOpacity={currentTheme?.name ? 0.4 : 1}
          style={[
            styles.writingButtonContainer,
            { backgroundColor: currentTheme.color || colors.tertiary },
          ]}
          onPress={() =>
            currentTheme?.name ? navigation.navigate('Writing') : {}
          }
        >
          <Text style={styles.writingButton}>{currentTheme.name}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyDayView}>
          <Text style={styles.emptyDayText}>Empty</Text>
        </View>
      )}
      <Headline style={{ color: colors.white }}>
        {strings.writingText.day}
      </Headline>
    </View>

    <View
      style={{
        alignItems: 'flex-end',
      }}
    >
      <IconButton
        icon="dots-vertical"
        color={colors.white}
        onPress={showCalendarMenu}
        size={20}
      />
    </View>
  </View>
);

Writing.defaultProps = {
  currentTheme: {},
};

Writing.propTypes = {
  showCalendarMenu: PropTypes.func.isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  currentTheme: PropTypes.objectOf(PropTypes.any),
};
export default Writing;
