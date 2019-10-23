"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _peritextUtils = require("peritext-utils");

var _ContextMention = _interopRequireDefault(require("./ContextMention"));

var _ResourceIdentityCard = _interopRequireDefault(require("./ResourceIdentityCard"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ProductionHeader = ({
  production: {
    metadata: {
      title,
      subtitle,
      authors = []
    }
  }
}) => _react.default.createElement("div", {
  className: 'production-identity-card'
}, _react.default.createElement("h1", null, title), subtitle && _react.default.createElement("h2", null, subtitle), _react.default.createElement("h3", null, authors.length > 0 && authors.map((author, index) => {
  return typeof author === 'string' ? _react.default.createElement("span", {
    key: index
  }, author) : _react.default.createElement("span", {
    key: index
  }, `${author.given} ${author.family}`);
}).reduce((cur, item, index) => {
  return index === 0 ? [item] : [...cur, ', ', item];
}, [])));

class ResourceSheet extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "getChildContext", () => ({
      renderingMode: 'paged'
    }));

    _defineProperty(this, "render", () => {
      const {
        props: {
          production,
          edition,
          // activeViewClass,
          activeViewParams // options = {},

        },
        context: {
          translate
        }
      } = this;
      const {
        resourceId
      } = activeViewParams;

      if (!resourceId) {
        return null;
      }

      const PADDING = 0;
      const usedContextualizations = (0, _peritextUtils.getContextualizationsFromEdition)(production, edition);
      let related = usedContextualizations.filter(({
        contextualization: {
          id: contextualizationId
        }
      }) => production.contextualizations[contextualizationId].sourceId === resourceId).map(({
        contextualization
      }) => _objectSpread({}, contextualization, (0, _peritextUtils.buildContextContent)(production, contextualization.id, PADDING))).filter(i => i.targetContents);
      related = related.reduce((cur, item, index) => {
        if (index > 0) {
          // console.log('related', related[index - 1].sectionTitle, item.sectionTitle)
          if (related[index - 1].sectionTitle === item.sectionTitle) {
            return [...cur, _objectSpread({}, item, {
              sectionTitle: '...'
            })];
          }
        }

        return [...cur, item];
      }, []);
      const resource = production.resources[resourceId];
      return _react.default.createElement("div", {
        className: 'resource-sheet main-contents-container'
      }, _react.default.createElement("div", {
        className: 'main-column'
      }, _react.default.createElement("div", {
        className: 'header'
      }, _react.default.createElement(ProductionHeader, {
        production: production
      }), _react.default.createElement(_ResourceIdentityCard.default, {
        resource: resource,
        production: production,
        edition: edition
      })), related.length ? _react.default.createElement("ul", {
        className: 'body related-contexts-container'
      }, _react.default.createElement("h3", null, translate('Mentions'), ' : '), related.filter(thatContextualization => thatContextualization.targetContents !== undefined).map((thatContextualization, index) => _react.default.createElement("li", {
        className: 'related-context',
        key: index
      }, _react.default.createElement(_ContextMention.default, {
        targetContents: thatContextualization.targetContents,
        contents: thatContextualization.contents,
        sectionTitle: thatContextualization.sectionTitle,
        targetId: thatContextualization.targetId,
        contextualizationId: thatContextualization.id,
        displayLinks: false
      })))) : _react.default.createElement("div", {
        className: 'body'
      })));
    });
  }

}

_defineProperty(ResourceSheet, "childContextTypes", {
  renderingMode: _propTypes.default.string
});

ResourceSheet.contextTypes = {
  translate: _propTypes.default.func
};
var _default = ResourceSheet;
exports.default = _default;