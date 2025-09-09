import React, {Fragment} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Dashed from '../Dashed';
import {colors} from '../../resources';
import styles from './style';
import AddButton from '../AddButton';

export default function CustomTable(props) {
  const {data, isEditable, showEditModal, isTwoColumn, onAddBtnPress} = props;
  let fatCost = 0;
  let prtCost = 0;
  let choCost = 0;
  let calCost = 0;

  return (
    <View>
      {isTwoColumn ? (
        <>
          <View style={styles.tableContainer}>
            <View style={styles.tableItem} />
            <View style={styles.tableContent} />
            <View style={styles.tableContent} />

            <View style={styles.tableContent}>
              <Text style={styles.item}>QTY</Text>
            </View>
            <View style={styles.tableContent}>
              <Text style={styles.item}>UNT</Text>
            </View>
          </View>
          {data?.map(item => (
            <View style={styles.tableContainer2} key={item.id}>
              <View style={styles.tableItem}>
                {isEditable ? (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => showEditModal(item)}>
                    <Text
                      style={[styles.itemHeading, {color: colors.tertiary}]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.itemHeading}>{item.name}</Text>
                )}
              </View>

              <View style={styles.tableContent} />
              <View style={styles.tableContent} />

              <View style={styles.tableContent}>
                <Text style={styles.bodytext}>
                  {Math.round(item.qty * 100) / 100}
                </Text>
              </View>
              <View style={styles.tableContent}>
                <Text style={styles.bodytext}>{item.unt}</Text>
              </View>
            </View>
          ))}
        </>
      ) : (
        <>
          <View>
            <View style={styles.tableContainer}>
              <View style={styles.tableItem} />
              <View style={styles.tableContent}>
                <Text style={styles.item}>FAT</Text>
              </View>
              <View style={styles.tableContent}>
                <Text style={styles.item}>PRT</Text>
              </View>
              <View style={styles.tableContent}>
                <Text style={styles.item}>CHO</Text>
              </View>
              <View style={styles.tableContent}>
                <Text style={styles.item}>CAL</Text>
              </View>
            </View>
            {data?.map(item => {
              fatCost += parseFloat(item.fat);
              prtCost += parseFloat(item.prt);
              choCost += parseFloat(item.cho);
              calCost += parseFloat(item.cal);

              return (
                <Fragment key={item.id}>
                  <View style={styles.tableContainer2}>
                    <View style={styles.tableItem}>
                      {isEditable ? (
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => showEditModal(item)}>
                          <Text
                            style={[
                              styles.itemHeading,
                              {color: colors.tertiary},
                            ]}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.itemHeading}>{item.name}</Text>
                      )}
                    </View>
                    <View style={styles.tableContent}>
                      <Text style={styles.bodytext}>
                        {/* To round off a number to two decimal places if needed  */}
                        {Math.round(item.fat * 100) / 100}
                      </Text>
                    </View>
                    <View style={styles.tableContent}>
                      <Text style={styles.bodytext}>
                        {Math.round(item.prt * 100) / 100}
                      </Text>
                    </View>
                    <View style={styles.tableContent}>
                      <Text style={styles.bodytext}>
                        {Math.round(item.cho * 100) / 100}
                      </Text>
                    </View>
                    <View style={styles.tableContent}>
                      <Text style={styles.bodytext}>
                        {Math.round(item.cal * 100) / 100}
                      </Text>
                    </View>
                  </View>
                </Fragment>
              );
            })}
          </View>

          <View>
            <View style={styles.setMargin2}>
              <AddButton onPress={onAddBtnPress} />
            </View>
            <View style={styles.setMargin3}>
              <Dashed />
            </View>
            <View style={styles.tableContainer}>
              <View style={styles.tableItem}>
                <Text style={styles.item}>Total</Text>
              </View>
              <View style={styles.tableContent}>
                <Text style={styles.bodytext2}>
                  {Math.round(fatCost * 100) / 100}
                </Text>
              </View>
              <View style={styles.tableContent}>
                <Text style={styles.bodytext2}>
                  {Math.round(prtCost * 100) / 100}
                </Text>
              </View>
              <View style={styles.tableContent}>
                <Text style={styles.bodytext2}>
                  {Math.round(choCost * 100) / 100}
                </Text>
              </View>
              <View style={styles.tableContent}>
                <Text style={styles.bodytext2}>
                  {Math.round(calCost * 100) / 100}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

CustomTable.defaultProps = {
  showEditModal: () => {},
  isEditable: false,
  isTwoColumn: false,
  onAddBtnPress: () => {},
};

CustomTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  showEditModal: PropTypes.func,
  isEditable: PropTypes.bool,
  isTwoColumn: PropTypes.bool,
  onAddBtnPress: PropTypes.func,
};
