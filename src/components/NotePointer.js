/**
 * This module exports a stateless reusable note pointer component
 * ============
 * @module peritext-template-deucalion/components/NotePointer
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a not pointer as a pure component
 * @param {object} props
 * @param {array} props.children - children elements of the component
 * @param {array} props.noteId - the id of the note to point to
 * @param {object} context - the context data of the component
 * @return {ReactElement} component - the component
 */
const NotePointer = ( {
  children,
  noteId = '',
}, context ) => {
  const notes = context.notes;
  const onNoteContentPointerClick = () => {
    return typeof context.onNoteContentPointerClick === 'function' && context.onNoteContentPointerClick( noteId );
  };
  if ( notes ) {
    const note = notes[noteId];
    if ( note ) {
      return (
        <sup
          onClick={ onNoteContentPointerClick }
          className={ 'note-content-pointer link' }
          id={ `note-content-pointer-${ noteId}` }
        >
          {note.order}
          {children}
        </sup>
      );
    }
    return null;
  }
  return null;
};

/**
 * Component's properties types
 */
NotePointer.propTypes = {

  /**
   * Children react components
   */
  children: PropTypes.array,

  /**
   * id of the note to render
   */
  noteId: PropTypes.string,
};

/**
 * Component's context used properties
 */
NotePointer.contextTypes = {

  /**
   * Map of available notes to look into
   */
  notes: PropTypes.object,

  /**
   * Triggers a callback upstream when the pointer is clicked
   */
  onNoteContentPointerClick: PropTypes.func,
};

export default NotePointer;
