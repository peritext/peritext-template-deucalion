import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { StructuredCOinS, abbrevString, getResourceTitle } from 'peritext-utils';
import Tooltip from 'react-tooltip';

import { convertSectionToCslRecord, makeAssetTitle } from '../utils';

import RelatedContexts from './RelatedContexts';
import NotesContainer from './NotesContainer';
import Renderer from './Renderer';
import SectionHead from './SectionHead';
import InternalLink from './LinkProvider';
import Aside from './Aside';
import Railway from './Railway';
import ResourcePreview from './ResourcePreview';

const ellipse = ( str, max = 50 ) => {
  if ( str.length > max )
    return `${str.substr( 0, max - 3 ) }...`;
  return str;
};

class Section extends Component {

  static contextTypes = {
    scrollToTop: PropTypes.func,
    dimensions: PropTypes.object,
  }
  constructor ( props ) {
    super( props );
    this.state = {
      gui: {
        openedContextualizationId: undefined
      }
    };
  }

  getChildContext = () => {
    const {
      production = {},
      activeViewParams = {}
    } = this.props;
    return {

      openAsideContextualization: this.openAsideContextualization,
      openedContextualizationId: this.state.openedContextualizationId,
      notes: production.resources[activeViewParams.resourceId] && production.resources[activeViewParams.resourceId].data.contents.notes,
      onNoteContentPointerClick: this.onNoteContentPointerClick,
    };
  }

  componentDidMount = () => {
    this.init( this.props );
    this.buildRailwayData();
  }

  componentWillReceiveProps = ( nextProps ) => {
    if (
      this.props.activeViewClass !== nextProps.activeViewClass ||
      this.props.activeViewParams.resourceId !== nextProps.activeViewParams.resourceId ||
      this.props.activeViewParams.contextualizationId !== nextProps.activeViewParams.contextualizationId
    ) {
      this.init( nextProps );
    }
  }

  componentWillUpdate = ( nextProps, nextState, nextContext ) => {

    /*
     * edge case of navigating mentions
     * within the same section
     */
    if (
      this.props.activeViewParams.resourceId === nextProps.activeViewParams.resourceId
      && this.state.gui.openedContextualizationId
      && !nextState.gui.openedContextualizationId
      && nextContext.asideVisible
    ) {
      nextContext.toggleAsideVisible();
    }
    if ( this.context.dimensions && nextContext.dimensions && (
      this.context.dimensions.width !== nextContext.dimensions.width ||
      this.context.dimensions.height !== nextContext.dimensions.height

    ) || this.context.scrollHeight !== nextContext.scrollHeight ) {
      setTimeout( () => this.buildRailwayData() );
    }
  }

  componentDidUpdate = ( prevProps ) => {
    if (
      this.props.activeViewClass !== prevProps.activeViewClass ||
      this.props.activeViewParams.resourceId !== prevProps.activeViewParams.resourceId ||
      this.props.activeViewParams.contextualizationId !== prevProps.activeViewParams.contextualizationId
    ) {
      this.buildRailwayData();
    }
  }

  init = ( props ) => {
    setTimeout( () => {
      if ( props.activeViewParams.contextualizationId ) {
          this.context.scrollToContextualization( props.activeViewParams.contextualizationId );
      }
      else {
        this.context.scrollToTop( 0, false, false );
      }
    } );
    this.setState( {
      gui: {
        openedContextualizationId: undefined
      }
    } );
  }

  buildRailwayData = () => {
      const { scrollHeight, usedDocument } = this.context;
      const theDocument = usedDocument || document;
      let elements = theDocument.querySelector( '.main-contents-wrapper .rendered-content' );
      elements = elements && elements.childNodes;
      const shadows = [];
      if ( elements ) {
          elements.forEach( ( element ) => {
              const { height } = element.getBoundingClientRect();
              shadows.push( {
                  y: element.offsetTop / scrollHeight,
                  h: height / scrollHeight,
                  html: element.innerHTML,
                  text: element.tagName.indexOf( 'H' ) === 0 ? element.textContent : ellipse( element.textContent, 60 ),
                  tagName: element.tagName,
                  element
              } );
          } );
          this.setState( { shadows } );
          Tooltip.rebuild();
      }
  }

  onNoteContentPointerClick = ( noteId ) => {
    this.context.scrollToElementId( noteId );
  }

  onNotePointerClick = ( noteId ) => {
    this.context.scrollToElementId( `note-content-pointer-${noteId}` );
  }

  closeAsideContextualization = () => {
    if ( this.context.asideVisible ) {
      this.context.toggleAsideVisible();
    }
    if ( this.state.gui.openedContextualizationId ) {
      this.setState( {
        gui: {
          ...this.state.gui,
          openedContextualizationId: undefined
        }
      } );
    }
  }

  openAsideContextualization = ( assetId ) => {
    if ( !this.context.asideVisible ) {
      this.context.toggleAsideVisible();
    }
    this.setState( {
      gui: {
        ...this.state.gui,
        openedContextualizationId: assetId,
      }
    } );
  }

  render = () => {
    const {

       closeAsideContextualization,
      state: {
        gui: {
          openedContextualizationId,
        },
        shadows,
      },
      props: {
        production,
        edition = {},
        previousSection,
        nextSection,
        activeViewClass,
        activeViewParams = {},
        options = {},
      },
      context: {
        // dimensions,
        translate = {},
        scrollRatio,
        scrollTopRatio,
        scrollToElement,
        rawCitations,
      },
      onNotePointerClick,
    } = this;

    if ( ![ 'sections', 'resourcePage' ].includes( activeViewClass ) ) {
      return null;
    }

    const {
      data: editionData = {}
    } = edition;

    const {
      publicationTitle = '',
    } = editionData;

    const displayedTitle = publicationTitle.length ?
      publicationTitle
      :
      production.metadata.title;

    const section = production.resources[activeViewParams.resourceId];
    if ( !section ) {
      return null;
    }

    const contents = section.data.contents.contents;
    const sectionAuthors = section.metadata.authors || {};
    const {
      notesPosition,
      displayHeader,
    } = options;

    const sectionAsCSLRecord = convertSectionToCslRecord( section, production, edition );

    return (
      <section className={ `main-contents-container section-player has-notes-position-${notesPosition}` }>
        {
          <SectionHead
            production={ production }
            section={ section }
            edition={ edition }
            withHelmet
          />
        }

        <StructuredCOinS cslRecord={ sectionAsCSLRecord } />
        <div className={ 'main-column' }>
          {
            displayHeader &&
            <ResourcePreview resource={ section } />
          }
          <h1 className={ 'view-title section-title' }>
            {getResourceTitle( section ) || ( translate( 'untitled section' ) || 'Section sans titre' )}
          </h1>
          {section.metadata.subtitle && <h2 className={ 'subtitle' }>{section.metadata.subtitle}</h2>}

          {sectionAuthors.length > 0 &&
          <h2 className={ 'authors' }>
            {
                  sectionAuthors &&
                  sectionAuthors.length > 0 &&
                  sectionAuthors
                  .map( ( author, index ) => <span key={ index }>{author.given} {author.family}</span> )
                  .reduce( ( prev, curr ) => [ prev, ', ', curr ] )
                }
          </h2>
            }
          <div className={ 'main-contents-wrapper' }>
            <Renderer raw={ contents } />
          </div>

        </div>
        {Object.keys( section.data.contents.notes ).length > 0 ?
          <NotesContainer
            pointers={ this.noteContentPointers }
            notes={ section.data.contents.notes }
            notesOrder={ section.data.contents.notesOrder }
            notesPosition={ notesPosition }
            title={ translate( 'Notes' ) }
            id={ 'notes-container' }
            onNotePointerClick={ onNotePointerClick }
          />
           : null}
        <footer className={ 'navigation-footer' }>
          <ul>
            {previousSection &&
            <li className={ 'prev' }>
              <InternalLink
                to={ { routeClass: 'sections', viewId: previousSection.viewId, routeParams: { resourceId: previousSection.routeParams.resourceId } } }
              >
                <span className={ 'navigation-item' }>
                  <span className={ 'navigation-item-arrow' }>←</span>
                  <span className={ 'navigation-item-text' }>
                    {abbrevString( getResourceTitle( production.resources[previousSection.routeParams.resourceId] ), 40 ) }
                  </span>
                </span>

              </InternalLink>
            </li>
                }
            <li>
              <i>{abbrevString( displayedTitle, 30 )} - {abbrevString( getResourceTitle( section ), 40 )}</i>
            </li>
            {nextSection &&
            <li className={ 'next' }>
              <InternalLink
                to={ { routeClass: 'sections', viewId: nextSection.viewId, routeParams: { resourceId: nextSection.routeParams.resourceId } } }
              >
                <span className={ 'navigation-item' }>
                  <span className={ 'navigation-item-text' }>{abbrevString( getResourceTitle( production.resources[nextSection.routeParams.resourceId] ), 40 ) }</span>
                  <span className={ 'navigation-item-arrow' }>→</span>
                </span>

              </InternalLink>
            </li>
                }
          </ul>
        </footer>
        {
          openedContextualizationId ?
            <Aside
              isActive={
              openedContextualizationId !== undefined
            }
              title={ openedContextualizationId && makeAssetTitle( production.resources[production.contextualizations[openedContextualizationId].sourceId], production, edition, rawCitations )/*translate( 'More informations' )*/ }
              onClose={ closeAsideContextualization }
            >
              <RelatedContexts
                production={ production }
                edition={ edition }
                assetId={ openedContextualizationId }
                onDismiss={ closeAsideContextualization }
              />
            </Aside>
          :
            <Railway
              scrollRatio={ scrollRatio }
              scrollTopRatio={ scrollTopRatio }
              scrollToElement={ scrollToElement }
              shadows={ shadows }
            />
        }
      </section>
    );
  }
}

Section.childContextTypes = {
  openAsideContextualization: PropTypes.func,
  openedContextualizationId: PropTypes.string,
  notes: PropTypes.object,
  onNoteContentPointerClick: PropTypes.func,
};

Section.contextTypes = {
  dimensions: PropTypes.object,
  production: PropTypes.object,
  scrollTopRatio: PropTypes.number,
  scrollTopAbs: PropTypes.number,
  scrollRatio: PropTypes.number,
  scrollHeight: PropTypes.number,
  scrollToTop: PropTypes.func,
  scrollToElementId: PropTypes.func,
  contextualizers: PropTypes.object,
  translate: PropTypes.func,
  citations: PropTypes.object,
  usedDocument: PropTypes.object,
  rawCitations: PropTypes.object,

  scrollToContextualization: PropTypes.func,
  scrollToElement: PropTypes.func,
  toggleAsideVisible: PropTypes.func,
  asideVisible: PropTypes.bool,
};

export default Section;
