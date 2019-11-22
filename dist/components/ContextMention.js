"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Renderer = _interopRequireDefault(require("./Renderer"));

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ContextMention = ({
  contents,
  sectionTitle,
  targetId,
  contextualizationId,
  displayLinks = true
}, {
  // translate,
  getViewIdForSectionId
}) => {
  const viewId = getViewIdForSectionId(targetId);
  return _react.default.createElement("div", {
    className: 'context-mention',
    "data-tip": sectionTitle,
    "data-for": 'tooltip',
    "data-place": 'left'
  }, displayLinks ? _react.default.createElement("div", null, _react.default.createElement("div", {
    className: 'excerpt'
  }, _react.default.createElement(_LinkProvider.default, {
    to: {
      routeClass: viewId ? 'sections' : 'resourcePage',
      viewId,
      routeParams: {
        resourceId: targetId,
        contextualizationId
      }
    }
  }, _react.default.createElement(_Renderer.default, {
    raw: contents
  }), _react.default.createElement("h3", {
    className: 'mention-section-name'
  }, sectionTitle)))) : _react.default.createElement("div", null, _react.default.createElement("h3", null, sectionTitle), _react.default.createElement("div", {
    className: 'excerpt'
  }, _react.default.createElement(_Renderer.default, {
    raw: contents
  }))));
};

ContextMention.contextTypes = {
  translate: _propTypes.default.func,
  getViewIdForSectionId: _propTypes.default.func
};
var _default = ContextMention;
exports.default = _default;