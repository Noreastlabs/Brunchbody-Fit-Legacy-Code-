/* eslint-disable react/jsx-props-no-spreading */
import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {DeleteAccount} from '../../components';
import {deleteAccount} from '../../../../redux/actions';

export default function DeleteAccountPage(props) {
  const {navigation, deleteUserAccount} = props;
  const [isEnabled, setIsEnabled] = useState(false);
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPermissionModal, setIsPermissionModal] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertText, setAlertText] = useState('');
  const [check, setCheck] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  const showMessage = (headingText, text) => {
    setAlertHeading(headingText);
    setAlertText(text);
    setIsPermissionModal(true);
  };

  const onDeleteAccount = async () => {
    setLoader(true);
    const regx = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

    if (email.trim() && password.trim()) {
      if (!regx.test(email)) {
        showMessage('Error!', 'Email address is badly formatted!');
      } else if (isEnabled) {
        showMessage('Error!', 'Please check confirm deletion!');
      } else {
        const response = await deleteUserAccount({
          email,
          password,
        });
        if (response === true) {
          setEmail('');
          setPassword('');
          setCheck(true);
          showMessage('Success!', 'User deleted successfully.');
        } else {
          showMessage('Error!', `${response}`);
        }
      }
      setLoader(false);
    } else {
      setLoader(false);
      showMessage('Error!', 'All fields are required!');
    }
  };

  const onDonePermissionModal = () => {
    if (check) navigation.navigate('SignIn');
    else setIsPermissionModal(false);
  };

  return (
    <DeleteAccount
      navigation={navigation}
      isEnabled={isEnabled}
      setIsEnabled={setIsEnabled}
      toggleSwitch={toggleSwitch}
      loader={loader}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
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
  deleteUserAccount: data => dispatch(deleteAccount(data)),
});

export const DeleteAccountWrapper = connect(
  null,
  mapDispatchToProps,
)(DeleteAccountPage);
