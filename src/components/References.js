import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RelatedContexts from './RelatedContexts';
import Aside from './Aside';
import { buildContextContent, buildCitations, getContextualizationsFromEdition, resourceToCslJSON, resourceHasContents } from 'peritext-utils';
import { makeBibliography } from 'react-citeproc';
import uniq from 'lodash/uniq';

import Link from './LinkProvider';

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
        return contextualization.sourceId;
      } )
    );
  // filter by type of resource
  citedResourcesIds = citedResourcesIds.filter( ( resourceId ) => {
    const type = resources[resourceId].metadata.type;
    return resourceTypes.includes( type );
  } );
  const resourcesMap = citedResourcesIds.reduce( ( res, resourceId ) => {
    const mentions = contextualizations.filter( ( c ) => c.contextualization.sourceId === resourceId )
    .map( ( c ) => ( {
      ...c,
      id: c.contextualization.id,
      contextContent: buildContextContent( production, c.contextualization.id )
    } ) );

    const citation = resourceToCslJSON( resources[resourceId] )[0];
    if ( resources[resourceId].metadata.type === 'bib' ) {
      return {
        ...res,
        [resources[resourceId].data.citations[0].id]: {
          ...resources[resourceId],
          citation,
          mentions
        }
      };
    }
    return {
      ...res,
      [resourceId]: {
        ...resources[resourceId],
        mentions,
        citation
      }
    };
  }, {} );

  const bibliographyData = makeBibliography(
    citations.citationItems,
    edition.data.citationStyle.data,
    edition.data.citationLocale.data,
  );
  const ids = bibliographyData[0].entry_ids.map( ( group ) => group[0] );
  let items = ids
  // .filter( ( id ) => resourcesMap[id] )
  .map( ( id, index ) => ( {
    id,
    resource: resourcesMap[id],
    citation: resourcesMap[id] && resourcesMap[id].citation,
    html: bibliographyData[1][index]
  } ) )
  .filter( ( i ) => i.citation );

  items = items.sort( ( a, b ) => {
    switch ( sortingKey ) {
      case 'mentions':
        if ( a.resource.mentions.length > b.resource.mentions.length ) {
          return -1;
        }
        return 1;
      case 'date':
        const datePartsA = a.citation.issued && a.citation.issued['date-parts'];
        const datePartsB = b.citation.issued && b.citation.issued['date-parts'];
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
        if ( a.citation.author && b.citation.author ) {
          const authorsA = a.citation.author && a.citation.author.map( ( author ) => `${author.family}-${author.given}`.toLowerCase() ).join( '' );
          const authorsB = b.citation.author && b.citation.author.map( ( author ) => `${author.family}-${author.given}`.toLowerCase() ).join( '' );
          if ( authorsA > authorsB ) {
            return 1;
          }
          else return -1;
        }
        else if ( !b.citation.author ) {
          return -1;
        }
        else if ( !a.citation.author ) {
          return 1;
        }
        else return 0;
      case 'title':
        if ( a.citation.title.toLowerCase() > b.citation.title.toLowerCase() ) {
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

const ReferenceCard = ( {
  item,
  onOpen,
  translate,
  showMentions
} ) => {
    return (
      <li
        className={ 'big-list-item' }
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
      },
    } = this;

    const {
      showUncitedReferences = false,
      resourceTypes = [ 'bib' ],
      sortingKey = 'authors',
      sortingAscending = true,
    } = options;

    const contextualizations = getContextualizationsFromEdition( production, edition );
    const citations = buildCitations( { production, edition } );

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
    this.setState( {
      references,
      citations,
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
