import React from 'react';
import PropTypes from 'prop-types';
import MarkdownPlayer from './MarkdownPlayer';
import { getResourceTitle } from 'peritext-utils';

const ResourceIdentityCard = ( {
  resource,
  showTitle = true,
}, {
  contextualizers,
  translate
} ) => {
  const assetTitle = getResourceTitle( resource );
  const Citation = resource.metadata.type !== 'glossary' && contextualizers.bib && contextualizers.bib.Block;
  const description = resource.metadata.type === 'glossary' ? resource.data.description : resource.metadata.description;
  return (
    <div className={ 'resource-identity-card' }>

      <div className={ 'main-info' }>
        {
          showTitle &&
          <div className={ 'title' }>
            {!Citation &&
            <span className={ 'resource-identity-card-title' }>{assetTitle}</span>
          }
            {Citation &&
            <Citation
              resource={ resource }
              renderingMode={ 'screened' }
            />
          }
          </div>
      }

      </div>
      <div className={ 'additional-info' }>
        <div className={ 'type' }>
          {translate( resource.metadata.type === 'glossary' ? resource.data.entryType : resource.metadata.type )}
        </div>
        {
        description && description.trim().length &&
        <div className={ 'description' }>
          <MarkdownPlayer src={ description } />
        </div>
      }
        {
        resource.metadata.source && resource.metadata.source.trim().length &&
        <div className={ 'source' }>
          <span>{translate( 'source' )}</span>: <span>{ resource.metadata.source }</span>
        </div>
      }
      </div>
    </div>
  );
};

ResourceIdentityCard.contextTypes = {
  citationItems: PropTypes.object,
  contextualizers: PropTypes.object,
  translate: PropTypes.func,
};

export default ResourceIdentityCard;
