import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RelatedContexts from './RelatedContexts';
import Aside from './Aside';

import {
  getContextualizationsFromEdition,
  getResourceTitle,
} from 'peritext-utils';

// import resourceSchema from 'peritext-schemas/resource';
import uniq from 'lodash/uniq';
import intersection from 'lodash/intersection';

import { makeAssetTitle } from '../utils';

let SigmaLib;
let Sigma;
let RandomizeNodePositions;
let ForceAtlas2;
let SigmaEnableWebGL;
const isBrowser = new Function( 'try {return this===window;}catch(e){ return false;}' );
const inBrowser = isBrowser();/* eslint no-new-func : 0 */
if ( inBrowser ) {
  SigmaLib = require( 'react-sigma' );
  Sigma = SigmaLib.Sigma;
  RandomizeNodePositions = SigmaLib.RandomizeNodePositions;
  ForceAtlas2 = SigmaLib.ForceAtlas2;
  SigmaEnableWebGL = SigmaLib.SigmaEnableWebGL;
}

const getResourceColor = ( type ) => {
  switch ( type ) {
    case 'bib':
      return '#c7f9ed';
    case 'glossary':
      return '#ddc8fc';
    case 'webpage':
      return '#92beff';
    case 'video':
      return '#ef6d3f';
    case 'embed':
      return '#cc4a27';
    case 'table':
      return '#f2cf00';
    case 'section':
      return '#00a99d';
    default:
      return '#00a99d';
  }
};

const buildMap = (
  production,
  edition,
  {
    showUncitedReferences,
    showAllResources,
    resourceTypes = [ 'bib' ],
    minimumCooccurrenceNumber = 2
  }
) => {

  let resourcesIds;
  let usedContextualizations = getContextualizationsFromEdition( production, edition );
  if ( showUncitedReferences ) {
    resourcesIds = Object.keys( production.resources );
  }
 else {
    resourcesIds = uniq(
      usedContextualizations.map( ( c ) => c.contextualization.sourceId )
    );
  }
  if ( !showAllResources ) {
    resourcesIds = resourcesIds.filter( ( resourceId ) => {
      return resourceTypes.includes[production.resources[resourceId].metadata.type];
    } );
  }
  usedContextualizations = usedContextualizations.filter( ( c ) =>
    resourcesIds.includes( c.contextualization.sourceId )
  );
  let nodes = resourcesIds.map( ( resourceId ) => ( {
    resource: production.resources[resourceId],
    id: resourceId,
    type: 'resource',
    mentions: usedContextualizations
      .filter( ( c ) =>
        c.contextualization.sourceId === resourceId
      )
      .map( ( c ) => c.contextualization )
  } ) );

  nodes = nodes.map( ( node ) => ( {
    ...node,
    label: getResourceTitle( node.resource ),
    color: getResourceColor( node.resource.metadata.type ),
    targetsIds: node.mentions.map( ( c ) => c.targetId ),
    size: 1
  } ) );

  const edgesMap = {};
  nodes.forEach( ( node1, index1 ) => {
    nodes.slice( index1 + 1 )
      .forEach( ( node2 ) => {
        const intersects = intersection( node1.targetsIds, node2.targetsIds );
        if (
          intersects.length ||
          node2.targetsIds.includes( node1.resource.id ) ||
          node1.targetsIds.includes( node2.resource.id )
        ) {
          const ids = [ node1, node2 ].map( ( n ) => n.resource.id ).sort();
          const edgePoint = edgesMap[ids[0]] || {};
          edgePoint[ids[1]] = edgePoint[ids[1]] ? edgePoint[ids[1]] + ( intersects.length || 1 ) : ( intersects.length || 1 );
          edgesMap[ids[0]] = edgePoint;
          node1.size++;
          node2.size++;
        }
      } );
  } );

  const edges = Object.keys( edgesMap ).reduce( ( res, edge1 ) => {
    return [
      ...res,
      ...Object.keys( edgesMap[edge1] )
        .map( ( edge2 ) => ( {
            source: edge1,
            target: edge2,
            weight: edgesMap[edge1][edge2],
            color: '#888889'
        } ) )
    ];
  }, [] )
  .filter( ( e ) => e.weight >= minimumCooccurrenceNumber );

  return { nodes, edges };
};

export default class ResourcesMap extends Component {

  static contextTypes = {
    translate: PropTypes.func,
    usedDocument: PropTypes.object,
    asideVisible: PropTypes.bool,
    toggleAsideVisible: PropTypes.func,
    rawCitations: PropTypes.object,
    dimensions: PropTypes.object,
  }
  constructor( props ) {
    super( props );
    this.state = {
      openResourceId: undefined,
      error: false,
      isLoadingAside: false
    };
  }

  componentDidCatch = ( e ) => {
    console.error( e );/* eslint no-console : 0 */
    this.setState( {
      error: e
    } );
  }

  openResource = ( id ) => {
    if ( !this.context.asideVisible ) {
      this.context.toggleAsideVisible();
    }
    this.setState( {
      openResourceId: id
    } );
  }
  toggleOpenedResource = ( id ) => {

    this.context.toggleAsideVisible();
    this.setState( {
        isLoadingAside: true,
      }, () => {
      this.setState( {
        openResourceId: this.state.openResourceId ? undefined : id
      }, () => {
        this.setState( {
          isLoadingAside: false
        } );
      } );
    } );
  }

  render = () => {
    const {
      props: {
        production,
        edition,
        options = {},
        title,
      },
      state: {
        openResourceId,
        isLoadingAside,
        error,
      },

       context: {
          translate,
          dimensions = {
            width: 50,
            height: 50
          },
          rawCitations
       },

      toggleOpenedResource,
      openResource,
    } = this;

    const {
      width,
      height
    } = dimensions;

    const {
      showUncitedReferences = false,
      showAllResources = true,
      resourceTypes = [ 'bib' ],
      minimumCooccurrenceNumber = 1,
    } = options;
    const { nodes, edges } = buildMap( production, edition, {
      showUncitedReferences,
      showAllResources,
      resourceTypes,
      minimumCooccurrenceNumber,
    } );

    const onClickNode = ( { data } ) => {
      const { node: { id } } = data;
      this.setState( { isLoadingAside: true } );
      setTimeout( () => {
        openResource( id );
        this.setState( { isLoadingAside: false } );
      }, 200 );

    };
    if ( error ) {
      return (
        <div>
          This view could not be rendered in this environment
        </div>
      );
    }
    return (
      <div>
        <h1>{title}</h1>
        {
          SigmaLib && nodes.length ?
            <div className={ 'graph-container' }>
              <Sigma
                onClickNode={ onClickNode }
                style={ { width, height } }
                graph={ { nodes, edges } }
                settings={ { drawEdges: true } }
                renderer={ 'webgl' }
              >
                <SigmaEnableWebGL />
                <RandomizeNodePositions />
                <ForceAtlas2
                  worker
                  barnesHutOptimize
                  barnesHutTheta={ 0.6 }
                  iterationsPerRender={ 10 }
                  linLogMode
                  timeout={ 3000 }
                />
              </Sigma>
              {/* <Graph
                id={ 'graph' } // id is mandatory, if no id is defined rd3g will throw an error
                data={ {
                  nodes,
                  links: edges,
                  focusedNodeId: openResourceId
                } }
                config={ graphConfig }
                onClickNode={ onClickNode }
                width={ width }
                height={ height }
              /> */}
              <div
                className={ `loader ${isLoadingAside ? 'active' : ''}` }
              >
                <span>{translate( 'Loading' )}</span>
              </div>
            </div>
          : <div className={ 'graph-placeholder' }>{translate( 'No links to display' )}</div>
        }
        <Aside
          isActive={ openResourceId !== undefined }
          title={ openResourceId && makeAssetTitle( production.resources[openResourceId], production, edition, rawCitations.citationItems ) }
          onClose={ toggleOpenedResource }
        >
          {
          openResourceId &&
          <RelatedContexts
            production={ production }
            edition={ edition }
            resourceId={ openResourceId }
          />
        }
        </Aside>
        {
          <div
            className={ `loader ${isLoadingAside ? 'active' : ''}` }
          >
            <span>{translate( 'Loading' )}</span>
          </div>
        }
      </div>
    );
  }
}
