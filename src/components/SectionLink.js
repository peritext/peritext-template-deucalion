import React from 'react';
import PropTypes from 'prop-types';
import Link from './LinkProvider';

const SectionLink = ( {
  children,
  resourceId,
}, {
getViewIdForResourceId
} ) => (
  <Link
    to={ {
      routeClass: 'sections',
      viewId: getViewIdForResourceId( resourceId ),
      routeParams: {
        resourceId,
      }
    } }
  >
    {children}
  </Link>
);

SectionLink.contextTypes = {
  getViewIdForResourceId: PropTypes.func,
};

export default SectionLink;
