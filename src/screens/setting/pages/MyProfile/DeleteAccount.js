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
        'Please confirm that Delete local data clears Brunch Body app-local data stored by the app on this device.',
      );
      return;
    }

    const response = await deleteUserAccount();
    if (response === true) {
      setIsConfirmed(false);
      setCheck(true);
      showMessage(
        'Success!',
        'Brunch Body app-local data stored by the app on this device was cleared.\n\nFiles you exported, copied, shared, moved, backed up, uploaded, or saved outside Brunch Body app-managed storage were not deleted.\n\nThis was not a password reset or cloud deletion.\n\nStarter content included with Brunch Body may appear again after deletion.',
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
