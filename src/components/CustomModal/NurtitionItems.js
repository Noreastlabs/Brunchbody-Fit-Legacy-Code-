import React, {Fragment} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import CloseButton from '../CloseButton';
import Button from '../Button';
import TextButton from '../TextButton';
import Dashed from '../Dashed';
import {colors} from '../../resources';
import styles from './NutritionStyle';

export default function NutritionsItems(props) {
  const {
    text,
    modalItems,
    onClose,
    isTwoColumn,
    onBtnPress,
    onDeleteBtnPress,
    showButton,
    loader,
  } = props;
  let fatCost = 0;
  let prtCost = 0;
  let choCost = 0;
  let calCost = 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{text}</Text>
        <CloseButton
          closeIconSize={25}
          iconColor={colors.nonEditableOverlays}
          style={{backgroundColor: colors.white}}
          onPress={onClose}
        />
      </View>
      {loader ? (
        <ActivityIndicator
          size="large"
          color={colors.white}
          style={{marginTop: 30}}
        />
      ) : isTwoColumn ? (
        <View style={styles.setMargin}>
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
          {modalItems.map(item => (
            <View style={styles.tableContainer} key={item.id}>
              <View style={styles.tableItem}>
                <Text style={styles.itemHeading}>{item.name}</Text>
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
        </View>
      ) : (
        <View style={styles.setMargin}>
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
          {modalItems.map((item, index) => {
            const lastIndex = modalItems.length - 1;
            fatCost += parseFloat(item.fat);
            prtCost += parseFloat(item.prt);
            choCost += parseFloat(item.cho);
            calCost += parseFloat(item.cal);

            return (
              <Fragment key={item.id}>
                <View style={styles.tableContainer}>
                  <View style={styles.tableItem}>
                    <Text style={styles.itemHeading}>{item.name}</Text>
                  </View>
                  <View style={styles.tableContent}>
                    <Text style={styles.bodytext}>
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
                {lastIndex === index ? (
                  <>
                    <View style={styles.setMargin2}>
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
                  </>
                ) : null}
              </Fragment>
            );
          })}
        </View>
      )}

      {showButton ? (
        <View style={styles.btnView}>
          <Button title="Edit" onPress={onBtnPress} />
        </View>
      ) : null}

      <View style={styles.bottomTextView}>
        <TextButton onPress={onDeleteBtnPress} title="Delete" />
      </View>
    </View>
  );
}

NutritionsItems.defaultProps = {
  modalItems: [],
  onClose: () => {},
  isTwoColumn: false,
  onBtnPress: () => {},
  onDeleteBtnPress: () => {},
  showButton: true,
  loader: false,
};

NutritionsItems.propTypes = {
  text: PropTypes.string.isRequired,
  modalItems: PropTypes.array,
  onClose: PropTypes.func,
  isTwoColumn: PropTypes.bool,
  onBtnPress: PropTypes.func,
  onDeleteBtnPress: PropTypes.func,
  showButton: PropTypes.bool,
  loader: PropTypes.bool,
};
