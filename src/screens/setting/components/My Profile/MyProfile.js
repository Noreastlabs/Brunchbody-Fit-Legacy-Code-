/* eslint-disable consistent-return */
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './style';
import {colors} from '../../../../resources';
import {CustomHeader, SafeAreaWrapper} from '../../../../components';

const BMI_BADGE_STYLES = {
  danger: {backgroundColor: colors.danger},
  normal: {backgroundColor: colors.green},
  obese: {backgroundColor: colors.orange},
  overweight: {backgroundColor: colors.yellowish},
  underweight: {},
};

export default function MyProfile(props) {
  const {navigation, listData} = props;

  return (
    <SafeAreaWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>Profile</Text>
          <Text style={styles.headingText3}>Saved on this device only.</Text>
        </View>
        <View style={{paddingVertical: 10}}>
          {listData.map(item => (
            <View key={item.id} style={styles.listView}>
              <Text style={styles.textStyle1}>{item.title}</Text>
              {item.options.map(option => (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.5}
                  style={styles.linkView}
                  onPress={() => {
                    if (option.screen) {
                      navigation.navigate(option.screen);
                    }
                  }}>
                  {option.list?.length ? (
                    option.list.map(opt => (
                      <View
                        key={opt.id}
                        style={{
                          flex: 1,
                        }}>
                        <Text style={styles.textStyle2}>
                          {opt.name}
                        </Text>
                        <Text style={styles.textStyle2}>{opt.value}</Text>
                      </View>
                    ))
                  ) : option.badgeText ? (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.textStyle2}>{option.displayValue}</Text>
                      <Text
                        style={[
                          styles.BMIBadge,
                          BMI_BADGE_STYLES[option.badgeTone] || {},
                        ]}>
                        {option.badgeText}
                      </Text>
                      <AntDesign
                        name="right"
                        size={15}
                        style={[
                          styles.iconStyle,
                          {display: option.screen ? 'flex' : 'none'},
                        ]}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.textStyle2}>
                        {option.displayValue || option.name || '--'}
                      </Text>
                      <AntDesign
                        name="right"
                        size={15}
                        style={[
                          styles.iconStyle,
                          {display: option.screen ? 'flex' : 'none'},
                        ]}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

MyProfile.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  listData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};
