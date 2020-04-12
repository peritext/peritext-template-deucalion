import React, { Component } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';

import RelatedContexts from './RelatedContexts';
import Aside from './Aside';

import { buildGlossary, getResourceTitle } from 'peritext-utils';

const buildDateLabel = ( {
  year,
  month,
  day,
} ) => {
  let output = year;
  if ( day ) {
    output = new Date( +year, +month, +day ).toLocaleDateString( undefined, { year: 'numeric', month: 'long', day: 'numeric' } );
  }
  else if ( month ) {
    output = `${month}/${year}`;
  }
  return output;
};

export default class Events extends Component {

  static contextTypes = {
    translate: PropTypes.func,
    asideVisible: PropTypes.bool,
    toggleAsideVisible: PropTypes.func,
  }
  constructor( props ) {
    super( props );
    this.state = {
      openEventId: undefined
    };
  }
  openEvent = ( id ) => {
    if ( !this.context.asideVisible ) {
      this.context.toggleAsideVisible();
    }
    this.setState( {
      openEventId: id
    } );
  }
  toggleOpenedEvent = ( id ) => {
    this.context.toggleAsideVisible();
    this.setState( {
      openEventId: this.state.openEventId ? undefined : id
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
        openEventId
      },
      context: {
        translate,
      },
      toggleOpenedEvent,
      openEvent,
    } = this;

    const items = buildGlossary( { options: { ...options, glossaryTypes: [ 'event' ] }, production, edition } )
    .filter( ( item ) => item.resource.data.dates && item.resource.data.dates.start );
    const eventsMap = groupBy( items, ( item ) => `${item.resource.data.dates.start}-${item.resource.data.dates.end}` );
    const events = Object.keys( eventsMap ).map( ( datum ) => ( {
      dates: eventsMap[datum][0].resource.data.dates,
      items: eventsMap[datum],
      id: datum
    } ) )
    .sort( ( a, b ) => {
      if ( a.dates.start > b.dates.start ) {
        return 1;
      }
      return -1;
    } );

     const openedEvent = openEventId &&
            events.find( ( p ) => p.id === openEventId );

    return (
      <div className={ 'main-contents-container events-player' }>
        <div className={ 'main-column' }>
          <h1 className={ 'view-title' }>{title}</h1>
          {
            <ul className={ 'big-list-items-container' }>
              {
                events.map( ( event, eventIndex ) => {
                  const displayStart = event.dates.startDateParts ? buildDateLabel( event.dates.startDateParts ) : new Date( event.dates.start ).toLocaleDateString();
                  const displayEnd = event.dates.end && ( event.dates.endDateParts ? buildDateLabel( event.dates.endDateParts ) : new Date( event.dates.end ).toLocaleDateString() );
                  const eventTitle = displayEnd ? `${displayStart} - ${displayEnd}` : displayStart;
                  const handleClick = () => {
                    openEvent( event.id );
                  };
                  const relatedTitles = event.items.map( ( item ) => getResourceTitle( item.resource ) )
                  .filter( ( thatTitle ) => thatTitle.toLowerCase() !== eventTitle.toLowerCase() );
                  return (
                    <li
                      className={ 'big-list-item' }
                      key={ eventIndex }
                    >
                      <div className={ 'big-list-item-content' }>
                        <h3>{eventTitle}</h3>
                        {
                          relatedTitles.map( ( item, index ) => ( <h4 key={ index }>{ item }</h4> ) )
                        }
                      </div>
                      <div className={ 'big-list-item-actions' }>
                        <button onClick={ handleClick }>
                          {translate( 'See mentions' )}
                        </button>
                      </div>
                    </li>
                  );
                } )
              }
            </ul>
          }
        </div>
        <Aside
          isActive={ openEventId !== undefined }
          title={ translate( 'Mentions about an event' ) }
          onClose={ toggleOpenedEvent }
        >
          {
            openEventId &&
            <div>
              {
                openedEvent &&
                <h5 className={ 'event-details' }>
                  <span>◈</span>
                  <em>
                    {openedEvent.dates.startDateParts ? buildDateLabel( openedEvent.dates.startDateParts ) : new Date( openedEvent.dates.start ).toLocaleDateString()}
                    {
                      openedEvent.dates.end &&
                      ` - ${ openedEvent.dates.endDateParts ? buildDateLabel( openedEvent.dates.endDateParts ) : new Date( openedEvent.dates.end ).toLocaleDateString() }`
                    }
                  </em>
                </h5>
              }
              <div className={ 'glossaries-related-to-event-list' }>
                {
                  eventsMap[openEventId]
                  .map( ( item, itemIndex ) => {
                    return (
                      <RelatedContexts
                        production={ production }
                        edition={ edition }
                        resourceId={ item.resource.id }
                        key={ itemIndex }
                      />
                    );
                  } )
                }
              </div>
            </div>

          }
        </Aside>
      </div>
    );
  }
}
