/* eslint react/forbid-prop-types:0 */
/**
 * This module exports a statefull reusable note player component
 * ============
 * @module peritext-template-deucalion/components/NoteItem
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Renderer from './Renderer';

/**
 * NoteItem class for building NoteItem react component instances
 */
class NoteItem extends Component {

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor( props ) {
    super( props );
  }

  /**
   * Updates data in the context when the state or props change
   */
  getChildContext = () => {
    return {
      inNote: true,
    };
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      note,
      onNotePointerClick,
      style = {},
    } = this.props;

    const bindRef = ( component ) => {
      this.component = component;
    };
    const onClick = ( e ) => {
      e.stopPropagation();
      onNotePointerClick( note.id );
    };
    return (
      <li
        style={ style }
        className={ 'note-item' }
        ref={ bindRef }
        id={ note.id }
      >
        <span
          onClick={ onClick }
          className={ 'link note-block-pointer' }
          id={ `note-block-pointer-${ note.id}` }
        >
          {note.order}
        </span>
        <Renderer raw={ note.contents } />
      </li>
    );
  }
}

/**
 * Component's properties types
 */
NoteItem.propTypes = {
  note: PropTypes.object,
  onNotePointerClick: PropTypes.func,
  style: PropTypes.object,
};

/**
 * Component's context properties provided to children
 */
NoteItem.childContextTypes = {

  /**
   * Specifies that context is a note for all
   * assets displayed in this note
   */
  inNote: PropTypes.bool
};

export default NoteItem;
