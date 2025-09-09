/* eslint-disable arrow-body-style */
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
import {CustomHeader, SearchBar} from '../../../components';
import {colors} from '../../../resources';
import styles from './style';

let prevChar = '';

export default function TraitDirectory(props) {
  const navigation = useNavigation();
  const {directoryList, search, setSearch} = props;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <CustomHeader />

      <View style={[styles.setMargin, {marginBottom: 10}]}>
        <SearchBar
          value={search}
          onChangeText={text => {
            prevChar = '';
            setSearch(text);
          }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.setMargin3}>
          {directoryList
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(list =>
              list.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map(item => {
              let temp = false;
              if (item.name.charAt(0) !== prevChar) {
                temp = true;
                prevChar = item.name.charAt(0);
              }
              return (
                <>
                  {temp ? (
                    <View style={styles.alphaTagView}>
                      <Text style={styles.alphaTagText}>
                        {item.name.charAt(0)}
                      </Text>
                    </View>
                  ) : null}

                  <TouchableOpacity
                    activeOpacity={0.5}
                    key={item.id}
                    style={styles.directoryItemView}
                    onPress={() =>
                      navigation.navigate('DailyEntry', {
                        trait: item.name,
                      })
                    }>
                    <AntDesign
                      name="pluscircleo"
                      size={RFValue(20)}
                      color={colors.secondary}
                    />
                    <Text style={styles.directoryItemText}>{item.name}</Text>
                  </TouchableOpacity>
                </>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

TraitDirectory.propTypes = {
  directoryList: PropTypes.arrayOf(PropTypes.any).isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
};
