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
import {CustomHeader, SafeAreaWrapper} from '../../../../components';

export default function MyAccount(props) {
  // render() {
  const {navigation, listData} = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>My Account</Text>
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
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textStyle2}>{option.name}</Text>
                    <AntDesign
                      name="right"
                      size={15}
                      style={[
                        styles.iconStyle,
                        {display: option.screen !== '' ? 'flex' : 'none'},
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
  // }
}

MyAccount.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  listData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};
