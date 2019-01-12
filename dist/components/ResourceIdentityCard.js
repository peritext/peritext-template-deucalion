"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _MarkdownPlayer = _interopRequireDefault(require("./MarkdownPlayer"));

var _reactCiteproc = require("react-citeproc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const makeAssetTitle = (resource, production, edition, citations) => {
  const type = resource.metadata.type;

  switch (type) {
    case 'glossary':
      return resource.data.name ? resource.data.name : `${resource.data.firstName} ${resource.data.lastName}`;

    case 'bib':
      const citation = (0, _reactCiteproc.makeBibliography)(citations.citationItems, edition.data.citationStyle.data, edition.data.citationLocale.data, {
        select: [{
          field: 'id',
          value: resource.data[0].id
        }]
      })[1];
      return _react.default.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: citation
        }
      });

    /* eslint react/no-danger : 0 */

    default:
      return resource.metadata.title;
  }
};

const ResourceIdentityCard = ({
  resource,
  production,
  edition
}, {
  rawCitations,
  contextualizers,
  translate
}) => {
  const assetTitle = makeAssetTitle(resource, production, edition, rawCitations);
  const Citation = resource.metadata.type !== 'glossary' && contextualizers.bib && contextualizers.bib.Block;
  return _react.default.createElement("div", {
    className: 'resource-identity-card'
  }, _react.default.createElement("div", {
    className: 'main-info'
  }, _react.default.createElement("div", {
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
  }, translate(resource.metadata.type)), resource.metadata.description && resource.metadata.description.trim().length && _react.default.createElement("div", {
    className: 'description'
  }, _react.default.createElement(_MarkdownPlayer.default, {
    src: resource.metadata.description
  })), resource.metadata.source && resource.metadata.source.trim().length && _react.default.createElement("div", {
    className: 'source'
  }, _react.default.createElement("span", null, translate('source')), ": ", _react.default.createElement("span", null, resource.metadata.source))));
};

ResourceIdentityCard.contextTypes = {
  rawCitations: _propTypes.default.object,
  contextualizers: _propTypes.default.object,
  translate: _propTypes.default.func
};
var _default = ResourceIdentityCard;
exports.default = _default;