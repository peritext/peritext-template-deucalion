"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _redraft = _interopRequireDefault(require("redraft"));

var _peritextSchemas = require("peritext-schemas");

var _Link = _interopRequireDefault(require("./Link"));

var _BlockAssetWrapper = _interopRequireDefault(require("./BlockAssetWrapper"));

var _InlineAssetWrapper = _interopRequireDefault(require("./InlineAssetWrapper"));

var _NotePointer = _interopRequireDefault(require("./NotePointer"));

var _SectionLink = _interopRequireDefault(require("./SectionLink"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const {
  LINK,
  BLOCK_ASSET,
  INLINE_ASSET,
  SECTION_POINTER
  /*
   * NOTE_POINTER,
   */

} = _peritextSchemas.constants.draftEntitiesNames; // just a helper to add a <br /> after each block

const addBreaklines = children => children.map((child, index) => [child, _react.default.createElement("br", {
  key: index + 1
})]);
/**
 * Define the renderers
 */


const renderers = {
  /**
   * Those callbacks will be called recursively to render a nested structure
   */
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: (children, {
      key
    }) => _react.default.createElement("strong", {
      key: key
    }, children),
    ITALIC: (children, {
      key
    }) => _react.default.createElement("em", {
      key: key
    }, children),
    UNDERLINE: (children, {
      key
    }) => _react.default.createElement("u", {
      key: key
    }, children),
    CODE: (children, {
      key
    }) => _react.default.createElement("span", {
      key: key
    }, children)
  },

  /**
   * Blocks receive children and depth
   * Note that children are an array of blocks with same styling,
   */
  blocks: {
    'unstyled': (children, {
      keys
    }) => children.map((child, index) => _react.default.createElement("div", {
      className: 'unstyled',
      id: keys[index],
      key: index
    }, child)),
    'blockquote': (children, {
      keys
    }) => _react.default.createElement("blockquote", {
      id: keys[0]
    }, addBreaklines(children)),
    'header-one': (children, {
      keys
    }) => children.map((child, index) => _react.default.createElement("h1", {
      id: keys[index],
      key: index
    }, child)),
    'header-two': (children, {
      keys
    }) => children.map((child, index) => _react.default.createElement("h2", {
      id: keys[index],
      key: index
    }, child)),
    'header-three': (children, {
      keys
    }) => children.map((child, index) => _react.default.createElement("h3", {
      id: keys[index],
      key: index
    }, child)),
    'header-four': (children, {
      keys
    }) => children.map((child, index) => _react.default.createElement("h4", {
      id: keys[index],
      key: index
    }, child)),
    'header-five': (children, {
      keys
    }) => children.map((child, index) => _react.default.createElement("h5", {
      id: keys[index],
      key: index
    }, child)),
    'header-six': (children, {
      keys
    }) => children.map((child, index) => _react.default.createElement("h6", {
      id: keys[index],
      key: index
    }, child)),
    // You can also access the original keys of the blocks
    'code-block': (children, {
      keys
    }) => _react.default.createElement("pre", {
      key: keys[0]
    }, addBreaklines(children)),
    // or depth for nested lists
    'unordered-list-item': (children, {
      depth,
      keys
    }) => _react.default.createElement("ul", {
      key: keys[keys.length - 1],
      className: `ul-level-${depth}`
    }, children.map((child, index) => _react.default.createElement("li", {
      key: index
    }, child))),
    'ordered-list-item': (children, {
      depth,
      keys
    }) => _react.default.createElement("ol", {
      key: keys.join('|'),
      className: `ol-level-${depth}`
    }, children.map((child, index) => _react.default.createElement("li", {
      key: keys[index]
    }, child)))
    /*
     * If your blocks use meta data it can also be accessed like keys
     * atomic: (children, { keys, data }) => children.map((child, i) => <Atomic key={keys[i]} {...data[i]}>{child}</Atomic>),
     */

  },

  /**
   * Entities receive children and the entity data
   */
  entities: {
    //   // key is the entity key value from raw
    [LINK]: (children, data, {
      key
    }) => _react.default.createElement(_Link.default, {
      key: key,
      to: data.url
    }, children),
    [BLOCK_ASSET]: (children, data, {
      key
    }) => {
      return _react.default.createElement(_BlockAssetWrapper.default, {
        key: key,
        data: data
      }, children);
    },
    [INLINE_ASSET]: (children, data, {
      key
    }) => {
      return _react.default.createElement(_InlineAssetWrapper.default, {
        data: data,
        key: key
      }, children);
    },
    NOTE_POINTER: (children, data, {
      key
    }) => {
      return _react.default.createElement(_NotePointer.default, {
        key: key,
        children: children,
        noteId: data.noteId
      });
    },
    [SECTION_POINTER]: (children, data, {
      key
    }) => {
      return _react.default.createElement(_SectionLink.default, {
        key: key,
        sectionId: data.sectionId
      }, children);
    }
  }
};
/**
 * Renderer class for building raw-to-react rendering react component instances
 */

class Renderer extends _react.Component {
  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
  }
  /**
   * Determines whether to update the component or not
   * @param {object} nextProps - the future properties of the component
   * @return {boolean} shouldUpdate - yes or no
   */


  shouldComponentUpdate() {
    return true; // return this.props.raw !== nextProps.raw;
  }
  /**
   * Displays something when no suitable content state is provided to the renderer
   * @return {ReactElement} default message
   */


  renderWarning() {
    return _react.default.createElement("div", null);
  }
  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */


  render() {
    const {
      raw
    } = this.props;

    if (!raw) {
      return this.renderWarning();
    }

    const rendered = (0, _redraft.default)(raw, renderers); // redraft can return a null if there's nothing to render

    if (!rendered) {
      return this.renderWarning();
    }

    return _react.default.createElement("div", {
      className: 'rendered-content'
    }, rendered);
  }

}
/**
 * Component's properties types
 */


Renderer.propTypes = {
  /**
   * Draft-js raw representation of some contents
   * see https://draftjs.org/docs/api-reference-data-conversion.html
   */
  raw: _propTypes.default.object
};
var _default = Renderer;
exports.default = _default;