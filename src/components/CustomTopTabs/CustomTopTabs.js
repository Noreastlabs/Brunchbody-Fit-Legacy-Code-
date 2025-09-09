import React from 'react';
import {Text, ScrollView, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../../resources';
import styles from './style';

export default function CustomTopTabs(props) {
  const {data, selectedTab, setSelectedTab} = props;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}>
      {data.map(item => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.4}
          style={styles.container}
          onPress={() => setSelectedTab(item.id)}>
          <Text
            style={[
              styles.textStyle,
              {
                color:
                  selectedTab === item.id
                    ? colors.secondary
                    : colors.nonEditableOverlays,
              },
            ]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

CustomTopTabs.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectedTab: PropTypes.number.isRequired,
  setSelectedTab: PropTypes.func.isRequired,
};
