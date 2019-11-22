import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RelatedContexts from './RelatedContexts';
import MarkdownPlayer from './MarkdownPlayer';
import Aside from './Aside';
import { resourceHasContents, buildGlossary } from 'peritext-utils';
import Link from './LinkProvider';

export default class Glossary extends Component {

  static contextTypes = {
    translate: PropTypes.func,
    asideVisible: PropTypes.bool,
    toggleAsideVisible: PropTypes.func,
  }
  constructor( props, context ) {
    super( props );
    this.state = {
      openResourceId: undefined,
      glossaryData: this.buildGlossaryData( props, context )
    };
  }

  componentWillReceiveProps = ( nextProps ) => {
    this.setState( {
      glossaryData: this.buildGlossaryData( nextProps, this.context )
    } );
  }

  buildGlossaryData = ( props, context ) => {
    const { options, production, edition, id } = props;
    const { preprocessedData } = context;

    return ( preprocessedData && preprocessedData.blocks && preprocessedData.blocks[id] && preprocessedData.blocks[id].glossaryData )
  || buildGlossary( { options, production, edition } );
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
        openResourceId,
        glossaryData,
      },
      context: {
        translate,
      },
      toggleOpenedResource,
      openResource,
    } = this;

    const {
      showMentions = true,
      showDescription = true,
    } = options;

    return (
      <div className={ 'main-contents-container glossary-player' }>
        <div className={ 'main-column' }>
          <h1 className={ 'view-title' }>{title}</h1>
          {
            <ul className={ 'big-list-items-container' }>
              {
              glossaryData.
              map( ( item, index ) => {
                const handleClick = () => {
                  openResource( item.resource.id );
                };
                const active = openResourceId === item.resource.id;
                return (
                  <li
                    className={ `big-list-item ${active ? 'active' : ''}` }
                    key={ index }
                  >
                    <div className={ 'big-list-item-content' }>
                      <div className={ 'title' }>
                        <h3>{item.resource.data.name}</h3>
                      </div>
                      {
                        showDescription && item.resource.data.description &&
                        <div className={ 'description' }>
                          <MarkdownPlayer src={ item.resource.data.description } />
                        </div>
                      }
                    </div>
                    <div className={ 'big-list-item-actions' }>
                      {
                        showMentions && item.mentions.length > 0 &&
                        <div>
                          <button
                            className={ 'link' }
                            onClick={ handleClick }
                          >
                            {item.mentions.length} {item.mentions.length === 1 ? translate( 'mention' ) : translate( 'mentions' )}
                          </button>
                        </div>
                      }
                    </div>
                    {item.resource && resourceHasContents( item.resource ) &&
                      <div className={ 'big-list-item-actions' }>
                        <Link
                          to={ {
                            routeClass: 'resourcePage',
                              routeParams: {
                                resourceId: item.resource.id,
                              }
                          } }
                        >
                          {translate( 'Expand contents' )}
                        </Link>
                      </div>
                      }
                  </li>
                );
              } )
            }
            </ul>
          }
        </div>
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
