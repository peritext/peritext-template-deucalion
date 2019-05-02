"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _peritextUtils = require("peritext-utils");

var _ContextMention = _interopRequireDefault(require("./ContextMention"));

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

var _ResourceIdentityCard = _interopRequireDefault(require("./ResourceIdentityCard"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const RelatedContexts = ({
  production,
  edition,
  assetId,
  resourceId: inputResourceId
}, {
  translate
}) => {
  const contextualization = production.contextualizations[assetId];
  const resourceId = inputResourceId || contextualization.resourceId;
  const usedContextualizations = (0, _peritextUtils.getContextualizationsFromEdition)(production, edition);
  const related = usedContextualizations.filter(({
    contextualization: {
      id: contextualizationId
    }
  }) => {
    return assetId ? contextualizationId !== assetId && production.contextualizations[contextualizationId].resourceId === resourceId : production.contextualizations[contextualizationId].resourceId === resourceId;
  }).map(({
    contextualization: theContextualization
  }) => _objectSpread({}, theContextualization, (0, _peritextUtils.buildContextContent)(production, theContextualization.id)));
  const resource = production.resources[resourceId];
  let citation = (0, _peritextUtils.resourceToCslJSON)(resource);
  citation = citation && citation.length ? citation[0] : {};
  return _react.default.createElement("div", {
    className: 'related-contexts'
  }, _react.default.createElement("div", {
    className: 'header'
  }, _react.default.createElement(_ResourceIdentityCard.default, {
    resource: resource,
    production: production,
    edition: edition,
    showTitle: false
  }), _react.default.createElement("div", {
    className: 'related-contexts-actions'
  }, citation.URL && _react.default.createElement("a", {
    target: 'blank',
    rel: 'noopener',
    href: citation.URL
  }, translate('Browse online')))), related.length ? _react.default.createElement("ul", {
    className: 'related-contexts-container'
  }, _react.default.createElement("h3", null, translate('This item is mentionned in'), ' : '), related.filter(thatContextualization => thatContextualization.targetContents !== undefined).map(thatContextualization => _react.default.createElement("li", {
    className: 'related-context',
    key: thatContextualization.id
  }, _react.default.createElement(_ContextMention.default, {
    targetContents: thatContextualization.targetContents,
    contents: thatContextualization.contents,
    sectionTitle: thatContextualization.sectionTitle,
    sectionId: thatContextualization.sectionId,
    contextualizationId: thatContextualization.id
  })))) : _react.default.createElement("div", {
    className: 'body'
  }), _react.default.createElement("div", {
    className: 'footer'
  }, _react.default.createElement(_LinkProvider.default, {
    to: {
      routeClass: 'resourceSheet',
      routeParams: {
        resourceId: resource.id
      }
    },
    target: 'blank',
    rel: 'noopener'
  }, translate('Print mentions'))), _react.default.createElement(_reactTooltip.default, {
    id: 'tooltip'
  }));
};

RelatedContexts.contextTypes = {
  translate: _propTypes.default.func
};
var _default = RelatedContexts;
exports.default = _default;