"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Renderer = _interopRequireDefault(require("./Renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * NoteItem class for building NoteItem react component instances
 */
class NoteItem extends _react.Component {
  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);

    _defineProperty(this, "getChildContext", () => {
      return {
        inNote: true
      };
    });
  }
  /**
   * Updates data in the context when the state or props change
   */


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      note,
      onNotePointerClick,
      style = {}
    } = this.props;

    const bindRef = component => {
      this.component = component;
    };

    const onClick = e => {
      e.stopPropagation();
      onNotePointerClick(note.id);
    };

    return _react.default.createElement("li", {
      style: style,
      className: 'note-item',
      ref: bindRef,
      id: note.id
    }, _react.default.createElement("span", {
      onClick: onClick,
      className: 'link note-block-pointer',
      id: `note-block-pointer-${note.id}`
    }, note.order), _react.default.createElement(_Renderer.default, {
      raw: note.contents
    }));
  }

}
/**
 * Component's properties types
 */


NoteItem.propTypes = {
  note: _propTypes.default.object,
  onNotePointerClick: _propTypes.default.func,
  style: _propTypes.default.object
};
/**
 * Component's context properties provided to children
 */

NoteItem.childContextTypes = {
  /**
   * Specifies that context is a note for all
   * assets displayed in this note
   */
  inNote: _propTypes.default.bool
};
var _default = NoteItem;
exports.default = _default;