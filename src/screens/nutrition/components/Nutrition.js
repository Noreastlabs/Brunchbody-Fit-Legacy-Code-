/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  AddButton,
  CalculationContent,
  ColorPickerContent,
  CreateItemContent,
  CustomModal,
  CustomOptions,
  NutritionItems,
  PermissionModal,
  TopTabs,
  SafeAreaWrapper,
} from '../../../components';
import { colors } from '../../../resources';
import CalorieCalculation from './CalorieCalculation';
import styles from './style';

export default function Nutrition(props) {
  const navigation = useNavigation();
  const {
    tab,
    onChangeHandler,
    myMeals,
    supplements,
    mealModalVisible,
    openMealModal,
    closeMealModal,
    meal,
    toggleCalModal,
    calculationModalVisible,
    openSupplementModal,
    closeSupplementModal,
    supplementModal,
    supplement,
    supplementItems,
    permissionModal,
    createItemModal,
    modalHeading,
    createItemFields,
    onAddBtnPress,
    colorPickerModal,
    color,
    onCreateItem,
    alertHeading,
    alertText,
    onDonePermissionModal,
    loader,
    mealItems,
    onChangeTitle,
    deleteLoader,
  } = props;
  const tabs = [
    {
      tab: 1,
      childView: (
        <AntDesign
          name="piechart"
          size={RFValue(45)}
          color={tab === 1 ? colors.white : colors.secondaryIcon}
        />
      ),
    },
    {
      tab: 2,
      childView: (
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={RFValue(45)}
          color={tab === 2 ? colors.white : colors.secondaryIcon}
        />
      ),
    },
    {
      tab: 3,
      childView: (
        <FontAwesome5
          name="flask"
          size={RFValue(45)}
          color={tab === 3 ? colors.white : colors.secondaryIcon}
        />
      ),
    },
  ];

  return (
    <SafeAreaWrapper>
      <ScrollView
        contentContainerStyle={{ 
          flexGrow: 1, 
          paddingBottom: RFValue(10)
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headingView}>
          <Text style={styles.headingText}>Nutrition</Text>
          <Text style={styles.subHeading1}>
            {tab === 1
              ? 'Calorie Calculation'
              : tab === 2
              ? 'Meals'
              : 'Supplements'}
          </Text>

          <View style={styles.topTabsView}>
            {tabs.map(item => (
              <>
                <TopTabs
                  childView={item.childView}
                  onPress={() =>
                    onChangeHandler({ name: 'tab', value: item.tab })
                  }
                />
                {item.tab < 3 ? <View style={styles.separator} /> : null}
              </>
            ))}
          </View>
        </View>

        {tab === 1 ? (
          <CalorieCalculation {...props} />
        ) : tab === 2 ? (
          <View style={styles.setMargin}>
            <Text style={styles.textStyle1}>My Meals</Text>
            <CustomOptions onOptionSelect={openMealModal} data={myMeals} />
            <AddButton onPress={() => onAddBtnPress('meal', 'Create Meal')} />
          </View>
        ) : (
          <View style={styles.setMargin}>
            <Text style={styles.textStyle1}>My Supplements</Text>
            <CustomOptions
              onOptionSelect={openSupplementModal}
              data={supplements}
            />
            <AddButton
              onPress={() =>
                onAddBtnPress('supplement', 'Create Supplement Stack')
              }
            />
          </View>
        )}
      </ScrollView>

      {/* Calculation Modal */}
      <CustomModal
        isVisible={calculationModalVisible}
        onDismiss={toggleCalModal}
        content={
          <CalculationContent
            {...props}
            onClose={toggleCalModal}
            text="Macro Recomendation"
          />
        }
      />

      {/* Meal Modal */}
      <CustomModal
        isVisible={mealModalVisible}
        onDismiss={closeMealModal}
        content={
          <NutritionItems
            loader={loader}
            text={meal.name}
            modalItems={mealItems}
            onClose={closeMealModal}
            showButton={true}
            onBtnPress={() => {
              closeMealModal();
              navigation.navigate('Meal', { meal });
            }}
            onDeleteBtnPress={() =>
              onChangeHandler({ name: 'permissionModal', value: true })
            }
          />
        }
      />

      {/* Supplement Modal */}
      <CustomModal
        isVisible={supplementModal}
        onDismiss={closeSupplementModal}
        content={
          <NutritionItems
            isTwoColumn
            loader={loader}
            text={supplement.name}
            modalItems={supplementItems}
            onClose={closeSupplementModal}
            onBtnPress={() => {
              closeSupplementModal();
              navigation.navigate('Supplement', { supplement });
            }}
            onDeleteBtnPress={() =>
              onChangeHandler({ name: 'permissionModal', value: true })
            }
          />
        }
      />

      {/* Create Meal/Supplement Modal */}
      <CustomModal
        isVisible={createItemModal}
        onDismiss={() =>
          onChangeHandler({ name: 'createItemModal', value: false })
        }
        content={
          <CreateItemContent
            loader={loader}
            color={color}
            heading={modalHeading}
            createItemFields={createItemFields}
            onChangeText={text => onChangeTitle({ name: 'title', value: text })}
            openColorPicker={() =>
              onChangeHandler({ name: 'colorPickerModal', value: true })
            }
            hideModal={() =>
              onChangeHandler({ name: 'createItemModal', value: false })
            }
            btnTitle="Create"
            onBtnPress={onCreateItem}
          />
        }
      />

      {/* Color Picker Modal */}
      <CustomModal
        isVisible={colorPickerModal}
        onDismiss={() =>
          onChangeHandler({ name: 'colorPickerModal', value: false })
        }
        content={
          <ColorPickerContent
            color={color}
            onChangeColor={newColor =>
              onChangeHandler({ name: 'color', value: newColor })
            }
            hideModal={() =>
              onChangeHandler({ name: 'colorPickerModal', value: false })
            }
            btnTitle="Save"
            onBtnPress={() =>
              onChangeHandler({ name: 'colorPickerModal', value: false })
            }
          />
        }
      />

      {/* Permission Modal */}
      <CustomModal
        isVisible={permissionModal}
        onDismiss={() =>
          onChangeHandler({ name: 'permissionModal', value: false })
        }
        content={
          <PermissionModal
            loader={deleteLoader}
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={onDonePermissionModal}
            onCancel={() =>
              onChangeHandler({ name: 'permissionModal', value: false })
            }
          />
        }
      />
    </SafeAreaWrapper>
  );
}

Nutrition.propTypes = {
  tab: PropTypes.number.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  myMeals: PropTypes.arrayOf(PropTypes.any).isRequired,
  supplements: PropTypes.arrayOf(PropTypes.any).isRequired,
  onNavigate: PropTypes.func.isRequired,
  mealModalVisible: PropTypes.bool.isRequired,
  openMealModal: PropTypes.func.isRequired,
  closeMealModal: PropTypes.func.isRequired,
  meal: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleCalModal: PropTypes.func.isRequired,
  calculationModalVisible: PropTypes.bool.isRequired,
  openSupplementModal: PropTypes.func.isRequired,
  closeSupplementModal: PropTypes.func.isRequired,
  supplementModal: PropTypes.bool.isRequired,
  supplement: PropTypes.objectOf(PropTypes.any).isRequired,
  supplementItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  permissionModal: PropTypes.bool.isRequired,
  createItemModal: PropTypes.bool.isRequired,
  modalHeading: PropTypes.string.isRequired,
  createItemFields: PropTypes.arrayOf(PropTypes.any).isRequired,
  onAddBtnPress: PropTypes.func.isRequired,
  colorPickerModal: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  onCreateItem: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
  mealItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  deleteLoader: PropTypes.bool.isRequired,
};
