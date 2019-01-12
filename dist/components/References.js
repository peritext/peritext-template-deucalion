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

var _reactCiteproc = require("react-citeproc");

var _uniq = _interopRequireDefault(require("lodash/uniq"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Computes interactive bibliography materials
 * @return {array} items - list of context-loaded items
 */
function buildBibliography({
  production,
  edition,
  citations,
  contextualizations,
  showUncitedReferences,
  resourceTypes,
  sortingKey,
  sortingAscending
}) {
  const {
    resources
  } = production;
  /**
   * Select relevant resources
   */
  // filter cited references only

  let citedResourcesIds = showUncitedReferences ? Object.keys(resources) : (0, _uniq.default)(contextualizations.map(element => {
    const contextualization = element.contextualization;
    return contextualization.resourceId;
  })); // filter by type of resource

  citedResourcesIds = citedResourcesIds.filter(resourceId => {
    const type = resources[resourceId].metadata.type;
    return resourceTypes.includes(type);
  });
  let items = citedResourcesIds.map(resourceId => {
    const cit = (0, _peritextUtils.resourceToCslJSON)(resources[resourceId]);
    const citationKey = cit && cit[0] && cit[0].id;
    const mentions = contextualizations.map(element => {
      if (element.contextualization.resourceId === resourceId) {
        return _objectSpread({}, element, {
          id: element.contextualization.id
        });
      }
    }).filter(s => s);
    let biblio;

    if (citations.citationItems[citationKey]) {
      biblio = (0, _reactCiteproc.makeBibliography)(citations.citationItems, edition.data.citationStyle.data, edition.data.citationLocale.data, {
        select: [{
          field: 'id',
          value: citationKey
        }]
      });
    } else {
      biblio = (0, _reactCiteproc.makeBibliography)({
        [resourceId]: _objectSpread({}, cit[0], {
          id: resourceId
        })
      }, edition.data.citationStyle.data, edition.data.citationLocale.data, {
        select: [{
          field: 'id',
          value: resourceId
        }]
      });
    }

    const title = biblio && biblio[1] && biblio[1][0];
    return {
      citationKey,
      title,
      item: citations.citationItems[citationKey] || cit[0],
      resourceId,
      mentions: mentions.map(mention => _objectSpread({}, mention, {
        contextContent: (0, _peritextUtils.buildContextContent)(production, mention.id)
      }))
    };
  });
  items = items.sort((a, b) => {
    switch (sortingKey) {
      case 'date':
        const datePartsA = a.item.issued && a.item.issued['date-parts'];
        const datePartsB = b.item.issued && b.item.issued['date-parts'];

        if (datePartsA && datePartsB && datePartsA.length && datePartsB.length) {
          if (datePartsA[0] > datePartsB[0]) {
            return 1;
          } else if (datePartsA[0] < datePartsB[0]) {
            return -1;
          } else if (datePartsA.length > 1 && datePartsB.length > 1) {
            if (datePartsA[1] > datePartsB[1]) {
              return 1;
            } else if (datePartsA[1] < datePartsB[1]) {
              return -1;
            } else return 0;
          } else {
            return 0;
          }
        } else if (!datePartsB || datePartsB && !datePartsB.length) {
          return -1;
        } else if (!datePartsA || datePartsA && !datePartsA.length) {
          return 1;
        } else {
          return 0;
        }

      case 'authors':
        if (a.item.author && b.item.author) {
          const authorsA = a.item.author && a.item.author.map(author => `${author.family}-${author.given}`.toLowerCase()).join('');
          const authorsB = b.item.author && b.item.author.map(author => `${author.family}-${author.given}`.toLowerCase()).join('');

          if (authorsA > authorsB) {
            return 1;
          } else return -1;
        } else if (!b.item.author) {
          return -1;
        } else if (!a.item.author) {
          return 1;
        } else return 0;

      case 'title':
        if (a.item.title.toLowerCase() > b.item.title.toLowerCase()) {
          return 1;
        }

        return -1;

      default:
        break;
    }
  });

  if (!sortingAscending) {
    items = items.reverse();
  }

  return items;
}

class References extends _react.Component {
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
          translate
        },
        toggleOpenedResource,
        openResource
      } = this;
      const {
        showUncitedReferences = false,
        resourceTypes = ['bib'],
        sortingKey = 'authors',
        sortingAscending = true
      } = options;
      /**
       * @todo compute citations based on edition
       */

      const citations = (0, _peritextUtils.buildCitations)(production);
      const contextualizations = (0, _peritextUtils.getContextualizationsFromEdition)(production, edition);
      const references = buildBibliography({
        production,
        edition,
        citations,
        contextualizations,
        showUncitedReferences,
        resourceTypes,
        sortingKey,
        sortingAscending
      });
      return _react.default.createElement("div", {
        className: 'main-contents-container references-player'
      }, _react.default.createElement("div", {
        className: 'main-column'
      }, _react.default.createElement("h1", {
        className: 'view-title'
      }, title), _react.default.createElement("ul", {
        className: 'big-list-items-container'
      }, references.map((item, index) => {
        const handleClick = () => {
          openResource(item.resourceId);
        };

        return _react.default.createElement("li", {
          className: 'big-list-item',
          key: index
        }, _react.default.createElement("div", {
          className: 'big-list-item-content'
        }, _react.default.createElement("div", {
          dangerouslySetInnerHTML: {
            /* eslint react/no-danger: 0 */
            __html: item.title
          }
        })), _react.default.createElement("div", {
          className: 'big-list-item-actions'
        }, _react.default.createElement("button", {
          className: 'link',
          onClick: handleClick
        }, item.mentions.length, " ", item.mentions.length === 1 ? translate('mention') : translate('mentions'))));
      }))), _react.default.createElement(_Aside.default, {
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

exports.default = References;

_defineProperty(References, "contextTypes", {
  translate: _propTypes.default.func,
  asideVisible: _propTypes.default.bool,
  toggleAsideVisible: _propTypes.default.func
});