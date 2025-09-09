import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../resources';
import Dashed from '../Dashed';
import styles from './style';

export default function ProgramTable(props) {
  const { data, isModal, onEditExercise, note } = props;
  let calCost = 0;

  return (
    <View>
      <View style={styles.totalItemsView}>
        <Text style={[styles.tableHeadingStyle, { width: '40%' }]}>
          Exercise
        </Text>
        <Text style={[styles.tableHeadingStyle, { textAlign: 'center' }]}>
          Set
        </Text>
        <Text style={[styles.tableHeadingStyle, { textAlign: 'center' }]}>
          RTD
        </Text>
        <Text style={[styles.tableHeadingStyle, { textAlign: 'right' }]}>
          Cal
        </Text>
      </View>

      {data?.map((item, index) => {
        if (item.cal) calCost += parseFloat(item.cal, 10);

        if (
          item?.type?.toLowerCase() == 'superset' &&
          item?.supersetOptions?.length === 0
        ) {
          return null;
        }

        return (
          <View key={index}>
            <View style={styles.totalItemsView}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={{ width: '40%' }}
                onPress={() => onEditExercise(item.type, index)}
              >
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: isModal ? colors.white : colors.tertiary,
                      width: '100%',
                    },
                  ]}
                >
                  {item.exercise || 'Superset'}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.textStyle2, { textAlign: 'center' }]}>
                {item.set}
              </Text>
              <Text style={[styles.textStyle2, { textAlign: 'center' }]}>
                {item.rtd}
              </Text>
              <Text style={[styles.textStyle2, { textAlign: 'right' }]}>
                {item.cal && Math.round(parseFloat(item.cal, 10) * 100) / 100}
              </Text>
            </View>

            {item.supersetOptions && item?.supersetOptions?.length > 0 ? (
              <View style={styles.totalItemsView1}>
                {item.supersetOptions.map((i, index) => {
                  calCost += parseFloat(i.cal, 10);

                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: index !== 0 ? 15 : 0,
                      }}
                    >
                      <Text
                        style={[
                          styles.textStyle,
                          { color: isModal ? colors.white : colors.textGrey },
                        ]}
                      >
                        {i.exercise}
                      </Text>
                      <Text
                        style={[styles.textStyle2, { textAlign: 'center' }]}
                      >
                        {i.set}
                      </Text>
                      <Text
                        style={[styles.textStyle2, { textAlign: 'center' }]}
                      >
                        {i.amount} {i.unit}
                      </Text>
                      <Text style={[styles.textStyle2, { textAlign: 'right' }]}>
                        {Math.round(parseFloat(i.cal, 10) * 100) / 100}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        );
      })}

      <View style={styles.setMargin1}>
        <Dashed />
      </View>

      <View style={styles.totalItemsView2}>
        <Text style={styles.tableHeadingStyle}>Total</Text>
        <Text style={styles.totalText}>
          {Math.round(parseFloat(calCost, 10) * 100) / 100}
        </Text>
      </View>

      {note ? (
        <View style={styles.flexRowView}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => onEditExercise()}
          >
            <Text
              style={[
                styles.noteHeading,
                { color: isModal ? colors.white : colors.tertiary },
              ]}
            >
              Note:
            </Text>
          </TouchableOpacity>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      ) : null}
    </View>
  );
}

ProgramTable.defaultProps = {
  isModal: false,
  note: '',
  onEditExercise: () => {},
};

ProgramTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  isModal: PropTypes.bool,
  note: PropTypes.string,
  onEditExercise: PropTypes.func,
};
