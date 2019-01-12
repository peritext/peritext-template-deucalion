import React from 'react';
import PropTypes from 'prop-types';

import { buildContextContent, resourceToCslJSON } from 'peritext-utils';

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
  const related = Object.keys( production.contextualizations )
    .filter( ( contextualizationId ) => {
      return assetId ?
        contextualizationId !== assetId &&
        production.contextualizations[contextualizationId].resourceId === resourceId
      : production.contextualizations[contextualizationId].resourceId === resourceId;
    } )
    .map( ( contextualizationId ) => ( {
      ...production.contextualizations[contextualizationId],
      ...buildContextContent( production, contextualizationId )
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
          <Link
            to={ {
              routeClass: 'resourceSheet',
              routeParams: {
                resourceId: resource.id
              }
            } }
          >
            {translate( 'Print mentions' )}
          </Link>
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
    </div>
  );
};

RelatedContexts.contextTypes = {
  translate: PropTypes.func,
};

export default RelatedContexts;
