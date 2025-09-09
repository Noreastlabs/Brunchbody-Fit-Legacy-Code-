import React from 'react';
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {CustomHeader, SafeAreaWrapper} from '../../../components';
import {colors} from '../../../resources';
import styles from './style';

export default function RoutineManager(props) {
  const navigation = useNavigation();
  const {route, myRoutineTasks, loader} = props;
  const {selectedItem} = route.params;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader
          isEdit
          onEditPress={() => navigation.navigate('EditRoutine', {selectedItem})}
        />

        <View style={styles.headingView}>
          <Text style={styles.subHeading2}>{selectedItem.name}</Text>
        </View>

        <View style={styles.setMargin}>
          {loader ? (
            <ActivityIndicator size="large" color={colors.white} />
          ) : (
            myRoutineTasks?.map(item => (
              <Text key={item.id} style={styles.textStyle3}>
                {item.name}
              </Text>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

RoutineManager.defaultProps = {
  route: {},
};

RoutineManager.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  myRoutineTasks: PropTypes.arrayOf(PropTypes.any).isRequired,
  loader: PropTypes.bool.isRequired,
};
