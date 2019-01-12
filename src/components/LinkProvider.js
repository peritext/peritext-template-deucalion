import React from 'react';
import PropTypes from 'prop-types';

const LinkProvider = ( props, { LinkComponent, navigateTo } ) => {
  const handleClick = () => {
    navigateTo( props.to );
  };
  return (
    <LinkComponent
      { ...props }
      onClick={ handleClick }
    />
  );
};

LinkProvider.contextTypes = {
  LinkComponent: PropTypes.func,
  navigateTo: PropTypes.func
};

export default LinkProvider;
