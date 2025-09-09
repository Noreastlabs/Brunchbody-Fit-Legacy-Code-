/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AddButton,
  Button,
  CreateItemContent,
  CustomHeader,
  CustomModal,
  Dashed,
  NutritionItems,
  PermissionModal,
  ProgramDetailModal,
  SelectModalContent,
  TextButton,
  SafeAreaWrapper,
} from '../../../components';
import { colors } from '../../../resources';
import styles from './style';

export default function Calories(props) {
  const {
    loader,
    modalLoader,
    mealsData,
    completedWorkoutData,
    isVisible,
    setIsVisible,
    selectOptions,
    selectedOption,
    setSelectedOption,
    selectMealModal,
    setSelectMealModal,
    onChooseOption,
    createItemModal,
    setCreateItemModal,
    createItemFields,
    permissionModal,
    setPermissionModal,
    mealItems,
    mealModalVisible,
    setMealModalVisible,
    entryName,
    setEntryName,
    note,
    setNote,
    onSaveHandler,
    selectedMeal,
    setSelectedMeal,
    disabled,
    setDisabled,
    heading,
    subText,
    onAddCaloriesOut,
    showTable,
    isProgramDetailModal,
    setIsProgramDetailModal,
    onCompletedWorkoutPress,
    selectedMeals,
    onMealSelect,
    deleteCheck,
    setDeleteCheck,
    onRemoveMeal,
    onRemoveCompletedWorkout,
    alertHeading,
    alertText,
    onDonePermissionModal,
    onChangeText,
    onCreateSingleItem,
    setCheck,
    onPressSelectedMeal,
    user,
    completedWorkout,
    totalFatFromMeals,
    totalProteinFromMeals,
    totalCarbsFromMeals,
    totalCaloriesFromMeals,
    bmr,
    calFromExe,
    btnLoader,
  } = props;

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomHeader />

        <View style={styles.headingView}>
          <Text style={styles.headingText2}>Calories In / Out</Text>
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Entry Name</Text>
          <TextInput
            value={entryName}
            editable={false}
            placeholder="<Date> Calories In / Out"
            placeholderTextColor={colors.grey}
            onChangeText={text => setEntryName(text)}
            style={[styles.textInputStyle, { color: colors.grey }]}
          />
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Target Calories</Text>
          {user.targetCalories
            .filter(a => a.name === 'cal')
            .map(item => (
              <TextInput
                editable={false}
                value={item.value}
                placeholder="<Autofill from Profile>"
                placeholderTextColor={colors.grey}
                style={styles.textInputStyle}
              />
            ))}
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Target Macros</Text>
          <View style={styles.flexRowView}>
            {user.targetCalories
              .filter(a => a.name !== 'cal')
              .map(item => (
                <View key={item.id} style={styles.mapItemView}>
                  <TextInput
                    editable={false}
                    value={item.value}
                    placeholder="<Autofill>"
                    placeholderTextColor={colors.grey}
                    style={[styles.textInputStyle, { textAlign: 'center' }]}
                  />
                  <View style={styles.setMargin2}>
                    <Text style={styles.contentStyle}>
                      {item.name.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Actual Calories</Text>
          {selectedMeals.map(item => (
            <View key={item.id}>
              <Button
                title={item.name}
                onPress={() => onPressSelectedMeal(item)}
                titleStyle={styles.btnTitle}
                style={[styles.btnStyle2, { backgroundColor: item.color }]}
              />
              <View style={styles.flexRowView}>
                {/* {item.options.map(i => (
                  <View key={i.id} style={styles.mapItemView}>
                    <TextInput
                      editable={false}
                      value={i.amount}
                      placeholder="<Autofill>"
                      placeholderTextColor={colors.grey}
                      style={[styles.textInputStyle, {textAlign: 'center'}]}
                    />
                    <View style={styles.setMargin2}>
                      <Text style={styles.contentStyle}>{i.text}</Text>
                    </View>
                  </View>
                ))} */}
              </View>
            </View>
          ))}
          <AddButton
            onPress={() => {
              setIsVisible(true);
              setCheck('addMeal');
            }}
          />
        </View>

        <View style={styles.setMargin1}>
          <Dashed />
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Output</Text>
          <View style={[styles.flexRowView, styles.setMargin2]}>
            <Text style={styles.contentStyle}>BMR Calorie Output</Text>
            <Text style={styles.boldText}>{bmr}</Text>
          </View>
          <View style={styles.setMargin2}>
            <Text style={styles.headingText3}>COMPLETED WORKOUTS</Text>
          </View>
          {completedWorkoutData.map((item, index) => (
            <View key={item.id} style={styles.flexRowView2}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => onCompletedWorkoutPress(item, index)}
              >
                <Text style={styles.contentStyle2}>{item.name}</Text>
              </TouchableOpacity>
              <Text style={styles.boldText}>{item.totalCal}</Text>
            </View>
          ))}
          <AddButton onPress={onAddCaloriesOut} />
        </View>

        <View style={styles.setMargin1}>
          <Dashed />
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Total</Text>
          <View style={styles.flexRowView2}>
            <Text style={styles.boldText2}>Total Calories In</Text>
            <Text style={styles.boldText}>
              {totalCaloriesFromMeals.toFixed(2)}
            </Text>
          </View>
          <View style={styles.flexRowView2}>
            <Text style={styles.contentStyle}>Total Fat (g)</Text>
            <Text style={styles.boldText}>{totalFatFromMeals.toFixed(2)}</Text>
          </View>
          <View style={styles.flexRowView2}>
            <Text style={styles.contentStyle}>Total Protein (g)</Text>
            <Text style={styles.boldText}>
              {totalProteinFromMeals.toFixed(2)}
            </Text>
          </View>
          <View style={styles.flexRowView2}>
            <Text style={styles.contentStyle}>Total Carbs (g)</Text>
            <Text style={styles.boldText}>
              {totalCarbsFromMeals.toFixed(2)}
            </Text>
          </View>
          <View style={styles.flexRowView2}>
            <Text style={styles.boldText2}>Total Calories Out</Text>
            <Text style={styles.boldText}>
              {(parseFloat(bmr, 10) + parseFloat(calFromExe, 10)).toFixed(2)}
            </Text>
          </View>
          <View style={styles.flexRowView2}>
            <Text style={styles.contentStyle}>BMR Calorie Output</Text>
            <Text style={styles.boldText}>{bmr}</Text>
          </View>
          <View style={styles.flexRowView2}>
            <Text style={styles.contentStyle}>Calories From Exercise</Text>
            <Text style={styles.boldText}>
              {parseFloat(calFromExe, 10).toFixed(2)}
            </Text>
          </View>
          <View style={styles.flexRowView2}>
            <Text style={styles.boldText2}>Calories Difference</Text>
            <Text style={styles.boldText}>
              {(
                totalCaloriesFromMeals -
                (parseFloat(bmr, 10) + parseFloat(calFromExe, 10))
              ).toFixed(2)}
            </Text>
          </View>
          <View style={styles.flexRowView2}>
            <Text style={styles.contentStyle}>Calories Differential</Text>
            <Text style={styles.boldText}>
              {(
                totalCaloriesFromMeals /
                (parseFloat(bmr, 10) + parseFloat(calFromExe, 10))
              ).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.setMargin1}>
          <Dashed />
        </View>

        <View style={styles.setMargin}>
          <Text style={styles.textStyle1}>Note</Text>
          <TextInput
            multiline
            value={note}
            placeholder="Notes"
            style={styles.textArea}
            placeholderTextColor={colors.grey}
            onChangeText={text => setNote(text)}
          />
        </View>

        <View style={styles.btnView}>
          <Button loader={loader} title="Save" onPress={onSaveHandler} />
        </View>

        <TouchableOpacity activeOpacity={0.5} style={styles.bottomTextView}>
          <TextButton
            title="Clear Entry"
            onPress={() => {
              setPermissionModal(true);
              setCheck('clearEntry');
            }}
          />
        </TouchableOpacity>
      </ScrollView>

      <CustomModal
        isVisible={isVisible}
        onDismiss={() => setIsVisible(false)}
        content={
          <SelectModalContent
            select
            heading="Add Calories"
            subHeading="Select"
            selectOptions={selectOptions}
            selected={selectedOption}
            onOptionSelect={setSelectedOption}
            hideModal={() => setIsVisible(false)}
            btnTitle="Next"
            onBtnPress={onChooseOption}
          />
        }
      />

      {/* Meal selection from meals list */}
      <CustomModal
        isVisible={selectMealModal}
        onDismiss={() => setSelectMealModal(false)}
        content={
          <SelectModalContent
            btnLoader={btnLoader}
            heading="Select Meal"
            options={mealsData}
            selectedOption={selectedMeal}
            onOptionSelect={item => {
              setSelectedMeal(item);
              setDisabled(false);
            }}
            hideModal={() => setSelectMealModal(false)}
            btnTitle="Select"
            disabled={disabled}
            onBtnPress={onMealSelect}
          />
        }
      />

      {/* Create Item Modal */}
      <CustomModal
        isVisible={createItemModal}
        onDismiss={() => setCreateItemModal(false)}
        content={
          <CreateItemContent
            heading={heading}
            createItemFields={createItemFields}
            onChangeText={onChangeText}
            hideModal={() => setCreateItemModal(false)}
            btnTitle="Add"
            onBtnPress={onCreateSingleItem}
          />
        }
      />

      {/* Meal Detail Modal */}
      <CustomModal
        isVisible={mealModalVisible}
        onDismiss={() => setMealModalVisible(false)}
        content={
          <NutritionItems
            loader={modalLoader}
            text={selectedMeal.name}
            modalItems={
              selectedMeal?.items?.length > 0
                ? selectedMeal?.items
                : [selectedMeal]
            }
            onClose={() => setMealModalVisible(false)}
            showButton={false}
            onDeleteBtnPress={() => {
              setPermissionModal(true);
              setDeleteCheck('removeMeal');
            }}
          />
        }
      />

      {/* View Program Detail Modal */}
      <CustomModal
        isVisible={isProgramDetailModal}
        onDismiss={() => setIsProgramDetailModal(false)}
        content={
          <ProgramDetailModal
            heading={heading}
            subHeading={subText}
            showTable={showTable}
            programData={completedWorkout}
            btnTitle=""
            hideModal={() => setIsProgramDetailModal(false)}
            isDeleteBtn
            onDeleteBtnPress={() => {
              setPermissionModal(true);
              setDeleteCheck('removeWorkout');
            }}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => {
          setPermissionModal(false);
          setCheck('');
        }}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            isCancelBtn={
              alertHeading !== 'Success!' && alertHeading !== 'Error!'
            }
            onDone={
              deleteCheck === 'removeMeal'
                ? onRemoveMeal
                : deleteCheck === 'removeWorkout'
                ? onRemoveCompletedWorkout
                : onDonePermissionModal
            }
            onCancel={() => {
              setPermissionModal(false);
              setCheck('');
            }}
          />
        }
      />
    </SafeAreaWrapper>
  );
}

Calories.propTypes = {
  loader: PropTypes.bool.isRequired,
  modalLoader: PropTypes.bool.isRequired,
  mealsData: PropTypes.arrayOf(PropTypes.any).isRequired,
  completedWorkoutData: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  isVisible: PropTypes.bool.isRequired,
  setIsVisible: PropTypes.func.isRequired,
  selectedOption: PropTypes.string.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  selectMealModal: PropTypes.bool.isRequired,
  setSelectMealModal: PropTypes.func.isRequired,
  onChooseOption: PropTypes.func.isRequired,
  createItemModal: PropTypes.bool.isRequired,
  setCreateItemModal: PropTypes.func.isRequired,
  createItemFields: PropTypes.arrayOf(PropTypes.any).isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  mealItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  mealModalVisible: PropTypes.bool.isRequired,
  setMealModalVisible: PropTypes.func.isRequired,
  entryName: PropTypes.string.isRequired,
  setEntryName: PropTypes.func.isRequired,
  note: PropTypes.string.isRequired,
  setNote: PropTypes.func.isRequired,
  onSaveHandler: PropTypes.func.isRequired,
  selectedMeal: PropTypes.string.isRequired,
  setSelectedMeal: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  setDisabled: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  onAddCaloriesOut: PropTypes.func.isRequired,
  showTable: PropTypes.bool.isRequired,
  isProgramDetailModal: PropTypes.bool.isRequired,
  setIsProgramDetailModal: PropTypes.func.isRequired,
  onCompletedWorkoutPress: PropTypes.func.isRequired,
  selectedMeals: PropTypes.func.isRequired,
  onMealSelect: PropTypes.func.isRequired,
  deleteCheck: PropTypes.string.isRequired,
  setDeleteCheck: PropTypes.func.isRequired,
  onRemoveMeal: PropTypes.func.isRequired,
  onRemoveCompletedWorkout: PropTypes.func.isRequired,
  alertHeading: PropTypes.string.isRequired,
  alertText: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onCreateSingleItem: PropTypes.func.isRequired,
  setCheck: PropTypes.func.isRequired,
  onPressSelectedMeal: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  completedWorkout: PropTypes.objectOf(PropTypes.any).isRequired,
  totalFatFromMeals: PropTypes.number.isRequired,
  totalProteinFromMeals: PropTypes.number.isRequired,
  totalCarbsFromMeals: PropTypes.number.isRequired,
  totalCaloriesFromMeals: PropTypes.number.isRequired,
  bmr: PropTypes.number.isRequired,
  calFromExe: PropTypes.number.isRequired,
  btnLoader: PropTypes.bool.isRequired,
};
