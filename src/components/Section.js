import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { StructuredCOinS } from 'peritext-utils';

import RelatedContexts from './RelatedContexts';
import NotesContainer from './NotesContainer';
import Renderer from './Renderer';
import SectionHead from './SectionHead';
import InternalLink from './LinkProvider';
import Aside from './Aside';

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
      notes: production.sections[activeViewParams.sectionId].notes,
      onNoteContentPointerClick: this.onNoteContentPointerClick,
    };
  }

  componentDidMount = () => {
    this.init( this.props );
  }

  componentWillReceiveProps = ( nextProps ) => {
    if (
      this.props.activeViewClass !== nextProps.activeViewClass ||
      this.props.activeViewParams !== nextProps.activeViewParams
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
      this.props.activeViewParams.sectionId === nextProps.activeViewParams.sectionId
      && this.state.gui.openedContextualizationId
      && !nextState.gui.openedContextualizationId
      && nextContext.asideVisible
    ) {
      nextContext.toggleAsideVisible();
    }
  }

  init = ( props ) => {
    if ( props.activeViewParams.contextualizationId ) {
      setTimeout( () => {
        this.context.scrollToContextualization( props.activeViewParams.contextualizationId );
      } );
    }
    else {
      this.context.scrollToTop( 0 );
    }
    this.setState( {
      gui: {
        openedContextualizationId: undefined
      }
    } );
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
      },
      props: {
        production,
        edition,
        previousSection,
        nextSection,
        activeViewClass,
        activeViewParams = {},
        options = {},
      },
      context: {
        // dimensions,
        translate = {},
      },
      onNotePointerClick,
    } = this;

    if ( activeViewClass !== 'sections' ) {
      return null;
    }

    const section = production.sections[activeViewParams.sectionId];
    if ( !section ) {
      return;
    }

    const contents = section.contents;
    const sectionAuthors = section.metadata.authors;
    const notesPosition = options.notesPosition;

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
        <StructuredCOinS resource={ section } />
        <div className={ 'main-column' }>
          <h1 className={ 'view-title section-title' }>
            {section.metadata.title || ( translate( 'untitled section' ) || 'Section sans titre' )}
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
          <Renderer raw={ contents } />

        </div>
        {Object.keys( section.notes ).length > 0 ?
          <NotesContainer
            pointers={ this.noteContentPointers }
            notes={ section.notes }
            notesOrder={ section.notesOrder }
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
                to={ { routeClass: 'sections', viewId: previousSection.viewId, routeParams: { sectionId: previousSection.routeParams.sectionId } } }
              >
                  ← {production.sections[previousSection.routeParams.sectionId].metadata.title }
              </InternalLink>
            </li>
                }
            <li>
              <i>{production.metadata.title} - {section.metadata.title}</i>
            </li>
            {nextSection &&
            <li className={ 'next' }>
              <InternalLink
                to={ { routeClass: 'sections', viewId: nextSection.viewId, routeParams: { sectionId: nextSection.routeParams.sectionId } } }
              >
                {production.sections[nextSection.routeParams.sectionId].metadata.title } →
              </InternalLink>
            </li>
                }
          </ul>
        </footer>
        <Aside
          isActive={
            openedContextualizationId !== undefined
          }
          title={ openedContextualizationId && translate( 'More informations' ) }
          onClose={ closeAsideContextualization }
        >
          {
            openedContextualizationId &&
            <RelatedContexts
              production={ production }
              edition={ edition }
              assetId={ openedContextualizationId }
              onDismiss={ closeAsideContextualization }
            />
          }
        </Aside>
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
  scrollTopAbs: PropTypes.number,
  scrollToTop: PropTypes.func,
  scrollToElementId: PropTypes.func,
  contextualizers: PropTypes.object,
  translate: PropTypes.func,
  citations: PropTypes.object,

  scrollToContextualization: PropTypes.func,
  scrollToElement: PropTypes.func,
  toggleAsideVisible: PropTypes.func,
  asideVisible: PropTypes.bool,
};

export default Section;
