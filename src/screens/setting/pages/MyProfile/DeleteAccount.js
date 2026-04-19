/* eslint-disable react/jsx-props-no-spreading */
import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {DeleteAccount} from '../../components';
import {deleteAccount} from '../../../../redux/actions';
import {getRootNavigation} from '../../../../navigation/getRootNavigation';
import { ROOT_ROUTES } from '../../../../navigation/routeNames';

export default function DeleteAccountPage(props) {
  const {navigation, deleteUserAccount} = props;
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isPermissionModal, setIsPermissionModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [check, setCheck] = useState(false);

  const toggleSwitch = () => {
    setIsConfirmed(!isConfirmed);
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setIsPermissionModal(true);
  };

  const onDeleteAccount = async () => {
    setLoader(true);

    if (!isConfirmed) {
      setLoader(false);
      showMessage(
        'Error!',
        'Please confirm that you want to delete saved local data from this device.',
      );
      return;
    }

    const response = await deleteUserAccount();
    if (response === true) {
      setIsConfirmed(false);
      setCheck(true);
      showMessage(
        'Success!',
        'Saved Brunch Body data was removed from this device.\n\nFiles you exported to another app or folder were not deleted.\n\nStarter plans included with Brunch Body may appear again after setup.',
      );
    } else {
      showMessage('Error!', `${response}`);
    }
    setLoader(false);
  };

  const onDonePermissionModal = () => {
    if (check) {
      const rootNavigation = getRootNavigation(navigation);
      rootNavigation.reset({
        index: 0,
        routes: [{ name: ROOT_ROUTES.COMPLETE_PROFILE }],
      });
    } else {
      setIsPermissionModal(false);
    }
  };

  return (
    <DeleteAccount
      navigation={navigation}
      isConfirmed={isConfirmed}
      toggleSwitch={toggleSwitch}
      loader={loader}
      onDeleteAccount={onDeleteAccount}
      isPermissionModal={isPermissionModal}
      setIsPermissionModal={setIsPermissionModal}
      alertHeading={alertHeading}
      alertText={alertText}
      onDonePermissionModal={onDonePermissionModal}
    />
  );
}

DeleteAccountPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  deleteUserAccount: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  deleteUserAccount: () => dispatch(deleteAccount()),
});

export const DeleteAccountWrapper = connect(
  null,
  mapDispatchToProps,
)(DeleteAccountPage);
