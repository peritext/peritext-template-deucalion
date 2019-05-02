import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip';

import { buildContextContent, resourceToCslJSON, getContextualizationsFromEdition } from 'peritext-utils';

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

  const resourceId = inputResourceId || contextualization.resourceId;
  const usedContextualizations = getContextualizationsFromEdition( production, edition );
  const related = usedContextualizations
    .filter( ( { contextualization: { id: contextualizationId } } ) => {
      return assetId ?
        contextualizationId !== assetId &&
        production.contextualizations[contextualizationId].resourceId === resourceId
      : production.contextualizations[contextualizationId].resourceId === resourceId;
    } )
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

      {related.length ?
        <ul className={ 'related-contexts-container' }>
          <h3>
            {translate( 'This item is mentionned in' )}
            {' : '}
          </h3>
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
                  sectionTitle={ thatContextualization.sectionTitle }
                  sectionId={ thatContextualization.sectionId }
                  contextualizationId={ thatContextualization.id }
                />
              </li>
            ) )
          }
        </ul>
      :
        <div className={ 'body' } />
    }
      <div className={ 'footer' }>
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
          {translate( 'Print mentions' )}
        </Link>
      </div>
      <Tooltip id={ 'tooltip' } />
    </div>
  );
};

RelatedContexts.contextTypes = {
  translate: PropTypes.func,
};

export default RelatedContexts;
