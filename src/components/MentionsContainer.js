import React from 'react';
import PropTypes from 'prop-types';
import ContextMention from './ContextMention';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { StructuredCOinS } from 'peritext-utils';

const getEntryName = ( entry ) => {
  return ( entry.item && entry.item.title )
        || ( entry.resource && entry.resource.data.name )
        || ( entry.given && `${entry.family } ${ entry.given}` )
        || entry.id;
};

const MentionsContainer = ( {
  title,
  entries = [],
  toggleOpenedItemId,
  openedItemId,
  entryNameGetter,
  className = '',
}, { translate } ) => (
  <div className={ `mentions-container ${ className}` }>
    <h2>{title}</h2>
    <ul className={ 'index-list' }>
      {
      entries
      .map( ( entry, index ) => {
        const entryName = entryNameGetter ? entryNameGetter( entry ) : getEntryName( entry );
        const expanded = openedItemId === entry.id;
        const toggleItemExpansion = () => toggleOpenedItemId( entry.id );

        return (
          <li
            key={ index }
            id={ entryName }
            className={ `mentions-list-container ${ expanded ? 'expanded' : ''}` }
          >
            {
              entry.item &&
              <StructuredCOinS cslRecord={ entry.item } />
            }
            <h3
              className={ 'index-list-title' }
              onClick={ toggleItemExpansion }
            >
              {entryName} <button className={ `collapse-btn ${ expanded ? ' active' : ''}` }>{expanded ? `- ${ translate( 'Hide mentions' )}` : `+${ translate( 'Show mentions' )}`}</button>
            </h3>
            <ReactCSSTransitionGroup
              transitionName={ 'mentions-animation' }
              transitionEnterTimeout={ 500 }
              transitionLeaveTimeout={ 300 }
            >
              {expanded &&
                <ul className={ 'mentions-list' }>
                    {
                    entry.mentions
                    .filter( ( mention ) =>
                        mention.contextContent !== undefined &&
                        mention.contextContent.targetContents !== undefined
                      )
                    .map( ( mention, count ) => {
                      const {
                          contextContent: {
                            targetContents,
                            contents,
                            sectionTitle,
                            targetId,
                          },
                          id,
                      } = mention;
                      return (
                        <li
                          key={ count }
                          id={ id }
                        >
                          <ContextMention
                            targetContents={ targetContents }
                            contents={ contents }
                            sectionTitle={ sectionTitle }
                            targetId={ targetId }
                            contextualizationId={ id }
                          />
                        </li>
                      );
                    } )
                  }
                </ul>
              }
            </ReactCSSTransitionGroup>
          </li>
        );
      } )
     }
    </ul>
  </div>
);

MentionsContainer.contextTypes = {
  translate: PropTypes.func,
};

export default MentionsContainer;
