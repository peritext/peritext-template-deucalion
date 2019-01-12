import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RelatedContexts from './RelatedContexts';
import MarkdownPlayer from './MarkdownPlayer';
import Aside from './Aside';
import { buildGlossary } from '../utils';

export default class Glossary extends Component {

  static contextTypes = {
    translate: PropTypes.func,
    asideVisible: PropTypes.bool,
    toggleAsideVisible: PropTypes.func,
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
      },
      toggleOpenedResource,
      openResource,
    } = this;

    const {
      showMentions = true,
      showDescription = true,
    } = options;

    const items = buildGlossary( { options, production, edition } );
    return (
      <div className={ 'main-contents-container glossary-player' }>
        <div className={ 'main-column' }>
          <h1 className={ 'view-title' }>{title}</h1>
          {
            <ul className={ 'big-list-items-container' }>
              {
              items.
              map( ( item, index ) => {
                const handleClick = () => {
                  openResource( item.resource.id );
                };
                return (
                  <li
                    className={ 'big-list-item' }
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
