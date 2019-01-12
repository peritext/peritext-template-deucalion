import React from 'react';
import PropTypes from 'prop-types';
import Link from './LinkProvider';

const SectionLink = ( {
  children,
  sectionId,
}, {
getViewIdForSectionId
} ) => (
  <Link
    to={ {
      routeClass: 'sections',
      viewId: getViewIdForSectionId( sectionId ),
      routeParams: {
        sectionId,
      }
    } }
  >
    {children}
  </Link>
);

SectionLink.contextTypes = {
  getViewIdForSectionId: PropTypes.func,
};

export default SectionLink;
