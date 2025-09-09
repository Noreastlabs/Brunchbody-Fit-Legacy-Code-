import React from 'react';
import PropTypes from 'prop-types';
import {CustomModal, SelectModalContent} from '../../../components';

const ManageTheme = ({
  visibleManageTheme,
  hideManageTheme,
  isRemove,
  setIsRemove,
  themeOptions,
  selectedTheme,
  setSelectedTheme,
  disabled,
  setDisabled,
  loader,
  onRemoveTheme,
  onEditTheme,
}) => (
  <CustomModal
    isVisible={visibleManageTheme}
    onDismiss={hideManageTheme}
    content={
      <SelectModalContent
        loader={loader}
        isRemove={isRemove}
        setRemove={() => setIsRemove(!isRemove)}
        onRemove={onRemoveTheme}
        heading="Edit Theme"
        subHeading="Select Theme"
        options={themeOptions}
        selectedOption={selectedTheme}
        onOptionSelect={option => {
          setSelectedTheme(option);
          setDisabled(false);
        }}
        hideModal={hideManageTheme}
        btnTitle="Edit"
        disabled={disabled}
        onBtnPress={onEditTheme}
      />
    }
  />
);

ManageTheme.propTypes = {
  visibleManageTheme: PropTypes.bool.isRequired,
  hideManageTheme: PropTypes.func.isRequired,
  isRemove: PropTypes.bool.isRequired,
  setIsRemove: PropTypes.func.isRequired,
  themeOptions: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectedTheme: PropTypes.string.isRequired,
  setSelectedTheme: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  setDisabled: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired,
  onRemoveTheme: PropTypes.func.isRequired,
  onEditTheme: PropTypes.func.isRequired,
};

export default ManageTheme;
