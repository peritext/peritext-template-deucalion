"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ContextMention = _interopRequireDefault(require("./ContextMention"));

var _reactAddonsCssTransitionGroup = _interopRequireDefault(require("react-addons-css-transition-group"));

var _peritextUtils = require("peritext-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getEntryName = entry => {
  return entry.item && entry.item.title || entry.resource && entry.resource.data.name || entry.given && `${entry.family} ${entry.given}` || entry.id;
};

const MentionsContainer = ({
  title,
  entries = [],
  toggleOpenedItemId,
  openedItemId,
  entryNameGetter,
  className = ''
}, {
  translate
}) => _react.default.createElement("div", {
  className: `mentions-container ${className}`
}, _react.default.createElement("h2", null, title), _react.default.createElement("ul", {
  className: 'index-list'
}, entries.map((entry, index) => {
  const entryName = entryNameGetter ? entryNameGetter(entry) : getEntryName(entry);
  const expanded = openedItemId === entry.id;

  const toggleItemExpansion = () => toggleOpenedItemId(entry.id);

  return _react.default.createElement("li", {
    key: index,
    id: entryName,
    className: `mentions-list-container ${expanded ? 'expanded' : ''}`
  }, entry.item && _react.default.createElement(_peritextUtils.StructuredCOinS, {
    cslRecord: entry.item
  }), _react.default.createElement("h3", {
    className: 'index-list-title',
    onClick: toggleItemExpansion
  }, entryName, " ", _react.default.createElement("button", {
    className: `collapse-btn ${expanded ? ' active' : ''}`
  }, expanded ? `- ${translate('Hide mentions')}` : `+${translate('Show mentions')}`)), _react.default.createElement(_reactAddonsCssTransitionGroup.default, {
    transitionName: 'mentions-animation',
    transitionEnterTimeout: 500,
    transitionLeaveTimeout: 300
  }, expanded && _react.default.createElement("ul", {
    className: 'mentions-list'
  }, entry.mentions.filter(mention => mention.contextContent !== undefined && mention.contextContent.targetContents !== undefined).map((mention, count) => {
    const {
      contextContent: {
        targetContents,
        contents,
        sectionTitle,
        sectionId
      },
      id
    } = mention;
    return _react.default.createElement("li", {
      key: count,
      id: id
    }, _react.default.createElement(_ContextMention.default, {
      targetContents: targetContents,
      contents: contents,
      sectionTitle: sectionTitle,
      sectionId: sectionId,
      contextualizationId: id
    }));
  }))));
})));

MentionsContainer.contextTypes = {
  translate: _propTypes.default.func
};
var _default = MentionsContainer;
exports.default = _default;