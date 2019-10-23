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
    return contextualization.sourceId;
  })); // filter by type of resource

  citedResourcesIds = citedResourcesIds.filter(resourceId => {
    const type = resources[resourceId].metadata.type;
    return resourceTypes.includes(type);
  });
  const resourcesMap = citedResourcesIds.reduce((res, resourceId) => {
    const mentions = contextualizations.filter(c => c.contextualization.sourceId === resourceId).map(c => _objectSpread({}, c, {
      id: c.contextualization.id,
      contextContent: (0, _peritextUtils.buildContextContent)(production, c.contextualization.id)
    }));
    const citation = (0, _peritextUtils.resourceToCslJSON)(resources[resourceId])[0];

    if (resources[resourceId].metadata.type === 'bib') {
      return _objectSpread({}, res, {
        [resources[resourceId].data.citations[0].id]: _objectSpread({}, resources[resourceId], {
          citation,
          mentions
        })
      });
    }

    return _objectSpread({}, res, {
      [resourceId]: _objectSpread({}, resources[resourceId], {
        mentions,
        citation
      })
    });
  }, {});
  const bibliographyData = (0, _reactCiteproc.makeBibliography)(citations.citationItems, edition.data.citationStyle.data, edition.data.citationLocale.data);
  const ids = bibliographyData[0].entry_ids.map(group => group[0]);
  let items = ids // .filter( ( id ) => resourcesMap[id] )
  .map((id, index) => ({
    id,
    resource: resourcesMap[id],
    citation: resourcesMap[id] && resourcesMap[id].citation,
    html: bibliographyData[1][index]
  })).filter(i => i.citation);
  items = items.sort((a, b) => {
    switch (sortingKey) {
      case 'mentions':
        if (a.resource.mentions.length > b.resource.mentions.length) {
          return -1;
        }

        return 1;

      case 'date':
        const datePartsA = a.citation.issued && a.citation.issued['date-parts'];
        const datePartsB = b.citation.issued && b.citation.issued['date-parts'];

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
        if (a.citation.author && b.citation.author) {
          const authorsA = a.citation.author && a.citation.author.map(author => `${author.family}-${author.given}`.toLowerCase()).join('');
          const authorsB = b.citation.author && b.citation.author.map(author => `${author.family}-${author.given}`.toLowerCase()).join('');

          if (authorsA > authorsB) {
            return 1;
          } else return -1;
        } else if (!b.citation.author) {
          return -1;
        } else if (!a.citation.author) {
          return 1;
        } else return 0;

      case 'title':
        if (a.citation.title.toLowerCase() > b.citation.title.toLowerCase()) {
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

const ReferenceCard = ({
  item,
  onOpen,
  translate,
  showMentions
}) => {
  return _react.default.createElement("li", {
    className: 'big-list-item'
  }, _react.default.createElement("div", {
    className: 'big-list-item-content'
  }, _react.default.createElement("div", {
    dangerouslySetInnerHTML: {
      /* eslint react/no-danger: 0 */
      __html: item.html
    }
  })), item.resource && showMentions && _react.default.createElement("div", {
    className: 'big-list-item-actions'
  }, _react.default.createElement("button", {
    className: 'link',
    onClick: onOpen
  }, item.resource.mentions.length, " ", item.resource.mentions.length === 1 ? translate('mention') : translate('mentions'))));
};

class References extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "componentDidMount", () => {
      const {
        props: {
          production,
          edition,
          options = {}
        }
      } = this;
      const {
        showUncitedReferences = false,
        resourceTypes = ['bib'],
        sortingKey = 'authors',
        sortingAscending = true
      } = options;
      const contextualizations = (0, _peritextUtils.getContextualizationsFromEdition)(production, edition);
      const citations = (0, _peritextUtils.buildCitations)({
        production,
        edition
      });
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
      this.setState({
        references,
        citations
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
          openResourceId,
          references // citations,

        },
        context: {
          translate
        },
        toggleOpenedResource,
        openResource
      } = this;
      const {
        showMentions
      } = options;
      return _react.default.createElement("div", {
        className: 'main-contents-container references-player'
      }, _react.default.createElement("div", {
        className: 'main-column'
      }, _react.default.createElement("h1", {
        className: 'view-title'
      }, title), references !== undefined && _react.default.createElement("ul", {
        className: 'big-list-items-container'
      }, references.map((item, index) => {
        const handleOpen = () => {
          openResource(item.resource.id);
        };

        return _react.default.createElement(ReferenceCard, {
          key: index,
          item: item,
          onOpen: handleOpen,
          showMentions: showMentions,
          citationStyle: edition.data.citationStyle,
          citationLocale: edition.data.citationLocale,
          translate: translate
        });
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