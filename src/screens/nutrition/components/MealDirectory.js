import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {CustomHeader, SearchBar, SafeAreaWrapper} from '../../../components';
import {colors} from '../../../resources';
import styles from './style';

let prevChar = '';

export default function MealDirectory(props) {
  const navigation = useNavigation();
  const {directoryList, search, setSearch, route} = props;
  const {type} = route.params;

  return (
    <SafeAreaWrapper>
      <CustomHeader />

      <View style={[styles.setMargin, {marginBottom: 10}]}>
        <SearchBar
          value={search}
          onChangeText={text => {
            prevChar = '';
            setSearch(text);
          }}
        />

        <View style={styles.typeView}>
          <Text style={styles.typeText}>{type}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.setMargin2}>
          {directoryList
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(list =>
              list.type.toLowerCase().includes(type.toLowerCase()),
            )
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
                      navigation.navigate('MealDetail', {meal: item})
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
    </SafeAreaWrapper>
  );
}

MealDirectory.defaultProps = {
  route: {},
};

MealDirectory.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  directoryList: PropTypes.arrayOf(PropTypes.any).isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
};
