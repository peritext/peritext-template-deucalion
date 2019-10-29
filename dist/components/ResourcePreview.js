"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ResourcePreview = ({
  resource
}, {
  contextualizers,
  productionAssets
}) => {
  if (!['bib', 'glossary', 'section'].includes(resource.metadata.type)) {
    const ContextualizerComponent = contextualizers[resource.metadata.type] && contextualizers[resource.metadata.type].Block;
    const contextualizerId = (0, _uuid.v4)();
    const contextualization = {
      contextualizerId,
      sourceId: resource.id,
      targetId: resource.id
    };
    const contextualizer = {
      id: contextualizerId,
      type: resource.metadata.type,
      parameters: {}
    };
    return _react.default.createElement("figure", {
      className: `block-contextualization-container ${contextualizer.type}`
    }, _react.default.createElement(ContextualizerComponent, {
      renderingMode: 'screened',
      resource: resource,
      contextualization: contextualization,
      contextualizer: contextualizer,
      assets: productionAssets
    }));
  }

  return null;
};

ResourcePreview.contextTypes = {
  contextualizers: _propTypes.default.object,
  productionAssets: _propTypes.default.object
};
var _default = ResourcePreview;
exports.default = _default;