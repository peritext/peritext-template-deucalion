/**
 * This module exports a statefull reusable notes container component
 * When notes are displayed as footnotesnotes it displays them as stacked blocks.
 * When notes are displayed as sidenotes it tries to align them with
 * their pointer, and handles the overflows by stacking them.
 * ============
 * @module peritext-template-deucalion/components/NotesContainer
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NoteItem from './NoteItem';

/**
 * Retrieves the absolute offset of an element
 * (this avoids to use an additionnal lib such as jquery to handle the operation)
 * (todo: this should be stored in a separate utils file)
 * @param {DOMElement} el - the element to inspect
 * @return {object} offset - the absolute offset of the element
 */
function getOffset( el ) {
    let _x = 0;
    let _y = 0;
    while ( el && !el.classList.contains( 'deucalion-layout' ) && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

/**
 * NotesContainer class for building notes container react component instances
 */
class NotesContainer extends Component {

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor( props ) {
    super( props );
    this.notes = {};

    /**
     * Initial state
     */
    this.state = {

      /**
       * notesStyles will store a map of styles for each note
       * (keys will be notes ids, values styling objects)
       */
      notesStyles: {}
    };
  }

  /**
   * Executes code after the component was mounted
   */
  componentDidMount() {

    /*
     * if notes are displayed side by side with content
     * we have to compute their position after contents were
     * rendered a first time
     */
    if ( this.props.notesPosition === 'sidenotes' ) {
      setTimeout( () => {
        this.updatePositions();
      } );
    }
  }

  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps( nextProps, nextContext ) {
    if (
      ( this.props.notesPosition !== nextProps.notesPosition && nextProps.notesPosition === 'sidenotes' ) ||
      ( nextProps.notesPosition === 'sidenotes' && this.context.dimensions.width !== nextContext.dimensions.width ) ||
      ( nextProps.notesPosition === 'sidenotes' && this.props.notes !== nextProps.notes )
    ) {
      this.updatePositions();

      /*
       * we launch it a second time to wait the height
       * of notes has adjusted to their new container
       * (todo: improve that)
       */
      setTimeout( this.updatePositions );
      setTimeout( this.updatePositions, 1000 );
    }
  }

  /**
   * Updates the position of each note according to the notes position option
   * and positions of note pointers if in sideNotes mode
   */
  updatePositions = () => {
    // we store the elements to position in the right order
    const components = this.props.notesOrder
      .map( ( noteId ) => {
        const note = this.props.notes[noteId];
        const usedDocument = this.context.usedDocument || document;
        const component = usedDocument.getElementById( `note-content-pointer-${ note.id}` );
        // const position = component.getBoundingClientRect();
        const position = getOffset( component );
        return {
          order: note.finalOrder,
          noteId: note.id,
          component,
          offsetTop: position.top,
        };
      } );

    const notesStyles = {};
    let y = 0;
    let prevHeight = 0;

    /*
     * we try to position the elements in front of their pointer
     * stack them if they would overlapp with a previous note
     * (todo: this could be improved)
     */
    for ( let index = 0; index < components.length; index ++ ) {
      const component = components[index];
      const wantedHeight = component.offsetTop;
      if ( wantedHeight > y + prevHeight ) {
        y = wantedHeight;
      }
      else {
        y = y + prevHeight;
      }
      // update prevHeight with current component
      const noteItem = this.notes[component.noteId];
      prevHeight = noteItem.component.offsetHeight;
      // update note styles
      notesStyles[component.noteId] = {
        top: y,
        position: 'absolute',
        left: 0
      };
    }
    this.setState( { notesStyles } );
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render () {
    const {
      id,
      notes,
      notesOrder,
      onNotePointerClick,
      notesPosition,
      title
    } = this.props;

    const {
      notesStyles
    } = this.state;

    return (
      <div className={ `notes-container is-position-${ notesPosition}` }>
        <h2
          className={ 'notes-title' }
          id={ id }
        >{title}
        </h2>
        <ol className={ 'notes-list' }>
          {
            notesOrder
            .map( ( noteId, index ) => {
              const note = notes[noteId];
              const bindRef = ( noteEl ) => {
                this.notes[note.id] = noteEl;
              };
              return (
                <NoteItem
                  key={ index }
                  note={ note }
                  onNotePointerClick={ onNotePointerClick }
                  ref={ bindRef }
                  style={ this.props.notesPosition === 'sidenotes' ? notesStyles[note.id] : {} }
                />
              );
            } )
          }
        </ol>
      </div>
      );

  }
}

NotesContainer.contextTypes = {
  usedDocument: PropTypes.object,
  dimensions: PropTypes.object,
};

/**
 * Component's properties types
 */
NotesContainer.propTypes = {
  notes: PropTypes.object,
  notesOrder: PropTypes.array,
  notesPosition: PropTypes.oneOf( [ 'sidenotes', 'footnotes' ] ),
  onNotePointerClick: PropTypes.func,
};

export default NotesContainer;
