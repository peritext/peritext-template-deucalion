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

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ReferenceCard = ({
  item,
  onOpen,
  translate,
  showMentions,
  active
}) => {
  return _react.default.createElement("li", {
    className: `big-list-item ${active ? 'active' : ''}`,
    onClick: onOpen
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
  }, item.resource.mentions.length, " ", item.resource.mentions.length === 1 ? translate('mention') : translate('mentions'))), item.resource && (0, _peritextUtils.resourceHasContents)(item.resource) && _react.default.createElement("div", {
    className: 'big-list-item-actions'
  }, _react.default.createElement(_LinkProvider.default, {
    to: {
      routeClass: 'resourcePage',
      routeParams: {
        resourceId: item.resource.id
      }
    }
  }, translate('Expand contents'))));
};

class References extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "componentDidMount", () => {
      const {
        props: {
          production,
          edition,
          options = {},
          id
        },
        context: {
          preprocessedData
        }
      } = this;
      const {
        showUncitedReferences = false,
        resourceTypes = ['bib'],
        sortingKey = 'authors',
        sortingAscending = true
      } = options;
      const preprocessedBiblio = preprocessedData && preprocessedData.blocks && preprocessedData.blocks[id] && preprocessedData.blocks[id].bibliographyData;
      let references;

      if (preprocessedBiblio) {
        references = preprocessedBiblio;
      } else {
        references = (0, _peritextUtils.buildBibliography)({
          production,
          edition,
          // contextualizations,
          options: {
            showUncitedReferences,
            resourceTypes,
            sortingKey,
            sortingAscending
          }
        });
      }

      this.setState({
        references
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
          active: openResourceId === item.resource.id,
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
  toggleAsideVisible: _propTypes.default.func,
  preprocessedData: _propTypes.default.object
});