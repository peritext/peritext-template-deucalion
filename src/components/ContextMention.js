import React from 'react';
import PropTypes from 'prop-types';
import Renderer from './Renderer';
import Link from './LinkProvider';

const ContextMention = ( {
  contents,
  sectionTitle,
  targetId,
  contextualizationId,
  displayLinks = true,
}, {
  // translate,
  getViewIdForSectionId,
} ) => (
  <div
    className={ 'context-mention' }
    data-tip={ sectionTitle }
    data-for={ 'tooltip' }
    data-place={ 'left' }
  >
    {
      displayLinks ?
        <div>
          <div className={ 'excerpt' }>
            <Link
              to={ {
              routeClass: 'sections',
            viewId: getViewIdForSectionId( targetId ),
              routeParams: {
                sectionId: targetId,
                contextualizationId,
              }
            } }
            >
              <Renderer raw={ contents } />
            </Link>
          </div>
        </div>
      :
        <div>
          <h3>{sectionTitle}</h3>
          <div className={ 'excerpt' }>
            <Renderer raw={ contents } />
          </div>
        </div>
    }

  </div>
);

ContextMention.contextTypes = {
  translate: PropTypes.func,
  getViewIdForSectionId: PropTypes.func,
};
export default ContextMention;
