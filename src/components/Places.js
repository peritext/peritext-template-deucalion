import React, { Component } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';

import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';

import {
  extent,
  mean,
} from 'd3-array';
import { scaleLinear } from 'd3-scale';

import Aside from './Aside';
import RelatedContexts from './RelatedContexts';

import { buildGlossary } from 'peritext-utils';

// const MIN_LATITUDE =  -90;
const MAX_LATITUDE = 90;

// const MIN_LONGITUDE =  -180;
const MAX_LONGITUDE = 180;

const LocalizationMarker = ( {
  items = [],
  onClick,
  nbMentions,
  markerScale,
} ) => {
  const color = 'white';
  return (
    <div
      onClick={ onClick }
      className={ 'localization-marker' }
    >
      <span
        style={ {
          cursor: 'pointer',
          color,
          width: `${markerScale( nbMentions )}px`,
          height: `${markerScale( nbMentions )}px`,
          borderRadius: '50%',
          background: 'red',
          border: `1px ${color} solid`,
          padding: '1em',
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          top: '-15px',
          left: '-15px'
        } }
      >
        {nbMentions}
      </span>
      <div
        style={ {
          position: 'absolute',
          left: 5,
          top: -15,
          width: 50
        } }
      >
        {
          location.adress &&
          <h3
            className={ 'localization-adress' }
          >
              {location.adress}
          </h3>
        }
        <ul className={ 'localization-entries-list' }>
          {
            items.map( ( item, itemIndex ) => (
              <li
                className={ 'localization-entry' }

                key={ itemIndex }
              >
                {item.resource.data.name}
              </li>
            ) )
          }
        </ul>
      </div>
    </div>
  );
};

export default class Places extends Component {

  static contextTypes = {
    asideVisible: PropTypes.bool,
    toggleAsideVisible: PropTypes.func,
    translate: PropTypes.func,
  }
  constructor( props ) {
    super( props );
    this.state = {
      openPlaceId: undefined
    };
  }
  openPlace = ( id ) => {
    if ( !this.context.asideVisible ) {
      this.context.toggleAsideVisible();
    }
    this.context.toggleAsideVisible();
    this.setState( {
      openPlaceId: id
    } );
  }
  toggleOpenedPlace = ( id ) => {
    this.setState( {
      openPlaceId: this.state.openPlaceId ? undefined : id
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
        openPlaceId
      },
      context: {
        translate,
      },
      toggleOpenedPlace,
      openPlace,
    } = this;

    const {
      mapStyle = 'toner'
    } = options;

    const items = buildGlossary( { options: { ...options, glossaryTypes: [ 'place' ] }, production, edition } )
    .filter( ( item ) => item.resource.data.location && item.resource.data.location.latitude );
    const placesMap = groupBy( items, ( item ) => `${item.resource.data.location.latitude}-${item.resource.data.location.longitude}` );
    const places = Object.keys( placesMap ).map( ( loc ) => ( {
      location: placesMap[loc][0].resource.data.location,
      items: placesMap[loc],
      nbMentions: placesMap[loc].reduce( ( sum, item ) => sum + item.mentions.length, 0 ),
      id: loc
    } ) );
    const mentionsExtent = extent( places, ( d ) => d.nbMentions );
    const latitudeExtent = extent( places, ( d ) => d.location.latitude );
    const longitudeExtent = extent( places, ( d ) => d.location.longitude );
    const latMean = mean( places, ( d ) => d.location.latitude );
    const lngMean = mean( places, ( d ) => d.location.longitude );
    const area = ( latitudeExtent[1] - latitudeExtent[0] ) * ( longitudeExtent[1] - longitudeExtent[0] );

    const zoomScale = scaleLinear().domain( [ 0, ( MAX_LATITUDE * 2 ) * ( MAX_LONGITUDE * 2 ) ] )
    .range( [ 1, 12 ] );
    const markerScale = scaleLinear().domain( mentionsExtent ).range( [ 1, 5 ] );
    const zoom = area > 0 ? zoomScale( area ) : 6;

    let tileProvider;
    switch ( mapStyle ) {
      case 'nolabel':
        tileProvider = ( x, y, z ) => `https://tiles.wmflabs.org/osm-no-labels/${z}/${x}/${y}.png`;
        break;
      case 'shading':
        tileProvider = ( x, y, z ) => `http://c.tiles.wmflabs.org/hillshading/${z}/${x}/${y}.png`;
        break;
      case 'watercolor':
        tileProvider = ( x, y, z ) => `http://c.tile.stamen.com/watercolor/${z}/${x}/${y}.png`;
        break;
      case 'toner':
        tileProvider = ( x, y, z ) => `http://a.tile.stamen.com/toner/${z}/${x}/${y}.png`;
        break;
      case 'openstreetmap':
      default:
        tileProvider = ( x, y, z ) => ` https://a.tile.openstreetmap.org/${z}/${x}/${y}.png `;
        break;

    }

    const openedPlace = openPlaceId &&
            places.find( ( p ) => p.id === openPlaceId );
    return (
      <div>
        <h1>{title}</h1>
        {
          <div className={ 'places-container' }>
            <Map
              center={ [ latMean, lngMean ] }
              defaultZoom={ zoom }
              provider={ tileProvider }
            >
              {
              places.map( ( place ) => {
                const onClick = () => {
                  openPlace( place.id );
                };
                return (
                  <Overlay
                    key={ place.id }
                    anchor={ [ place.location.latitude, place.location.longitude ] }
                  >
                    <LocalizationMarker

                      onClick={ onClick }
                      nbMentions={ place.nbMentions }
                      markerScale={ markerScale }
                      items={ place.items }
                      location={ place.location }
                    />
                  </Overlay>
                );
              } )
            }
            </Map>
          </div>
      }
        <Aside
          isActive={ openPlaceId !== undefined }
          title={ translate( 'Mentions about this place' ) }
          onClose={ toggleOpenedPlace }
        >
          {
            openedPlace &&
            <h5 className={ 'location-details' }>
              <span>🌐</span>
              <em>
                {openedPlace.location.address} ({openedPlace.location.latitude}, {openedPlace.location.longitude})
              </em>
            </h5>
          }
          <div className={ 'glossaries-related-to-place-list' }>
            {
            openPlaceId &&
              placesMap[openPlaceId]
              .map( ( item, itemIndex ) => {
                return (
                  <RelatedContexts
                    production={ production }
                    key={ itemIndex }
                    edition={ edition }
                    resourceId={ item.resource.id }
                  />
                );
              } )
          }
          </div>
        </Aside>
      </div>
    );
  }
}
