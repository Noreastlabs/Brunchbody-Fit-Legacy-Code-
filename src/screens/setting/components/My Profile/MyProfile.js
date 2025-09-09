/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
import React from 'react';
import {
  SafeAreaView,
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

export default function MyProfile(props) {
  const {navigation, listData, user} = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>My Profile</Text>
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
                    option.screen ? navigation.navigate(option.screen) : {};
                  }}>
                  {item.id === 6 ? (
                    (user.targetCalories || option.list).map(opt => (
                      <View
                        key={opt.id}
                        style={{
                          flex: 1,
                        }}>
                        <Text style={styles.textStyle2}>
                          {opt.name.toUpperCase()}
                        </Text>
                        <Text style={styles.textStyle2}>{opt.value}</Text>
                      </View>
                    ))
                  ) : item.title === 'BMI' ? (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.textStyle2}>{user.bmi}</Text>
                      {(() => {
                        switch (true) {
                          case user.bmi < 18.5:
                            return (
                              <Text style={styles.BMIBadge}>Underweight</Text>
                            );
                          case user.bmi >= 18.5 && user.bmi <= 24.9:
                            return (
                              <Text
                                style={[
                                  styles.BMIBadge,
                                  {backgroundColor: colors.green},
                                ]}>
                                Normal
                              </Text>
                            );
                          case user.bmi >= 25.0 && user.bmi <= 29.9:
                            return (
                              <Text
                                style={[
                                  styles.BMIBadge,
                                  {backgroundColor: colors.yellowish},
                                ]}>
                                Overweight
                              </Text>
                            );
                          case user.bmi >= 30.0 && user.bmi <= 34.9:
                            return (
                              <Text
                                style={[
                                  styles.BMIBadge,
                                  {backgroundColor: colors.orange},
                                ]}>
                                Obese
                              </Text>
                            );
                          case user.bmi > 35:
                            return (
                              <Text
                                style={[
                                  styles.BMIBadge,
                                  {backgroundColor: colors.danger},
                                ]}>
                                Danger
                              </Text>
                            );
                        }
                      })()}
                      <AntDesign
                        name="right"
                        size={15}
                        style={[
                          styles.iconStyle,
                          {display: option.screen !== '' ? 'flex' : 'none'},
                        ]}
                      />
                    </View>
                  ) : item.title === 'BMR' ? (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.textStyle2}>
                        {item.title === 'BMR' ? (
                          <Text style={styles.textStyle2}>
                            {user.bmr} CALORIES
                          </Text>
                        ) : (
                          option.name
                        )}
                      </Text>
                      <AntDesign
                        name="right"
                        size={15}
                        style={[
                          styles.iconStyle,
                          {display: option.screen !== '' ? 'flex' : 'none'},
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
                        {item.title === 'Current Weight'
                          ? `${user.weight} LBS`
                          : option.name}
                      </Text>
                      <AntDesign
                        name="right"
                        size={15}
                        style={[
                          styles.iconStyle,
                          {display: option.screen !== '' ? 'flex' : 'none'},
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
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  bmi: PropTypes.number.isRequired,
  bmr: PropTypes.node.isRequired,
};
