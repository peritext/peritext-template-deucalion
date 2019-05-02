import React from 'react';
import PropTypes from 'prop-types';
import Renderer from './Renderer';
import Link from './LinkProvider';

const ContextMention = ( {
  contents,
  sectionTitle,
  sectionId,
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
          {/* <div className={ 'header' }>
            <i>
              <Link
                to={ {
                  routeClass: 'sections',
                  viewId: getViewIdForSectionId( sectionId ),
                  routeParams: {
                    sectionId,
                    contextualizationId,
                  }
                } }
              >
                {translate( 'Mention context' ) } {`(${sectionTitle})`}
              </Link>
            </i>
          </div> */}
          <div className={ 'excerpt' }>
            <Link
              to={ {
              routeClass: 'sections',
            viewId: getViewIdForSectionId( sectionId ),
              routeParams: {
                sectionId,
                contextualizationId,
              }
            } }
            >
              <Renderer raw={ contents } />
            </Link>
          </div>
          {/* <div className={ 'footer' }>
            <i>
              <Link
                to={ {
              routeClass: 'sections',
              viewId: getViewIdForSectionId( sectionId ),
              routeParams: {
                sectionId,
                contextualizationId,
              }
            } }
              >
                {translate( 'Go to mention' ) } {`(${sectionTitle})`}
              </Link>
            </i>
          </div> */}
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
