import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TraitDirectory } from '../../components';

export default function TraitDirectoryPage(props) {
  const { traits } = props;
  const [search, setSearch] = useState('');

  return (
    <TraitDirectory
      search={search}
      setSearch={setSearch}
      directoryList={traits}
    />
  );
}

TraitDirectoryPage.propTypes = {
  traits: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  traits: state.journal?.allTraits,
});

export const TraitDirectoryWrapper = connect(
  mapStateToProps,
  null,
)(TraitDirectoryPage);
