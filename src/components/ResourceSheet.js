import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { buildContextContent, getContextualizationsFromEdition } from 'peritext-utils';

import ContextMention from './ContextMention';
import ResourceIdentityCard from './ResourceIdentityCard';

const ProductionHeader = ( {
  production: {
    metadata: {
      title,
      subtitle,
      authors = []
    }
  }
} ) => (
  <div className={ 'production-identity-card' }>
    <h1>{title}</h1>
    {subtitle && <h2>{subtitle}</h2>}
    <h3>
      {
      authors.length > 0 &&
        authors
        .map( ( author, index ) => {
          return typeof author === 'string' ?
            <span key={ index }>{author}</span>
            :
            <span key={ index }>
              {`${author.given} ${author.family}`}
            </span>;
        } )
        .reduce( ( cur, item, index ) => {
          return index === 0 ?
            [ item ]
            :
            [ ...cur, ', ', item ];
        }, [] )
    }
    </h3>
  </div>
);

class ResourceSheet extends Component {
  static childContextTypes = {
    renderingMode: PropTypes.string
  }

  getChildContext = () => ( {
    renderingMode: 'paged'
  } )

  render = () => {
    const {
      props: {
        production,
        edition,
        // activeViewClass,
        activeViewParams,
        // options = {},
      },
      context: {
        translate,
      }
    } = this;

    const {
      resourceId,
    } = activeViewParams;

    if ( !resourceId ) {
      return null;
    }

    const PADDING = 0;

    const usedContextualizations = getContextualizationsFromEdition( production, edition );

    let related = usedContextualizations
      .filter( ( { contextualization: { id: contextualizationId } } ) =>
        production.contextualizations[contextualizationId].sourceId === resourceId
      )
      .map( ( { contextualization } ) => ( {
        ...contextualization,
        ...buildContextContent( production, contextualization.id, PADDING )
      } ) )
      .filter( ( i ) => i.targetContents );
  related = related
    .reduce( ( cur, item, index ) => {
      if ( index > 0 ) {
        // console.log('related', related[index - 1].sectionTitle, item.sectionTitle)
        if ( related[index - 1].sectionTitle === item.sectionTitle ) {
          return [
            ...cur,
            {
              ...item,
              sectionTitle: '...'
            }
          ];
        }
      }
      return [ ...cur, item ];
    }, [] );
    const resource = production.resources[resourceId];
    return (
      <div className={ 'resource-sheet main-contents-container' }>
        <div className={ 'main-column' }>
          <div className={ 'header' }>
            <ProductionHeader production={ production } />
            <ResourceIdentityCard
              resource={ resource }
              production={ production }
              edition={ edition }
            />

          </div>
          {related.length ?
            <ul className={ 'body related-contexts-container' }>
              <h3>
                {translate( 'Mentions' )}
                {' : '}
              </h3>
              {
                related
                .filter( ( thatContextualization ) => thatContextualization.targetContents !== undefined )
                .map( ( thatContextualization, index ) => (
                  <li
                    className={ 'related-context' }
                    key={ index }
                  >
                    <ContextMention
                      targetContents={ thatContextualization.targetContents }
                      contents={ thatContextualization.contents }
                      sectionTitle={ thatContextualization.sectionTitle }
                      targetId={ thatContextualization.targetId }
                      contextualizationId={ thatContextualization.id }
                      displayLinks={ false }
                    />
                  </li>
                ) )
              }
            </ul>
          :
            <div className={ 'body' } />
        }
        </div>
      </div>
    );

  }
}

ResourceSheet.contextTypes = {
  translate: PropTypes.func,
};

export default ResourceSheet;
