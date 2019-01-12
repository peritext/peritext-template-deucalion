"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _MarkdownPlayer = _interopRequireDefault(require("./MarkdownPlayer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FrontCover = ({
  activeViewParams,
  options = {}
}) => {
  const {
    title,
    markdownContents,
    customCssId = activeViewParams.routeSlug
  } = options;
  return _react.default.createElement("div", {
    id: customCssId,
    className: 'custom-page main-contents-container'
  }, _react.default.createElement("div", {
    className: 'main-column'
  }, _react.default.createElement("div", {
    className: 'header view-title'
  }, _react.default.createElement("h1", null, title)), _react.default.createElement("div", {
    className: 'contents'
  }, _react.default.createElement(_MarkdownPlayer.default, {
    src: markdownContents
  }))));
};

var _default = FrontCover;
exports.default = _default;