"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _peritextUtils = require("peritext-utils");

var _MarkdownPlayer = _interopRequireDefault(require("./MarkdownPlayer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This module exports a stateless reusable block asset wrapper component
 * It handles the connection to context's data and builds proper data to render the asset
 * ============
 */
const BlockAssetWrapper = ({
  data
}, {
  production = {},
  productionAssets: assets = {},
  openAsideContextualization,
  contextualizers,
  containerId,
  bindContextualizationElement,
  renderingMode = 'screened'
}) => {
  const assetId = data.asset.id;
  const contextualization = production && production.contextualizations && production.contextualizations[assetId];

  if (!contextualization) {
    return null;
  }

  const {
    visibility = {
      paged: true,
      screened: true
    }
  } = contextualization;
  const contextualizer = production.contextualizers[contextualization.contextualizerId];
  const resource = production.resources[contextualization.resourceId];
  const contextualizerModule = contextualizers[contextualizer.type];
  const Component = contextualizerModule && contextualizerModule.Block;

  const handleMoreInformation = () => {
    if (typeof openAsideContextualization === 'function') {
      openAsideContextualization(contextualization.id);
    }
  };

  const bindRef = element => {
    if (typeof bindContextualizationElement === 'function') {
      bindContextualizationElement(contextualization.id, element);
    }
  };

  if (contextualization && Component) {
    const isHidden = !visibility[renderingMode];
    return isHidden ? null : _react.default.createElement("figure", {
      className: `block-contextualization-container ${contextualizer.type}`,
      style: {
        position: 'relative'
      },
      id: `contextualization-${containerId}-${assetId}`,
      ref: bindRef
    }, _react.default.createElement(Component, {
      resource: resource,
      contextualizer: contextualizer,
      contextualization: contextualization,
      renderingMode: renderingMode,
      assets: assets
    }), _react.default.createElement("figcaption", {
      className: 'figure-caption'
    }, _react.default.createElement("h4", {
      className: 'figure-title'
    }, renderingMode === 'screened' ? _react.default.createElement("div", null, _react.default.createElement("button", {
      className: 'link mention-context-pointer',
      onClick: handleMoreInformation
    }, _react.default.createElement("span", null, contextualization.title || resource.metadata.title), _react.default.createElement("sup", null, "\u25C8"))) : _react.default.createElement("span", null, contextualization.title || resource.metadata.title)), contextualization.legend && _react.default.createElement("div", {
      className: 'figure-legend'
    }, _react.default.createElement(_MarkdownPlayer.default, {
      src: contextualization.legend
    }))), _react.default.createElement(_peritextUtils.StructuredCOinS, {
      resource: resource
    }));
  } else {
    return null;
  }
};
/**
 * Component's properties types
 */


BlockAssetWrapper.propTypes = {
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

BlockAssetWrapper.contextTypes = {
  /**
   * The active production data
   */
  production: _propTypes.default.object,

  /**
   * Dimensions of the wrapping element
   */
  dimensions: _propTypes.default.object,

  /**
   * Whether the block asset is displayed in a note (and not in main content)
   */
  inNote: _propTypes.default.bool,
  contextualizers: _propTypes.default.object,
  productionAssets: _propTypes.default.object,
  containerId: _propTypes.default.string,
  openAsideContextualization: _propTypes.default.func,
  bindContextualizationElement: _propTypes.default.func,
  renderingMode: _propTypes.default.string
};
var _default = BlockAssetWrapper;
exports.default = _default;