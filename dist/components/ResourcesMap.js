"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _RelatedContexts = _interopRequireDefault(require("./RelatedContexts"));

var _Aside = _interopRequireDefault(require("./Aside"));

var _peritextUtils = require("peritext-utils");

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _intersection = _interopRequireDefault(require("lodash/intersection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let SigmaLib;
let Sigma;
let RandomizeNodePositions;
let ForceAtlas2;
let SigmaEnableWebGL;
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const inBrowser = isBrowser();
/* eslint no-new-func : 0 */

if (inBrowser) {
  SigmaLib = require('react-sigma');
  Sigma = SigmaLib.Sigma;
  RandomizeNodePositions = SigmaLib.RandomizeNodePositions;
  ForceAtlas2 = SigmaLib.ForceAtlas2;
  SigmaEnableWebGL = SigmaLib.SigmaEnableWebGL;
}

const getResourceColor = type => {
  switch (type) {
    case 'bib':
      return '#c7f9ed';

    case 'glossary':
      return '#ddc8fc';

    case 'webpage':
      return '#92beff';

    case 'video':
      return '#ef6d3f';

    case 'embed':
      return '#cc4a27';

    case 'table':
      return '#f2cf00';

    case 'section':
      return '#00a99d';

    default:
      return '#00a99d';
  }
};

const buildMap = (production, edition, {
  showUncitedReferences,
  showAllResources,
  resourceTypes = ['bib'],
  minimumCooccurrenceNumber = 2
}) => {
  let resourcesIds;
  let usedContextualizations = (0, _peritextUtils.getContextualizationsFromEdition)(production, edition);

  if (showUncitedReferences) {
    resourcesIds = Object.keys(production.resources);
  } else {
    resourcesIds = (0, _uniq.default)(usedContextualizations.map(c => c.contextualization.sourceId));
  }

  if (!showAllResources) {
    resourcesIds = resourcesIds.filter(resourceId => {
      return resourceTypes.includes[production.resources[resourceId].metadata.type];
    });
  }

  usedContextualizations = usedContextualizations.filter(c => resourcesIds.includes(c.contextualization.sourceId));
  let nodes = resourcesIds.map(resourceId => ({
    resource: production.resources[resourceId],
    id: resourceId,
    type: 'resource',
    mentions: usedContextualizations.filter(c => c.contextualization.sourceId === resourceId).map(c => c.contextualization)
  }));
  nodes = nodes.map(node => _objectSpread({}, node, {
    label: (0, _peritextUtils.getResourceTitle)(node.resource),
    color: getResourceColor(node.resource.metadata.type),
    targetsIds: node.mentions.map(c => c.targetId),
    size: 1
  }));
  const edgesMap = {};
  nodes.forEach((node1, index1) => {
    nodes.slice(index1 + 1).forEach(node2 => {
      const intersects = (0, _intersection.default)(node1.targetsIds, node2.targetsIds);

      if (intersects.length || node2.targetsIds.includes(node1.resource.id) || node1.targetsIds.includes(node2.resource.id)) {
        const ids = [node1, node2].map(n => n.resource.id).sort();
        const edgePoint = edgesMap[ids[0]] || {};
        edgePoint[ids[1]] = edgePoint[ids[1]] ? edgePoint[ids[1]] + (intersects.length || 1) : intersects.length || 1;
        edgesMap[ids[0]] = edgePoint;
        node1.size++;
        node2.size++;
      }
    });
  });
  const edges = Object.keys(edgesMap).reduce((res, edge1) => {
    return [...res, ...Object.keys(edgesMap[edge1]).map(edge2 => ({
      source: edge1,
      target: edge2,
      weight: edgesMap[edge1][edge2],
      color: '#888889'
    }))];
  }, []).filter(e => e.weight >= minimumCooccurrenceNumber);
  return {
    nodes,
    edges
  };
};

class ResourcesMap extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "componentDidCatch", e => {
      console.error(e);
      /* eslint no-console : 0 */

      this.setState({
        error: e
      });
    });

    _defineProperty(this, "openResource", id => {
      if (!this.context.asideVisible) {
        this.context.toggleAsideVisible();
      }

      this.setState({
        openResourceId: id
      });
    });

    _defineProperty(this, "toggleOpenedResource", id => {
      this.context.toggleAsideVisible();
      this.setState({
        isLoadingAside: true
      }, () => {
        this.setState({
          openResourceId: this.state.openResourceId ? undefined : id
        }, () => {
          this.setState({
            isLoadingAside: false
          });
        });
      });
    });

    _defineProperty(this, "render", () => {
      const {
        props: {
          production,
          edition,
          options = {},
          title
        },
        state: {
          openResourceId,
          isLoadingAside,
          error
        },
        context: {
          translate,
          dimensions = {
            width: 50,
            height: 50
          }
        },
        toggleOpenedResource,
        openResource
      } = this;
      const {
        width,
        height
      } = dimensions;
      const {
        showUncitedReferences = false,
        showAllResources = true,
        resourceTypes = ['bib'],
        minimumCooccurrenceNumber = 1
      } = options;
      const {
        nodes,
        edges
      } = buildMap(production, edition, {
        showUncitedReferences,
        showAllResources,
        resourceTypes,
        minimumCooccurrenceNumber
      });

      const onClickNode = function ({
        data
      }) {
        const {
          node: {
            id
          }
        } = data;
        openResource(id);
      };

      if (error) {
        return _react.default.createElement("div", null, "This view could not be rendered in this environment");
      }

      return _react.default.createElement("div", null, _react.default.createElement("h1", null, title), SigmaLib && nodes.length ? _react.default.createElement("div", {
        className: 'graph-container'
      }, _react.default.createElement(Sigma, {
        onClickNode: onClickNode,
        style: {
          width,
          height
        },
        graph: {
          nodes,
          edges
        },
        settings: {
          drawEdges: true
        },
        renderer: 'webgl'
      }, _react.default.createElement(SigmaEnableWebGL, null), _react.default.createElement(RandomizeNodePositions, null), _react.default.createElement(ForceAtlas2, {
        worker: true,
        barnesHutOptimize: true,
        barnesHutTheta: 0.6,
        iterationsPerRender: 10,
        linLogMode: true,
        timeout: 3000
      }))) : _react.default.createElement("div", {
        className: 'graph-placeholder'
      }, translate('No links to display')), _react.default.createElement(_Aside.default, {
        isActive: openResourceId !== undefined,
        title: translate('Mentions of this item'),
        onClose: toggleOpenedResource
      }, openResourceId && _react.default.createElement(_RelatedContexts.default, {
        production: production,
        edition: edition,
        resourceId: openResourceId
      })), _react.default.createElement("div", {
        className: `loader ${isLoadingAside ? 'active' : ''}`
      }, _react.default.createElement("span", null, translate('Loading'))));
    });

    this.state = {
      openResourceId: undefined,
      error: false,
      isLoadingAside: false
    };
  }

}

exports.default = ResourcesMap;

_defineProperty(ResourcesMap, "contextTypes", {
  translate: _propTypes.default.func,
  usedDocument: _propTypes.default.object,
  asideVisible: _propTypes.default.bool,
  toggleAsideVisible: _propTypes.default.func,
  dimensions: _propTypes.default.object
});