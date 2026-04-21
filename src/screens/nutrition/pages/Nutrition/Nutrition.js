import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { colors } from '../../../../resources';
import { Nutrition } from '../../components';
import {
  addMeal,
  addSupplement,
  deleteMeal,
  deleteSupplement,
  getMealCategories,
  getMealItems,
  getMeals,
  getMealsDirectory,
  getSupplementItems,
  getSupplements,
  profile,
  setMealItems,
  setSupplementItems,
} from '../../../../redux/actions';
import { NUTRITION_ROUTES } from '../../../../navigation/routeNames';

const getCreateItemFieldConfig = ({ type, title, color, errorText }) => {
  const isMeal = type !== 'supplement';
  const itemName = isMeal ? 'Meal' : 'Supplement Stack';

  return [
    {
      id: 1,
      value: title,
      fieldName: `${itemName} Name`,
      placeholder: `Enter ${itemName.toLowerCase()} name`,
      helperText: `Give this ${itemName.toLowerCase()} a clear name.`,
      errorText,
    },
    {
      id: 2,
      fieldName: isMeal ? 'Meal Color' : 'Stack Color',
      colorPicker: true,
      helperText: `Pick the color that should represent this ${itemName.toLowerCase()}.`,
      value: color,
    },
  ];
};

const initialState = {
  tab: 1,
  fat: 60,
  protein: 30,
  carbohydrates: 10,
  mealModalVisible: false,
  calculationModalVisible: false,
  supplementModal: false,
  permissionModal: false,
  createItemModal: false,
  modalHeading: '',
  colorPickerModal: false,
  color: colors.darkBlue2,
  type: '',
  title: '',
  createItemErrorText: '',
  createItemPending: false,
  targetCalories: '',
  alertHeading: '',
  alertText: '',
  loader: false,
  meal: '',
  mealItems: [],
  supplement: '',
  supplementItems: [],
  deleteLoader: false,
};

export default class NutritionPage extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.createItemLocked = false;
  }

  componentDidMount() {
    // this.getAllMeals();
    // this.props.getAllMealCategories();
    // this.props.getAllMealsDirectory();
  }

  getAllMeals = async () => {
    const { getUserMeals, getUserSupplements } = this.props;

    await getUserMeals();
    await getUserSupplements();
  };

  onNavigate = val => {
    const { navigation } = this.props;
    navigation.navigate(NUTRITION_ROUTES.SUPPLEMENT, { title: val });
  };

  onChangeHandler = data => {
    const { name, value } = data;
    this.setState({
      [name]: value,
    });
  };

  onChangeTitle = data => {
    const { name, value } = data;
    this.setState({
      [name]: value,
      createItemErrorText: '',
    });
  };

  toggleMealModal = async item => {
    const { onSetMealItems, myMeals } = this.props;

    this.setState({
      meal: item,
      type: 'meal',
      loader: true,
      mealModalVisible: true,
    });

    // const response = await onGetMealItems(item.id);
    const mealIndex = await myMeals.findIndex(i => i.id === item.id);
    await onSetMealItems(myMeals[mealIndex].items);

    // if (response) {
    this.setState({
      mealItems: myMeals[mealIndex].items,
      loader: false,
    });
    // }
  };

  closeMealModal = () => {
    this.setState({
      mealModalVisible: false,
    });
  };

  openSupplementModal = async item => {
    const { onSetSupplementItems, mySupplements } = this.props;

    this.setState({
      loader: true,
      type: 'supplement',
      supplement: item,
      supplementModal: true,
    });

    // const response = await onGetSupplementItems(item.id);
    const supplementIndex = await mySupplements.findIndex(
      i => i.id === item.id,
    );
    await onSetSupplementItems(mySupplements[supplementIndex].items);

    // if (response) {
    this.setState({
      supplementItems: mySupplements[supplementIndex].items,
      loader: false,
    });
    // }
  };

  closeSupplementModal = () => {
    this.setState({
      supplementModal: false,
    });
  };

  toggleCalModal = () => {
    this.setState({ type: '' });
    const {
      fat,
      protein,
      carbohydrates,
      targetCalories,
      calculationModalVisible,
    } = this.state;

    if (targetCalories === '') {
      this.setState({
        alertHeading: 'Error!',
        alertText: 'Please enter target calories.',
        permissionModal: true,
      });
    } else if (fat + protein + carbohydrates !== 100) {
      this.setState({
        alertHeading: 'Error!',
        alertText: 'Macro ratio should be equal to 100.',
        permissionModal: true,
      });
    } else {
      this.setState({
        calculationModalVisible: !calculationModalVisible,
      });
    }
  };

  showMessage = (heading, text) => {
    this.setState({
      alertHeading: heading,
      alertText: text,
      permissionModal: true,
    });
  };

  closePermissionModal = () => {
    this.setState({
      permissionModal: false,
      type: '',
      alertHeading: '',
      alertText: '',
    });
  };

  closeCreateItemModal = () => {
    this.createItemLocked = false;
    this.setState({
      createItemModal: false,
      modalHeading: '',
      title: '',
      type: '',
      createItemErrorText: '',
      createItemPending: false,
    });
  };

  onAddBtnPress = (type, heading) => {
    this.createItemLocked = false;
    this.setState({
      type,
      createItemModal: true,
      modalHeading: heading,
      title: '',
      createItemErrorText: '',
      createItemPending: false,
    });
  };

  onCreateItem = async () => {
    const { title, color, type, createItemPending } = this.state;
    const { onAddMeal, onAddSupplement } = this.props;
    let response = null;

    if (this.createItemLocked || createItemPending) {
      return;
    }

    if (!title.trim()) {
      this.setState({
        createItemErrorText:
          type === 'supplement'
            ? 'Enter a supplement stack name before creating it.'
            : 'Enter a meal name before creating it.',
      });
      return;
    }

    this.createItemLocked = true;
    this.setState({ createItemPending: true });

    if (type === 'meal') {
      response = await onAddMeal({
        name: title.trim(),
        color,
      });
    } else {
      response = await onAddSupplement({
        name: title.trim(),
        color,
      });
    }

    this.createItemLocked = false;

    if (response === true) {
      this.setState({
        title: '',
        createItemPending: false,
        createItemErrorText: '',
        createItemModal: false,
        modalHeading: '',
        type: '',
      });
      this.showMessage('Success!', `Item added successfully.`);
    } else {
      this.setState({
        createItemPending: false,
      });
      this.showMessage('Error!', response);
    }
  };

  onCreateTargetCalories = async () => {
    this.setState({ loader: true });
    const { updateUserProfile } = this.props;
    const { fat, protein, carbohydrates, targetCalories } = this.state;

    const response = await updateUserProfile({
      targetCalories: [
        {
          id: 1,
          name: 'fat',
          value: `${Math.floor((targetCalories * (fat / 100)) / 9)}`,
        },
        {
          id: 2,
          name: 'prt',
          value: `${Math.floor((targetCalories * (protein / 100)) / 4)}`,
        },
        {
          id: 3,
          name: 'cho',
          value: `${Math.floor((targetCalories * (carbohydrates / 100)) / 4)}`,
        },
        { id: 4, name: 'cal', value: targetCalories },
      ],
    });

    if (response === true) {
      this.setState({
        calculationModalVisible: false,
        alertHeading: 'Success!',
        alertText: 'Target calories added successfully..',
        permissionModal: true,
        loader: false,
      });
    } else {
      this.setState({
        calculationModalVisible: false,
        alertHeading: 'Error!',
        alertText: response,
        permissionModal: true,
        loader: false,
      });
    }
  };

  onDonePermissionModal = async () => {
    const { type, meal, supplement } = this.state;
    const { onDeleteMeal, onDeleteSupplement } = this.props;

    if (type === 'meal') {
      this.setState({ deleteLoader: true });

      const response = await onDeleteMeal(meal.id);

      if (response === true) {
        this.setState({
          type: '',
          deleteLoader: false,
          mealModalVisible: false,
          permissionModal: false,
        });
      } else {
        this.setState({ deleteLoader: false, type: '' });
        this.showMessage('Error!', response);
      }
    } else if (type === 'supplement') {
      this.setState({ deleteLoader: true });

      const response = await onDeleteSupplement(supplement.id);

      if (response === true) {
        this.setState({
          type: '',
          deleteLoader: false,
          supplementModal: false,
          permissionModal: false,
        });
      } else {
        this.setState({ deleteLoader: false, type: '' });
        this.showMessage('Error!', response);
      }
    } else {
      this.setState({
        type: '',
        permissionModal: false,
      });
      setTimeout(() => {
        this.setState({
          alertText: '',
          alertHeading: '',
        });
      }, 500);
    }
  };

  render() {
    const { myMeals, mySupplements } = this.props;
    const { type, title, color, createItemErrorText } = this.state;

    return (
      <Nutrition
        {...this.state}
        createItemFields={getCreateItemFieldConfig({
          type,
          title,
          color,
          errorText: createItemErrorText,
        })}
        myMeals={myMeals}
        supplements={mySupplements}
        onNavigate={this.onNavigate}
        onCreateItem={this.onCreateItem}
        onChangeTitle={this.onChangeTitle}
        onAddBtnPress={this.onAddBtnPress}
        openMealModal={this.toggleMealModal}
        closeMealModal={this.closeMealModal}
        toggleCalModal={this.toggleCalModal}
        onChangeHandler={this.onChangeHandler}
        closeCreateItemModal={this.closeCreateItemModal}
        closePermissionModal={this.closePermissionModal}
        openSupplementModal={this.openSupplementModal}
        closeSupplementModal={this.closeSupplementModal}
        onDonePermissionModal={this.onDonePermissionModal}
        onCreateTargetCalories={this.onCreateTargetCalories}
      />
    );
  }
}

NutritionPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  onAddMeal: PropTypes.func.isRequired,
  getUserMeals: PropTypes.func.isRequired,
  getUserSupplements: PropTypes.func.isRequired,
  onGetMealItems: PropTypes.func.isRequired,
  onGetSupplementItems: PropTypes.func.isRequired,
  myMeals: PropTypes.arrayOf(PropTypes.any).isRequired,
  onAddSupplement: PropTypes.func.isRequired,
  mySupplements: PropTypes.arrayOf(PropTypes.any).isRequired,
  updateUserProfile: PropTypes.func.isRequired,
  onDeleteMeal: PropTypes.func.isRequired,
  onDeleteSupplement: PropTypes.func.isRequired,
  getAllMealCategories: PropTypes.func.isRequired,
  getAllMealsDirectory: PropTypes.func.isRequired,
  onSetMealItems: PropTypes.func.isRequired,
  onSetSupplementItems: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  myMeals: state.nutrition?.meals,
  mySupplements: state.nutrition?.supplements,
});

const mapDispatchToProps = dispatch => ({
  onAddMeal: data => dispatch(addMeal(data)),
  getUserMeals: () => dispatch(getMeals()),
  getUserSupplements: () => dispatch(getSupplements()),
  onGetMealItems: id => dispatch(getMealItems(id)),
  onGetSupplementItems: id => dispatch(getSupplementItems(id)),
  onAddSupplement: data => dispatch(addSupplement(data)),
  updateUserProfile: data => dispatch(profile(data)),
  onDeleteMeal: id => dispatch(deleteMeal(id)),
  onDeleteSupplement: id => dispatch(deleteSupplement(id)),
  getAllMealCategories: () => dispatch(getMealCategories()),
  getAllMealsDirectory: () => dispatch(getMealsDirectory()),
  onSetMealItems: data => dispatch(setMealItems(data)),
  onSetSupplementItems: data => dispatch(setSupplementItems(data)),
});

export const NutritionWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NutritionPage);
