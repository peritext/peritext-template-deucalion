import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const RouterLink = ( {
  to: item,
  children,
}, {
  routeItemToUrl
} ) => {
  const url = routeItemToUrl( item );
  return (
    <NavLink
      to={ `${url}` }
      className={ 'link' }
      activeClassName={ 'active' }
    >
      {children}
    </NavLink>
  );
};

RouterLink.contextTypes = {
  routeItemToUrl: PropTypes.func,
};

export default RouterLink;
