"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _RelatedContexts = _interopRequireDefault(require("./RelatedContexts"));

var _objectPath = _interopRequireDefault(require("object-path"));

var _Aside = _interopRequireDefault(require("./Aside"));

var _peritextUtils = require("peritext-utils");

var _resource = _interopRequireDefault(require("peritext-schemas/resource"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _intersection = _interopRequireDefault(require("lodash/intersection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let Graph;
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const inBrowser = isBrowser();
/* eslint no-new-func : 0 */

if (inBrowser) {
  Graph = require('react-d3-graph').Graph;
}

const getResourceColor = type => {
  switch (type) {
    case 'bib':
      return 'lightgreen';

    case 'glossary':
      return 'lightblue';

    case 'webpage':
      return 'blue';

    case 'video':
    case 'embed':
      return 'red';

    default:
      return 'lightgrey';
  }
};

const getResourceTitle = resource => {
  const titlePath = _objectPath.default.get(_resource.default, ['definitions', resource.metadata.type, 'titlePath']);

  const title = titlePath ? _objectPath.default.get(resource, titlePath) : resource.metadata.title;
  return title;
};

const buildMap = (production, edition, {
  showUncited,
  showAllResources,
  resourceTypes = ['bib'],
  minimumCooccurrenceNumber = 3
}) => {
  let resourcesIds;

  if (showUncited) {
    resourcesIds = Object.keys(production.resources);
  } else {
    const usedContextualizations = (0, _peritextUtils.getContextualizationsFromEdition)(production, edition);
    resourcesIds = (0, _uniq.default)(usedContextualizations.map(c => c.contextualization.resourceId));
  }

  if (!showAllResources) {
    resourcesIds = resourcesIds.filter(resourceId => {
      return resourceTypes.includes[production.resources[resourceId].metadata.type];
    });
  }

  let nodes = resourcesIds.map(resourceId => ({
    resource: production.resources[resourceId],
    id: resourceId,
    type: 'resource',
    mentions: Object.keys(production.contextualizations).filter(contextualizationId => production.contextualizations[contextualizationId].resourceId === resourceId).map(contextualizationId => production.contextualizations[contextualizationId])
  }));
  nodes = nodes.map(node => _objectSpread({}, node, {
    title: getResourceTitle(node.resource),
    color: getResourceColor(node.resource.metadata.type),
    sectionsIds: node.mentions.map(c => c.sectionId)
  }));
  const edgesMap = {};
  nodes.forEach((node1, index1) => {
    nodes.slice(index1 + 1).forEach(node2 => {
      const intersects = (0, _intersection.default)(node1.sectionsIds, node2.sectionsIds);

      if (intersects.length) {
        const ids = [node1, node2].map(n => n.resource.id).sort();
        const edgePoint = edgesMap[ids[0]] || {};
        edgePoint[ids[1]] = edgePoint[ids[1]] ? edgePoint[ids[1]] + intersects.length : intersects.length;
        edgesMap[ids[0]] = edgePoint;
      }
    });
  });
  const edges = Object.keys(edgesMap).reduce((res, edge1) => {
    return [...res, ...Object.keys(edgesMap[edge1]).map(edge2 => ({
      source: edge1,
      target: edge2,
      weight: edgesMap[edge1][edge2]
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
        openResourceId: this.state.openResourceId ? undefined : id
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
          openResourceId
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
        showUncited = false,
        showAllResources = true,
        resourceTypes = ['bib']
      } = options;
      const {
        nodes,
        edges
      } = buildMap(production, edition, {
        showUncited,
        showAllResources,
        resourceTypes
      });
      const graphConfig = {
        automaticRearrangeAfterDropNode: false,
        collapsible: true,
        directed: false,
        height: 400,
        highlightDegree: 1,
        highlightOpacity: 1,
        linkHighlightBehavior: false,
        maxZoom: 8,
        minZoom: 0.1,
        focusZoom: 1,
        focusAnimationDuration: 0.75,
        nodeHighlightBehavior: false,
        panAndZoom: true,
        staticGraph: false,
        link: {
          highlightColor: 'lightblue'
        },
        node: {
          labelProperty: 'title'
        }
      };

      const onClickNode = function (nodeId) {
        openResource(nodeId);
      };

      return _react.default.createElement("div", null, _react.default.createElement("h1", null, title), Graph && nodes.length && _react.default.createElement("div", {
        className: 'graph-container'
      }, _react.default.createElement(Graph, {
        id: 'graph' // id is mandatory, if no id is defined rd3g will throw an error
        ,
        data: {
          nodes,
          links: edges,
          focusedNodeId: openResourceId
        },
        config: graphConfig,
        onClickNode: onClickNode,
        width: width,
        height: height
      })), _react.default.createElement(_Aside.default, {
        isActive: openResourceId !== undefined,
        title: translate('Mentions of this item'),
        onClose: toggleOpenedResource
      }, openResourceId && _react.default.createElement(_RelatedContexts.default, {
        production: production,
        edition: edition,
        resourceId: openResourceId
      })));
    });

    this.state = {
      openResourceId: undefined
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