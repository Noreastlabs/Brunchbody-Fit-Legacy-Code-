import React from 'react';
import {Text, View, ScrollView, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import Feather from 'react-native-vector-icons/Feather';
import {CustomHeader, SearchBar, SafeAreaWrapper  } from '../../../components';
import {colors} from '../../../resources';
import styles from './style';

export default function MealsList(props) {
  const navigation = useNavigation();
  const {search, setSearch, mealCategories} = props;
  console.log('mealCategories', mealCategories);
  return (
    <SafeAreaWrapper>
      <CustomHeader />

      <View style={[styles.setMargin]}>
        <SearchBar
          value={search}
          onChangeText={text => {
            setSearch(text);
          }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.setMargin2}>
          {mealCategories
            .sort((a, b) => a.category.localeCompare(b.category))
            .filter(list =>
              list.category.toLowerCase().includes(search.toLowerCase()),
            )
            .map(item => (
              <TouchableOpacity
                activeOpacity={0.5}
                key={item.id}
                style={[
                  styles.directoryItemView,
                  {justifyContent: 'space-between'},
                ]}
                onPress={() =>
                  navigation.navigate('MealDirectory', {type: item.category})
                }>
                <Text style={[styles.directoryItemText, {marginLeft: 0}]}>
                  {item.category}
                </Text>
                <Feather
                  name="chevron-right"
                  size={RFValue(20)}
                  color={colors.white}
                />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

MealsList.defaultProps = {};

MealsList.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  mealCategories: PropTypes.arrayOf(PropTypes.any).isRequired,
};
