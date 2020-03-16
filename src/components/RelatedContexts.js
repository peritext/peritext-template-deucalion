import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip';

import {
  buildContextContent,
  resourceToCslJSON,
  getContextualizationsFromEdition,
  resourceHasContents,
  getResourceTitle,
} from 'peritext-utils';

import ContextMention from './ContextMention';
import Link from './LinkProvider';
import ResourceIdentityCard from './ResourceIdentityCard';

const RelatedContexts = ( {
  production,
  edition,
  assetId,
  resourceId: inputResourceId,
}, {
  translate,
} ) => {
  const contextualization = production.contextualizations[assetId];

  const resourceId = inputResourceId || contextualization.sourceId;
  const usedContextualizations = getContextualizationsFromEdition( production, edition );
  const related = usedContextualizations
    .filter( ( { contextualization: { id: contextualizationId } } ) => {
      return assetId ?
        // contextualizationId !== assetId &&
        production.contextualizations[contextualizationId] &&
        production.contextualizations[contextualizationId].sourceId === resourceId
      : production.contextualizations[contextualizationId] && production.contextualizations[contextualizationId].sourceId === resourceId;
    } )
    .filter( ( c ) => c )
    .map( ( { contextualization: theContextualization } ) => ( {
      ...theContextualization,
      ...buildContextContent( production, theContextualization.id )
    } ) );

  const resource = production.resources[resourceId];
  let citation = resourceToCslJSON( resource );
  citation = citation && citation.length ? citation[0] : {};
  return (
    <div className={ 'related-contexts' }>
      <div className={ 'header' }>
        <ResourceIdentityCard
          resource={ resource }
          production={ production }
          edition={ edition }
          showTitle={ false }
        />

        <div className={ 'related-contexts-actions' }>
          {
            citation.URL &&
            <a
              target={ 'blank' }
              rel={ 'noopener' }
              href={ citation.URL }
            >
              {translate( 'Browse online' )}
            </a>
          }
        </div>
      </div>

      {related.length > 0 ?
        <div className={ 'related-contexts-container' }>
          <div className={ 'mentions-title-container' }>
            <span className={ 'mentions-title' }>{translate( 'mentions' )}</span>
          </div>
          <ul className={ 'related-contexts-list' }>
            {
            related
            .filter( ( thatContextualization ) => thatContextualization.targetContents !== undefined )
            .map( ( thatContextualization ) => (
              <li
                className={ 'related-context' }
                key={ thatContextualization.id }
              >
                <ContextMention
                  targetContents={ thatContextualization.targetContents }
                  contents={ thatContextualization.contents }
                  sectionTitle={ getResourceTitle( production.resources[thatContextualization.targetId] ) }
                  targetId={ thatContextualization.targetId }
                  contextualizationId={ thatContextualization.id }
                  isActive={ assetId !== thatContextualization.id }

                />
              </li>
            ) )
          }
          </ul>
        </div>
      :
        <div className={ 'body' } />
    }
      <div className={ 'footer' }>
        <div>
          <Link
            to={ {
              routeClass: 'resourceSheet',
              routeParams: {
                resourceId: resource.id
              }
            } }
            target={ 'blank' }
            rel={ 'noopener' }
          >
            {translate( 'print mentions' )}
          </Link>
        </div>
        {
          resourceHasContents( resource ) ?
            <div>
              <Link
                to={ {
                routeClass: 'resourcePage',
                routeParams: {
                  resourceId: resource.id
                }
              } }
                target={ 'blank' }
                rel={ 'noopener' }
              >
                {translate( 'expand contents' )}
              </Link>
            </div>
          : null
        }
      </div>
      <Tooltip id={ 'tooltip' } />
    </div>
  );
};

RelatedContexts.contextTypes = {
  translate: PropTypes.func,
};

export default RelatedContexts;
