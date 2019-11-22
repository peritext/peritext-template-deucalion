"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _peritextUtils = require("peritext-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const InlineAssetWrapper = ({
  data,
  children
}, {
  production,
  contextualizers,
  openedContextualizationId,
  openAsideContextualization,
  bindContextualizationElement,
  // renderingMode = 'screened',
  productionAssets: assets = {}
}) => {
  const assetId = data.asset && data.asset.id;

  if (!assetId || !production) {
    return null;
  }

  const contextualization = production.contextualizations[assetId];

  if (!contextualization) {
    return null;
  }

  const contextualizer = production.contextualizers[contextualization.contextualizerId];
  const resource = production.resources[contextualization.sourceId];
  const contextualizerModule = contextualizers[contextualizer.type];
  const Component = contextualizerModule && contextualizerModule.Inline;

  const onClick = () => {
    if (typeof openAsideContextualization === 'function') {
      openAsideContextualization(contextualization.id);
    }
  };

  const handleMainClick = () => {
    if (resource.metadata.type === 'glossary' || resource.metadata.type === 'bib') {
      onClick();
    }
  };

  const active = assetId === openedContextualizationId;

  const bindRef = element => {
    if (typeof bindContextualizationElement === 'function') {
      bindContextualizationElement(contextualization.id, element);
    }
  };

  if (contextualizer && Component) {
    return _react.default.createElement("span", {
      className: `${'inline-'}${contextualizer.type} ${active ? 'active' : ''} inline-contextualization-container ${contextualizer.type}`,
      id: assetId,
      ref: bindRef,
      onClick: handleMainClick
    }, resource.metadata.type !== 'glossary' && _react.default.createElement(_peritextUtils.StructuredCOinS, {
      resource: resource
    }), _react.default.createElement(Component, {
      contextualization: contextualization,
      contextualizer: contextualizer,
      assets: assets,
      resource: resource,
      renderingMode: 'screened'
    }, children));
  }

  return null;
};
/**
 * Component's properties types
 */


InlineAssetWrapper.propTypes = {
  /**
   * Corresponds to the data initially embedded in a draft-js entity
   */
  data: _propTypes.default.shape({
    asset: _propTypes.default.shape({
      id: _propTypes.default.string
    })
  })
};
/**
 * Component's context used properties
 */

InlineAssetWrapper.contextTypes = {
  production: _propTypes.default.object,
  contextualizers: _propTypes.default.object,
  onAssetContextRequest: _propTypes.default.func,
  openedContextualizationId: _propTypes.default.string,
  openAsideContextualization: _propTypes.default.func,
  bindContextualizationElement: _propTypes.default.func,
  productionAssets: _propTypes.default.object // renderingMode: PropTypes.string,

};
var _default = InlineAssetWrapper;
exports.default = _default;