import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RelatedContexts from './RelatedContexts';
import objectPath from 'object-path';
import Aside from './Aside';

import {
  getContextualizationsFromEdition
} from 'peritext-utils';

import resourceSchema from 'peritext-schemas/resource';
import uniq from 'lodash/uniq';
import intersection from 'lodash/intersection';

let Graph;
const isBrowser = new Function( 'try {return this===window;}catch(e){ return false;}' );
const inBrowser = isBrowser();/* eslint no-new-func : 0 */
if ( inBrowser ) {
  Graph = require( 'react-d3-graph' ).Graph;

}

const getResourceColor = ( type ) => {
  switch ( type ) {
    case 'bib':
      return 'lightgreen';
    case 'glossary':
      return 'lightblue';
    case 'webpage':
      return 'blue';
    case 'video':
    case 'embed':
      return 'red';
    default:
      return 'lightgrey';
  }
};
const getResourceTitle = ( resource ) => {
  const titlePath = objectPath.get( resourceSchema, [ 'definitions', resource.metadata.type, 'titlePath' ] );
  const title = titlePath ? objectPath.get( resource, titlePath ) : resource.metadata.title;
  return title;
};

const buildMap = (
  production,
  edition,
  {
    showUncited,
    showAllResources,
    resourceTypes = [ 'bib' ],
  }
) => {

  let resourcesIds;
  if ( showUncited ) {
    resourcesIds = Object.keys( production.resources );
  }
 else {
    const usedContextualizations = getContextualizationsFromEdition( production, edition );
    resourcesIds = uniq(
      usedContextualizations.map( ( c ) => c.contextualization.resourceId )
    );
  }
  if ( !showAllResources ) {
    resourcesIds = resourcesIds.filter( ( resourceId ) => {
      return resourceTypes.includes[production.resources[resourceId].metadata.type];
    } );
  }
  let nodes = resourcesIds.map( ( resourceId ) => ( {
    resource: production.resources[resourceId],
    id: resourceId,
    type: 'resource',
    mentions: Object.keys( production.contextualizations )
      .filter( ( contextualizationId ) =>
        production.contextualizations[contextualizationId].resourceId === resourceId
      )
      .map( ( contextualizationId ) => production.contextualizations[contextualizationId] )
  } ) );

  nodes = nodes.map( ( node ) => ( {
    ...node,
    title: getResourceTitle( node.resource ),
    color: getResourceColor( node.resource.metadata.type ),
    sectionsIds: node.mentions.map( ( c ) => c.sectionId )
  } ) );

  const edgesMap = {};
  nodes.forEach( ( node1, index1 ) => {
    nodes.slice( index1 + 1 )
      .forEach( ( node2 ) => {
        const intersects = intersection( node1.sectionsIds, node2.sectionsIds );
        if ( intersects.length ) {
          const ids = [ node1, node2 ].map( ( n ) => n.resource.id ).sort();
          const edgePoint = edgesMap[ids[0]] || {};
          edgePoint[ids[1]] = edgePoint[ids[1]] ? edgePoint[ids[1]] + 1 : 1;
          edgesMap[ids[0]] = edgePoint;
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
            weight: edgesMap[edge1][edge2]
        } ) )
    ];
  }, [] );

  return { nodes, edges };
};

export default class ResourcesMap extends Component {

  static contextTypes = {
    translate: PropTypes.func,
    usedDocument: PropTypes.object,
    asideVisible: PropTypes.bool,
    toggleAsideVisible: PropTypes.func,
    dimensions: PropTypes.object,
  }
  constructor( props ) {
    super( props );
    this.state = {
      openResourceId: undefined
    };
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
      openResourceId: this.state.openResourceId ? undefined : id
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
        openResourceId
      },

       context: {
          translate,
          dimensions = {
            width: 50,
            height: 50
          }
       },

      toggleOpenedResource,
      openResource,
    } = this;

    const {
      width,
      height
    } = dimensions;

    const {
      showUncited = false,
      showAllResources = true,
      resourceTypes = [ 'bib' ],
    } = options;
    const { nodes, edges } = buildMap( production, edition, {
      showUncited,
      showAllResources,
      resourceTypes,
    } );

    const graphConfig = {
        automaticRearrangeAfterDropNode: false,
        collapsible: true,
        directed: false,
        height: 400,
        highlightDegree: 1,
        highlightOpacity: 1,
        linkHighlightBehavior: false,
        maxZoom: 8,
        minZoom: 0.1,
        focusZoom: 1,
        focusAnimationDuration: 0.75,
        nodeHighlightBehavior: false,
        panAndZoom: false,
        staticGraph: false,
        link: {
            highlightColor: 'lightblue'
        },
        node: {
          labelProperty: 'title',
        }
    };

    const onClickNode = function( nodeId ) {
       openResource( nodeId );
    };

    return (
      <div>
        <h1>{title}</h1>
        {
          Graph && nodes.length &&
          <div className={ 'graph-container' }>
            <Graph
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
            />
          </div>
        }
        <Aside
          isActive={ openResourceId !== undefined }
          title={ translate( 'Mentions of this item' ) }
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
      </div>
    );
  }
}
