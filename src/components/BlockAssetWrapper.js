/**
 * This module exports a stateless reusable block asset wrapper component
 * It handles the connection to context's data and builds proper data to render the asset
 * ============
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StructuredCOinS } from 'peritext-utils';
import MarkdownPlayer from './MarkdownPlayer';

const BlockAssetWrapper = ( {
  data
}, {
  production = {},
  productionAssets: assets = {},
  openAsideContextualization,
  contextualizers,
  containerId,
  bindContextualizationElement,
  renderingMode = 'screened'
} ) => {
  const assetId = data.asset.id;
  const contextualization = production && production.contextualizations && production.contextualizations[assetId];
  if ( !contextualization ) {
    return null;
  }
  const {
    visibility = {
      paged: true,
      screened: true
    },
  } = contextualization;
  const contextualizer = production.contextualizers[contextualization.contextualizerId];
  const resource = production.resources[contextualization.sourceId];

  const contextualizerModule = contextualizers[contextualizer.type];

  const Component = contextualizerModule && contextualizerModule.Block;

  const handleMoreInformation = () => {
    if ( typeof openAsideContextualization === 'function' ) {
      openAsideContextualization( contextualization.id );
    }
  };

  const bindRef = ( element ) => {
    if ( typeof bindContextualizationElement === 'function' ) {
      bindContextualizationElement( contextualization.id, element );
    }
  };

  if ( contextualization && Component ) {

    const isHidden = !visibility[renderingMode];
    return isHidden ? null : (
      <figure
        className={ `block-contextualization-container ${ contextualizer.type}` }
        style={ {
          position: 'relative',
        } }
        id={ `contextualization-${containerId}-${assetId}` }
        ref={ bindRef }
      >
        <Component
          resource={ resource }
          contextualizer={ contextualizer }
          contextualization={ contextualization }
          renderingMode={ renderingMode }
          assets={ assets }
        />
        <figcaption className={ 'figure-caption' }>
          {
            <h4 className={ 'figure-title' }>

              {
                renderingMode === 'screened' ?
                  <div>
                    <button
                      className={ 'link mention-context-pointer' }
                      onClick={ handleMoreInformation }
                    >
                      <span>{contextualization.title || resource.metadata.title}</span>
                      <sup>◈</sup>
                    </button>
                  </div> :
                  <span>{contextualization.title || resource.metadata.title}</span>
              }
            </h4>
          }
          {contextualization.legend &&
            <div className={ 'figure-legend' }>
              <MarkdownPlayer src={ contextualization.legend } />
            </div>
          }

        </figcaption>
        <StructuredCOinS resource={ resource } />
      </figure>
    );
  }
  else {
    return null;
  }
};

/**
 * Component's properties types
 */
BlockAssetWrapper.propTypes = {

  /**
   * Corresponds to the data initially embedded in a draft-js entity
   */
  data: PropTypes.shape( {
    asset: PropTypes.shape( {
      id: PropTypes.string
    } )
  } )
};

/**
 * Component's context used properties
 */
BlockAssetWrapper.contextTypes = {

  /**
   * The active production data
   */
  production: PropTypes.object,

  /**
   * Dimensions of the wrapping element
   */
  dimensions: PropTypes.object,

  /**
   * Whether the block asset is displayed in a note (and not in main content)
   */
  inNote: PropTypes.bool,

  contextualizers: PropTypes.object,

  productionAssets: PropTypes.object,

  containerId: PropTypes.string,

  openAsideContextualization: PropTypes.func,

  bindContextualizationElement: PropTypes.func,

  renderingMode: PropTypes.string,
};

export default BlockAssetWrapper;

