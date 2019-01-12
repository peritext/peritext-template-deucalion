import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RelatedContexts from './RelatedContexts';
import Aside from './Aside';
import { buildContextContent, buildCitations, getContextualizationsFromEdition, resourceToCslJSON } from 'peritext-utils';
import { makeBibliography } from 'react-citeproc';
import uniq from 'lodash/uniq';

/**
 * Computes interactive bibliography materials
 * @return {array} items - list of context-loaded items
 */
function buildBibliography ( {
    production,
    edition,
    citations,
    contextualizations,
    showUncitedReferences,
    resourceTypes,
    sortingKey,
    sortingAscending,
} ) {

  const {
    resources
  } = production;

  /**
   * Select relevant resources
   */
  // filter cited references only
  let citedResourcesIds = showUncitedReferences ?
    Object.keys( resources )
    :
    uniq(
      contextualizations.map( ( element ) => {
        const contextualization = element.contextualization;
        return contextualization.resourceId;
      } )
    );
  // filter by type of resource
  citedResourcesIds = citedResourcesIds.filter( ( resourceId ) => {
    const type = resources[resourceId].metadata.type;
    return resourceTypes.includes( type );
  } );

  let items = citedResourcesIds.map( ( resourceId ) => {
    const cit = resourceToCslJSON( resources[resourceId] );
    const citationKey = cit && cit[0] && cit[0].id;
    const mentions = contextualizations.map( ( element ) => {
      if ( element.contextualization.resourceId === resourceId ) {
        return {
          ...element,
          id: element.contextualization.id
        };
      }
    } ).filter( ( s ) => s );

    let biblio;
    if ( citations.citationItems[citationKey] ) {
      biblio = makeBibliography(
        citations.citationItems,
        edition.data.citationStyle.data,
        edition.data.citationLocale.data,
        {
          select: [ {
            field: 'id',
            value: citationKey
          } ]
        }
      );
    }
    else {
      biblio = makeBibliography(
        { [resourceId]: { ...cit[0], id: resourceId } },
        edition.data.citationStyle.data,
        edition.data.citationLocale.data,
        {
          select: [ {
            field: 'id',
            value: resourceId
          } ]
        }
      );
    }
    const title = biblio && biblio[1] && biblio[1][0];
    return {
      citationKey,
      title,
      item: citations.citationItems[citationKey] || cit[0],
      resourceId,
      mentions: mentions.map( ( mention ) => ( {
        ...mention,
        contextContent: buildContextContent( production, mention.id )
      } ) )
    };
  } );

  items = items.sort( ( a, b ) => {
    switch ( sortingKey ) {
      case 'date':
        const datePartsA = a.item.issued && a.item.issued['date-parts'];
        const datePartsB = b.item.issued && b.item.issued['date-parts'];
        if ( datePartsA && datePartsB && datePartsA.length && datePartsB.length ) {

          if ( datePartsA[0] > datePartsB[0] ) {
            return 1;
          }
          else if ( datePartsA[0] < datePartsB[0] ) {
            return -1;
          }
          else if ( datePartsA.length > 1 && datePartsB.length > 1 ) {
            if ( datePartsA[1] > datePartsB[1] ) {
              return 1;
            }
            else if ( datePartsA[1] < datePartsB[1] ) {
              return -1;
            }
            else return 0;
          }
          else {
            return 0;
          }

        }
        else if ( !datePartsB || ( datePartsB && !datePartsB.length ) ) {
          return -1;
        }
        else if ( !datePartsA || ( datePartsA && !datePartsA.length ) ) {
          return 1;
        }
        else {
          return 0;
        }
      case 'authors':
        if ( a.item.author && b.item.author ) {
          const authorsA = a.item.author && a.item.author.map( ( author ) => `${author.family}-${author.given}`.toLowerCase() ).join( '' );
          const authorsB = b.item.author && b.item.author.map( ( author ) => `${author.family}-${author.given}`.toLowerCase() ).join( '' );
          if ( authorsA > authorsB ) {
            return 1;
          }
          else return -1;
        }
        else if ( !b.item.author ) {
          return -1;
        }
        else if ( !a.item.author ) {
          return 1;
        }
        else return 0;
      case 'title':
        if ( a.item.title.toLowerCase() > b.item.title.toLowerCase() ) {
          return 1;
        }
        return -1;
      default:
        break;
    }
  } );
  if ( !sortingAscending ) {
    items = items.reverse();
  }

  return items;
}

export default class References extends Component {

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
      showUncitedReferences = false,
      resourceTypes = [ 'bib' ],
      sortingKey = 'authors',
      sortingAscending = true,
    } = options;

    /**
     * @todo compute citations based on edition
     */
    const citations = buildCitations( production );
    const contextualizations = getContextualizationsFromEdition( production, edition );
    const references = buildBibliography( {
      production,
      edition,
      citations,
      contextualizations,
      showUncitedReferences,
      resourceTypes,
      sortingKey,
      sortingAscending,
    } );
    return (
      <div className={ 'main-contents-container references-player' }>
        <div className={ 'main-column' }>
          <h1 className={ 'view-title' }>{title}</h1>
          {
            <ul className={ 'big-list-items-container' }>
              {
              references.
              map( ( item, index ) => {
                const handleClick = () => {
                  openResource( item.resourceId );
                };
                return (
                  <li
                    className={ 'big-list-item' }
                    key={ index }
                  >
                    <div className={ 'big-list-item-content' }>
                      <div
                        dangerouslySetInnerHTML={ {/* eslint react/no-danger: 0 */
                          __html: item.title
                        } }
                      />
                    </div>
                    <div className={ 'big-list-item-actions' }>
                      <button
                        className={ 'link' }
                        onClick={ handleClick }
                      >
                        {item.mentions.length} {item.mentions.length === 1 ? translate( 'mention' ) : translate( 'mentions' )}
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
