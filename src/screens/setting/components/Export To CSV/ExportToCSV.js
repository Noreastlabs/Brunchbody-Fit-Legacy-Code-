/* eslint-disable no-unused-expressions */
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Switch,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import {
  Button,
  CustomHeader,
  CustomModal,
  PermissionModal,
  SafeAreaWrapper,
} from '../../../../components';
import {colors} from '../../../../resources';

export default function ExportToCSV(props) {
  const {
    navigation,
    listData,
    toggleSwitch,
    onExportHandler,
    entryType,
    permissionModal,
    setPermissionModal,
    alertHeading,
    alertText,
    password,
    setPassword,
    loader,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />
        <View style={styles.headingView}>
          <Text style={styles.headingText1}>Export To CSV</Text>
        </View>
        <View style={{paddingVertical: 10, marginHorizontal: 20}}>
          {listData.map(item => (
            <View key={item.id} style={styles.listView}>
              <Text style={styles.textStyle1}>{item.title}</Text>
              {item.options.map(option => (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.5}
                  style={styles.linkView}
                  onPress={() => {
                    item.screen ? navigation.navigate(item.screen) : {};
                  }}>
                  {option.type === 'toggle' ? (
                    <Switch
                      trackColor={{false: '#BBBBBB', true: '#0088D1'}}
                      thumbColor="#81D3F9"
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => toggleSwitch(option.value)}
                      value={entryType === option.value}
                      style={{marginRight: 10}}
                    />
                  ) : (
                    <View />
                  )}

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.textStyle2}>{option.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <View>
            <Text style={styles.textStyle1}>Password</Text>
            <TextInput
              secureTextEntry
              value={password}
              placeholder="Password"
              placeholderTextColor={colors.grey}
              onChangeText={text => setPassword(text)}
              style={styles.textInputStyle}
            />
            <View style={{padding: 20, paddingTop: 30}}>
              <Button
                loader={loader}
                title="Export"
                onPress={onExportHandler}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => setPermissionModal(false)}
        content={
          <PermissionModal
            isCancelBtn={false}
            heading={alertHeading}
            text={alertText}
            onDone={() => setPermissionModal(false)}
            onCancel={() => setPermissionModal(false)}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

ExportToCSV.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  listData: PropTypes.arrayOf(PropTypes.any).isRequired,
  toggleSwitch: PropTypes.func.isRequired,
  onExportHandler: PropTypes.func.isRequired,
  entryType: PropTypes.string.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
};
