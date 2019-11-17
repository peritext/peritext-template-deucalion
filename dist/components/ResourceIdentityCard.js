"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _MarkdownPlayer = _interopRequireDefault(require("./MarkdownPlayer"));

var _peritextUtils = require("peritext-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ResourceIdentityCard = ({
  resource,
  showTitle = true
}, {
  contextualizers,
  translate
}) => {
  const assetTitle = (0, _peritextUtils.getResourceTitle)(resource);
  const Citation = resource.metadata.type !== 'glossary' && contextualizers.bib && contextualizers.bib.Block;
  const description = resource.metadata.type === 'glossary' ? resource.data.description : resource.metadata.description;
  return _react.default.createElement("div", {
    className: 'resource-identity-card'
  }, _react.default.createElement("div", {
    className: 'main-info'
  }, showTitle && _react.default.createElement("div", {
    className: 'title'
  }, !Citation && _react.default.createElement("span", {
    className: 'resource-identity-card-title'
  }, assetTitle), Citation && _react.default.createElement(Citation, {
    resource: resource,
    renderingMode: 'screened'
  }))), _react.default.createElement("div", {
    className: 'additional-info'
  }, _react.default.createElement("div", {
    className: 'type'
  }, translate(resource.metadata.type === 'glossary' ? resource.data.entryType : resource.metadata.type)), description && description.trim().length && _react.default.createElement("div", {
    className: 'description'
  }, _react.default.createElement(_MarkdownPlayer.default, {
    src: description
  })), resource.metadata.source && resource.metadata.source.trim().length && _react.default.createElement("div", {
    className: 'source'
  }, _react.default.createElement("span", null, translate('source')), ": ", _react.default.createElement("span", null, resource.metadata.source))));
};

ResourceIdentityCard.contextTypes = {
  citationItems: _propTypes.default.object,
  contextualizers: _propTypes.default.object,
  translate: _propTypes.default.func
};
var _default = ResourceIdentityCard;
exports.default = _default;