import React from 'react';
import { ScrollView } from 'react-native';
import { Modal } from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from './style';

export default function CustomModal(props) {
  const { isVisible, onDismiss, content } = props;

  return (
    <Modal
      visible={isVisible}
      dismissable={false}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}>
        {content}
      </ScrollView>
    </Modal>
  );
}

CustomModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  content: PropTypes.objectOf(PropTypes.any).isRequired,
};
