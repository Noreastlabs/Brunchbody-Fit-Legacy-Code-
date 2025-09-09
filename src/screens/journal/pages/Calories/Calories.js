import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  addJournalEntry,
  editJournalEntry,
  getJournalEntries,
  getMealItems,
  getWorkouts,
} from '../../../../redux/actions';
import { colors } from '../../../../resources';
import { Calories } from '../../components';

const selectOptions = [
  { id: 1, option: 'FROM MEALS' },
  { id: 2, option: 'SINGLE ITEM' },
];

const createItems = [
  {
    id: 1,
    value: '',
    fieldName: 'Item Name',
    placeholder: 'Enter Name',
    state: 'itemName',
  },
  {
    id: 2,
    value: '',
    fieldName: 'Enter Fat (Grams)',
    placeholder: 'Amount Fat (g)',
    keyboardType: 'decimal-pad',
    state: 'itemFat',
  },
  {
    id: 3,
    value: '',
    fieldName: 'Enter Protein (Grams)',
    placeholder: 'Amount Protein (g)',
    keyboardType: 'decimal-pad',
    state: 'itemProtein',
  },
  {
    id: 4,
    value: '',
    fieldName: 'Enter Carbs (Grams)',
    placeholder: 'Amount Carbs (g)',
    keyboardType: 'decimal-pad',
    state: 'itemCarbs',
  },
];

const addCaloriesOutFields = [
  {
    id: 1,
    value: '',
    fieldName: 'Amount',
    placeholder: 'Amount',
    keyboardType: 'decimal-pad',
    state: 'additionalCalories',
  },
];

export default function CaloriesPage(props) {
  const {
    route,
    navigation,
    onCreateEntry,
    getAllJournalEntries,
    myMeals,
    onGetMealItems,
    myMealItems,
    onEditEntry,
    onGetMyWorkouts,
    myCompletedWorkouts,
    user,
  } = props;

  console.log(myCompletedWorkouts, 'myCompletedWorkoutmyCompletedWorkoutss');
  const { entryData, entryId } = route.params;
  const [loader, setLoader] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectMealModal, setSelectMealModal] = useState(false);
  const [createItemModal, setCreateItemModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState('FROM MEALS');
  const [createItemFields, setCreateItemFields] = useState(createItems);
  const [permissionModal, setPermissionModal] = useState(false);
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [isProgramDetailModal, setIsProgramDetailModal] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [heading, setHeading] = useState('');
  const [subText, setSubText] = useState('');
  const [entryName, setEntryName] = useState(
    moment(entryData.date, 'YYYY/MM/DD').format('M/DD/YYYY'),
  );
  const [note, setNote] = useState(entryData.note || '');
  const [deleteCheck, setDeleteCheck] = useState('');
  const [completedWorkout, setCompletedWorkout] = useState(null);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [additionalCalories, setAdditionalCalories] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemFat, setItemFat] = useState('');
  const [itemProtein, setItemProtein] = useState('');
  const [itemCarbs, setItemCarbs] = useState('');
  const [check, setCheck] = useState('');
  const [totalFatFromMeals, setTotalFatFromMeals] = useState(0);
  const [totalProteinFromMeals, setTotalProteinFromMeals] = useState(0);
  const [totalCarbsFromMeals, setTotalCarbsFromMeals] = useState(0);
  const [totalCaloriesFromMeals, setTotalCaloriesFromMeals] = useState(0);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [completedWorkoutData, setCompletedWorkoutData] = useState([]);
  const [completedWorkoutIndex, setCompletedWorkoutIndex] = useState(null);
  const [bmr, setBmr] = useState(entryData.bmr || user.bmr);
  const [calFromExe, setCalFromExe] = useState(0);
  const [btnLoader, setBtnLoader] = useState(false);

  const onChangeText = (text, itemState) => {
    if (itemState === 'additionalCalories') {
      setAdditionalCalories(text);
      addCaloriesOutFields[0].value = text;
    }
    if (itemState === 'itemName') {
      setItemName(text);
      createItems[0].value = text;
    }
    if (itemState === 'itemFat') {
      setItemFat(text);
      createItems[1].value = text;
    }
    if (itemState === 'itemProtein') {
      setItemProtein(text);
      createItems[2].value = text;
    }
    if (itemState === 'itemCarbs') {
      setItemCarbs(text);
      createItems[3].value = text;
    }
  };

  const getMyWorkouts = async () => {
    const temp = [];
    const d = entryData.date || new Date();
    const filteredWorkouts = [...myCompletedWorkouts].filter(i => {
      if (i.completedDate === moment(d, 'YYYY/MM/DD').format('YYYY-MM-DD'))
        return i;
    });
    if (entryData?.completedWorkouts?.length > 0) {
      setCompletedWorkoutData(entryData.completedWorkouts);
      let calSum = 0;

      for (let i = 0; i < entryData.completedWorkouts.length; i += 1) {
        const item = entryData.completedWorkouts[i];

        calSum += parseFloat(item.totalCal, 10);
      }

      setCalFromExe(calSum);
    } else {
      [...filteredWorkouts].map(i => {
        let calSum = 0;

        i.plan.map(p => {
          if (p.cal) calSum += parseFloat(p.cal, 10);

          if (p.supersetOptions?.length > 0) {
            p.supersetOptions.map(a => {
              calSum += parseFloat(a.cal, 10);
            });
          }
        });

        temp.push({
          ...i,
          totalCal: Math.round(parseFloat(calSum, 10) * 100) / 100,
        });
      });

      setCompletedWorkoutData(temp);
      setCalFromExe(temp.reduce((sum, i) => sum + i.totalCal, 0));
    }
  };

  const calculateActualCalories = async () => {
    if (entryData?.actualCalories?.length > 0) {
      setSelectedMeals(entryData.actualCalories);

      let fatSum = 0;
      let prtSum = 0;
      let carbsSum = 0;
      let calSum = 0;

      for (let i = 0; i < entryData.actualCalories.length; i += 1) {
        const meal = entryData.actualCalories[i];

        if (meal.type && meal.type === 'Single Exercise') {
          fatSum += parseFloat(meal.fat, 10);
          prtSum += parseFloat(meal.prt, 10);
          carbsSum += parseFloat(meal.cho, 10);
          calSum += parseFloat(meal.cal, 10);
        } else {
          // const res = await onGetMealItems(meal.id);
          const res = meal.items;
          fatSum += res.reduce((sum, a) => sum + parseFloat(a.fat, 10), 0);
          prtSum += res.reduce((sum, a) => sum + parseFloat(a.prt, 10), 0);
          carbsSum += res.reduce((sum, a) => sum + parseFloat(a.cho, 10), 0);
          calSum += res.reduce((sum, a) => sum + parseFloat(a.cal, 10), 0);
        }
      }

      setTotalFatFromMeals(fatSum);
      setTotalProteinFromMeals(prtSum);
      setTotalCarbsFromMeals(carbsSum);
      setTotalCaloriesFromMeals(calSum);
    }
  };

  useEffect(() => {
    getMyWorkouts();
    calculateActualCalories();
  }, []);

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setPermissionModal(true);
  };

  const onDonePermissionModal = () => {
    setPermissionModal(false);
    if (check === 'clearEntry') {
      setNote('');
      setCheck('');
      setSelectedMeals([]);
    } else {
      if (alertHeading === 'Success!') {
        navigation.goBack();
      }
      setTimeout(() => {
        setAlertText('');
        setAlertHeading('');
      }, 500);
    }
  };

  const onChooseOption = () => {
    setIsVisible(false);
    if (selectedOption === 'FROM MEALS') {
      setSelectMealModal(true);
    } else {
      setCreateItemModal(true);
      setHeading('Add Item');
      setCreateItemFields(createItems);
    }
  };

  const onAddCaloriesOut = () => {
    setCheck('addAdditionalCalories');
    setCreateItemModal(true);
    setHeading('Add Calories Out');
    setCreateItemFields(addCaloriesOutFields);
  };

  const onCompletedWorkoutPress = (item, ind) => {
    if (item.type !== 'not a program') {
      setSubText('');
      setHeading(item.name);
      setCompletedWorkout(item.plan);
      setShowTable(true);
      setCompletedWorkoutIndex(ind);
      setIsProgramDetailModal(true);
    } else {
      setHeading('');
      setSubText('Additional Calories Out');
      setCompletedWorkout(item);
      setShowTable(false);
      setCompletedWorkoutIndex(ind);
      setIsProgramDetailModal(true);
    }
  };

  const onMealSelect = async () => {
    setBtnLoader(true);
    if (selectedMeals.length < 4) {
      // const res = await onGetMealItems(selectedMeal.id);
      const res = selectedMeal.items;

      if (res.length > 0) {
        selectedMeals.push(selectedMeal);
        setSelectMealModal(false);

        const fatSum = res.reduce((sum, i) => sum + parseFloat(i.fat, 10), 0);
        const prtSum = res.reduce((sum, i) => sum + parseFloat(i.prt, 10), 0);
        const carbsSum = res.reduce((sum, i) => sum + parseFloat(i.cho, 10), 0);
        const calSum = res.reduce((sum, i) => sum + parseFloat(i.cal, 10), 0);

        setTotalFatFromMeals(totalFatFromMeals + fatSum);
        setTotalProteinFromMeals(totalProteinFromMeals + prtSum);
        setTotalCarbsFromMeals(totalCarbsFromMeals + carbsSum);
        setTotalCaloriesFromMeals(totalCaloriesFromMeals + calSum);
      } else {
        showMessage(
          'Error!',
          `No items found in this meal. Please select another meal or add some items in this meal.`,
        );
      }
    } else {
      showMessage('Error!', `You can't add calories more than four.`);
    }

    setSelectMealModal(false);
    setSelectedMeal({});
    setDisabled(true);
    setBtnLoader(false);
  };

  const onRemoveMeal = async () => {
    const index = selectedMeals.findIndex(x => x.id === selectedMeal.id);
    selectedMeals.splice(index, 1);

    setPermissionModal(false);
    setMealModalVisible(false);

    if (selectedMeal.type && selectedMeal.type === 'Single Exercise') {
      setTotalFatFromMeals(totalFatFromMeals - selectedMeal.fat);
      setTotalProteinFromMeals(totalProteinFromMeals - selectedMeal.prt);
      setTotalCarbsFromMeals(totalCarbsFromMeals - selectedMeal.cho);
      setTotalCaloriesFromMeals(totalCaloriesFromMeals - selectedMeal.cal);
    } else {
      // const res = await onGetMealItems(selectedMeal.id);
      const res = selectedMeal.items;
      const fatSum = res.reduce((sum, i) => sum + parseFloat(i.fat, 10), 0);
      const prtSum = res.reduce((sum, i) => sum + parseFloat(i.prt, 10), 0);
      const carbsSum = res.reduce((sum, i) => sum + parseFloat(i.cho, 10), 0);
      const calSum = res.reduce((sum, i) => sum + parseFloat(i.cal, 10), 0);

      setTotalFatFromMeals(totalFatFromMeals - fatSum);
      setTotalProteinFromMeals(totalProteinFromMeals - prtSum);
      setTotalCarbsFromMeals(totalCarbsFromMeals - carbsSum);
      setTotalCaloriesFromMeals(totalCaloriesFromMeals - calSum);
    }

    setSelectedMeal({});
  };

  const onRemoveCompletedWorkout = () => {
    setCalFromExe(
      calFromExe - completedWorkoutData[completedWorkoutIndex]?.totalCal || 0,
    );
    completedWorkoutData.splice(completedWorkoutIndex, 1);

    setPermissionModal(false);
    setIsProgramDetailModal(false);
    setCompletedWorkoutIndex(null);
    setCompletedWorkout(null);
  };

  const onPressSelectedMeal = async item => {
    setModalLoader(true);
    setSelectedMeal(item);
    setMealModalVisible(true);

    // await onGetMealItems(item.id);

    setModalLoader(false);
  };

  const onCreateSingleItem = () => {
    if (check === 'addMeal') {
      if (
        itemName.trim() &&
        itemFat.trim() &&
        itemProtein.trim() &&
        itemCarbs.trim()
      ) {
        const data = {
          type: 'Single Exercise',
          id: selectedMeals.length + 1,
          name: itemName,
          color: colors.darkBlue2,
          fat: itemFat,
          prt: itemProtein,
          cho: itemCarbs,
          cal: `${itemFat * 9 + itemProtein * 4 + itemCarbs * 4}`,
        };

        selectedMeals.push(data);
        setTotalFatFromMeals(totalFatFromMeals + parseFloat(itemFat, 10));
        setTotalProteinFromMeals(
          totalProteinFromMeals + parseFloat(itemProtein, 10),
        );
        setTotalCarbsFromMeals(totalCarbsFromMeals + parseFloat(itemCarbs, 10));
        setTotalCaloriesFromMeals(
          totalCaloriesFromMeals +
            parseFloat(`${itemFat * 9 + itemProtein * 4 + itemCarbs * 4}`, 10),
        );
        setCreateItemModal(false);
        setCheck('');
        setItemName('');
        setItemFat('');
        setItemProtein('');
        setItemCarbs('');
        createItems[0].value = '';
        createItems[1].value = '';
        createItems[2].value = '';
        createItems[3].value = '';
      } else {
        showMessage('Error!', 'All fields are required.');
      }
    } else if (additionalCalories.trim()) {
      const data = {
        id: completedWorkoutData.length + 1,
        type: 'not a program',
        name: 'Additional Calories Out',
        totalCal: additionalCalories,
      };

      setCheck('');
      setCreateItemModal(false);
      completedWorkoutData.push(data);
      setCalFromExe(calFromExe + parseFloat(additionalCalories, 10));
      setAdditionalCalories('');
      addCaloriesOutFields[0].value = '';
    } else {
      setDeleteCheck('');
      showMessage('Error!', 'All fields are required.');
    }
  };

  const onSaveHandler = async () => {
    setLoader(true);
    let response = null;
    // Replace slashes with dashes for consistent date parsing (matching Daily Entry)
    const d = new Date(entryData.date.replace(/\//g, '-'));
    d.setHours(0, 0, 0, 0);

    if (d.getTime() > new Date().getTime()) {
      showMessage('Error!', 'You cannot enter data on future dates.');
      setLoader(false);
      return;
    }

    try {
      if (entryId) {
        response = await onEditEntry(entryId, {
          CaloriesEntry: {
            note,
            bmr: user.bmr,
            isDeleted: false,
            actualCalories: selectedMeals,
            completedWorkouts: completedWorkoutData,
            caloriesDifferential: `${
              totalCaloriesFromMeals /
              (parseFloat(bmr, 10) + parseFloat(calFromExe, 10))
            }`,
          },
        });
      } else {
        response = await onCreateEntry(d.getTime(), {
          CaloriesEntry: {
            note,
            bmr: user.bmr,
            isDeleted: false,
            actualCalories: selectedMeals,
            completedWorkouts: completedWorkoutData,
            caloriesDifferential: `${
              totalCaloriesFromMeals /
              (parseFloat(bmr, 10) + parseFloat(calFromExe, 10))
            }`,
          },
        });
      }

      if (response === true) {
        setLoader(false);
        showMessage('Success!', `Entry updated successfully.`);
        await getAllJournalEntries(d.getTime());
      } else {
        setLoader(false);
        showMessage('Error!', response || 'Failed to save entry.');
      }
    } catch (error) {
      console.error('Save error:', error);
      setLoader(false);
      showMessage('Error!', 'An unexpected error occurred while saving.');
    }
  };

  return (
    <Calories
      {...props}
      loader={loader}
      modalLoader={modalLoader}
      mealsData={myMeals}
      completedWorkoutData={completedWorkoutData}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      selectOptions={selectOptions}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      selectMealModal={selectMealModal}
      setSelectMealModal={setSelectMealModal}
      onChooseOption={onChooseOption}
      createItemModal={createItemModal}
      setCreateItemModal={setCreateItemModal}
      createItemFields={createItemFields}
      permissionModal={permissionModal}
      setPermissionModal={setPermissionModal}
      mealItems={myMealItems}
      mealModalVisible={mealModalVisible}
      setMealModalVisible={setMealModalVisible}
      entryName={entryName}
      setEntryName={setEntryName}
      note={note}
      setNote={setNote}
      onSaveHandler={onSaveHandler}
      selectedMeal={selectedMeal}
      setSelectedMeal={setSelectedMeal}
      disabled={disabled}
      setDisabled={setDisabled}
      heading={heading}
      subText={subText}
      onAddCaloriesOut={onAddCaloriesOut}
      showTable={showTable}
      isProgramDetailModal={isProgramDetailModal}
      setIsProgramDetailModal={setIsProgramDetailModal}
      onCompletedWorkoutPress={onCompletedWorkoutPress}
      selectedMeals={selectedMeals}
      onMealSelect={onMealSelect}
      onRemoveMeal={onRemoveMeal}
      deleteCheck={deleteCheck}
      setDeleteCheck={setDeleteCheck}
      onRemoveCompletedWorkout={onRemoveCompletedWorkout}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
      onChangeText={onChangeText}
      onCreateSingleItem={onCreateSingleItem}
      setCheck={setCheck}
      onPressSelectedMeal={onPressSelectedMeal}
      completedWorkout={completedWorkout}
      totalFatFromMeals={totalFatFromMeals}
      totalProteinFromMeals={totalProteinFromMeals}
      totalCarbsFromMeals={totalCarbsFromMeals}
      totalCaloriesFromMeals={totalCaloriesFromMeals}
      bmr={bmr}
      calFromExe={calFromExe}
      btnLoader={btnLoader}
    />
  );
}

CaloriesPage.defaultProps = {
  route: {},
};

CaloriesPage.propTypes = {
  route: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  onCreateEntry: PropTypes.func.isRequired,
  getAllJournalEntries: PropTypes.func.isRequired,
  myMeals: PropTypes.arrayOf(PropTypes.any).isRequired,
  onGetMealItems: PropTypes.func.isRequired,
  myMealItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  onEditEntry: PropTypes.func.isRequired,
  onGetMyWorkouts: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  myCompletedWorkouts: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  user: state.auth?.user,
  myMeals: state.nutrition?.meals,
  myMealItems: state.nutrition?.mealItems,
  myCompletedWorkouts: state.recreation?.completedWorkouts,
});

const mapDispatchToProps = dispatch => ({
  onCreateEntry: (date, data) => dispatch(addJournalEntry(date, data)),
  onEditEntry: (id, data) => dispatch(editJournalEntry(id, data)),
  getAllJournalEntries: date => dispatch(getJournalEntries(date)),
  onGetMealItems: id => dispatch(getMealItems(id)),
  onGetMyWorkouts: () => dispatch(getWorkouts()),
});

export const CaloriesWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CaloriesPage);
