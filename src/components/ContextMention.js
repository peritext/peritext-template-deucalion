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
  isActive
}, {
  // translate,
  getViewIdForSectionId,
} ) => {
  const viewId = getViewIdForSectionId( targetId );
  return (
    <div
      className={ `context-mention ${isActive ? 'is-active' : ''}` }
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
                routeClass: viewId ? 'sections' : 'resourcePage',
                  viewId,
                  routeParams: {
                    resourceId: targetId,
                    contextualizationId,
                  }
              } }
              >
                <Renderer raw={ contents } />
                <h3 className={ 'mention-section-name' }>{sectionTitle}</h3>
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
};

ContextMention.contextTypes = {
  translate: PropTypes.func,
  getViewIdForSectionId: PropTypes.func,
};
export default ContextMention;
