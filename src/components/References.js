import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RelatedContexts from './RelatedContexts';
import Aside from './Aside';
import { buildBibliography, resourceHasContents } from 'peritext-utils';

import Link from './LinkProvider';

const ReferenceCard = ( {
  item,
  onOpen,
  translate,
  showMentions,
  active
} ) => {
    return (
      <li
        className={ `big-list-item ${active ? 'active' : ''}` }
      >
        <div className={ 'big-list-item-content' }>
          <div
            dangerouslySetInnerHTML={ {/* eslint react/no-danger: 0 */
                __html: item.html
              } }
          />
        </div>
        {item.resource && showMentions &&
          <div className={ 'big-list-item-actions' }>
            <button
              className={ 'link' }
              onClick={ onOpen }
            >
              {item.resource.mentions.length} {item.resource.mentions.length === 1 ? translate( 'mention' ) : translate( 'mentions' )}
            </button>
          </div>
          }
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
};
export default class References extends Component {

  static contextTypes = {
    translate: PropTypes.func,
    asideVisible: PropTypes.bool,
    toggleAsideVisible: PropTypes.func,
    preprocessedData: PropTypes.object,
  }
  constructor( props ) {
    super( props );
    this.state = {
      openResourceId: undefined
    };
  }

  componentDidMount = () => {
    const {
      props: {
        production,
        edition,
        options = {},
        id,
      },
      context: {
        preprocessedData
      }
    } = this;

    const {
      showUncitedReferences = false,
      resourceTypes = [ 'bib' ],
      sortingKey = 'authors',
      sortingAscending = true,
    } = options;

    const preprocessedBiblio = preprocessedData && preprocessedData.blocks && preprocessedData.blocks[id] && preprocessedData.blocks[id].bibliographyData;
    let references;
    if ( preprocessedBiblio ) {
      references = preprocessedBiblio;
    }
    else {
      references = buildBibliography( {
        production,
        edition,
        // contextualizations,
        options: {
          showUncitedReferences,
          resourceTypes,
          sortingKey,
          sortingAscending,
        }
      } );
    }

    this.setState( {
      references,
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
        references,
        // citations,
      },
      context: {
        translate,
      },
      toggleOpenedResource,
      openResource,
    } = this;

    const {
      showMentions
    } = options;

    return (
      <div className={ 'main-contents-container references-player' }>
        <div className={ 'main-column' }>
          <h1 className={ 'view-title' }>{title}</h1>
          {references !== undefined &&
            <ul className={ 'big-list-items-container' }>
              {
              references.
              map( ( item, index ) => {
                const handleOpen = () => {
                  openResource( item.resource.id );
                };
                return (
                  <ReferenceCard
                    key={ index }
                    item={ item }
                    onOpen={ handleOpen }
                    showMentions={ showMentions }
                    active={ openResourceId === item.resource.id }
                    citationStyle={ edition.data.citationStyle }
                    citationLocale={ edition.data.citationLocale }
                    translate={ translate }
                  />
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
