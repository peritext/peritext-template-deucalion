"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _NoteItem = _interopRequireDefault(require("./NoteItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Retrieves the absolute offset of an element
 * (this avoids to use an additionnal lib such as jquery to handle the operation)
 * (todo: this should be stored in a separate utils file)
 * @param {DOMElement} el - the element to inspect
 * @return {object} offset - the absolute offset of the element
 */
function getOffset(el) {
  let _x = 0;
  let _y = 0;

  while (el && !el.classList.contains('deucalion-layout') && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }

  return {
    top: _y,
    left: _x
  };
}
/**
 * NotesContainer class for building notes container react component instances
 */


class NotesContainer extends _react.Component {
  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);

    _defineProperty(this, "componentDidUpdate", prevProps => {
      if (this.props.notesPosition === 'sidenotes' && (this.props.notesPosition !== prevProps.notesPosition || this.props.notes !== prevProps.notes)) {
        setTimeout(() => {
          this.updatePositions();
        });
      }
    });

    _defineProperty(this, "updatePositions", () => {
      // we store the elements to position in the right order
      const components = this.props.notesOrder.map(noteId => {
        const note = this.props.notes[noteId];
        const usedDocument = this.context.usedDocument || document;
        const component = usedDocument.getElementById(`note-content-pointer-${note.id}`); // const position = component.getBoundingClientRect();

        const position = getOffset(component);
        return {
          order: note.finalOrder,
          noteId: note.id,
          component,
          offsetTop: position.top
        };
      });
      const notesStyles = {};
      let y = 0;
      let prevHeight = 0;
      /*
       * we try to position the elements in front of their pointer
       * stack them if they would overlapp with a previous note
       * (todo: this could be improved)
       */

      for (let index = 0; index < components.length; index++) {
        const component = components[index];
        const wantedHeight = component.offsetTop;

        if (wantedHeight > y + prevHeight) {
          y = wantedHeight;
        } else {
          y = y + prevHeight;
        } // update prevHeight with current component


        const noteItem = this.notes[component.noteId];
        prevHeight = noteItem.component.offsetHeight; // update note styles

        notesStyles[component.noteId] = {
          top: y,
          position: 'absolute',
          left: 0
        };
      }

      this.setState({
        notesStyles
      });
    });

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
    if (this.props.notesPosition === 'sidenotes') {
      setTimeout(() => {
        this.updatePositions();
      }, 2000);
    }
  }
  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */


  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.notesPosition === 'sidenotes' && // ( this.props.notesPosition !== nextProps.notesPosition ) ||
    this.context.dimensions.width !== nextContext.dimensions.width) {
      // this.updatePositions();

      /*
       * we launch it a second time to wait the height
       * of notes has adjusted to their new container
       * (todo: improve that)
       */
      setTimeout(this.updatePositions); // setTimeout( this.updatePositions, 1000 );
    }
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
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
    return _react.default.createElement("div", {
      className: `notes-container is-position-${notesPosition}`
    }, _react.default.createElement("h2", {
      className: 'notes-title',
      id: id
    }, title), _react.default.createElement("ol", {
      className: 'notes-list'
    }, notesOrder.map((noteId, index) => {
      const note = notes[noteId];

      const bindRef = noteEl => {
        this.notes[note.id] = noteEl;
      };

      return _react.default.createElement(_NoteItem.default, {
        key: index,
        note: note,
        onNotePointerClick: onNotePointerClick,
        ref: bindRef,
        style: this.props.notesPosition === 'sidenotes' ? notesStyles[note.id] : {}
      });
    })));
  }

}

NotesContainer.contextTypes = {
  usedDocument: _propTypes.default.object,
  dimensions: _propTypes.default.object
};
/**
 * Component's properties types
 */

NotesContainer.propTypes = {
  notes: _propTypes.default.object,
  notesOrder: _propTypes.default.array,
  notesPosition: _propTypes.default.oneOf(['sidenotes', 'footnotes']),
  onNotePointerClick: _propTypes.default.func
};
var _default = NotesContainer;
exports.default = _default;