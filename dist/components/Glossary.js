"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _RelatedContexts = _interopRequireDefault(require("./RelatedContexts"));

var _MarkdownPlayer = _interopRequireDefault(require("./MarkdownPlayer"));

var _Aside = _interopRequireDefault(require("./Aside"));

var _peritextUtils = require("peritext-utils");

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Glossary extends _react.Component {
  constructor(_props, _context) {
    super(_props);

    _defineProperty(this, "componentWillReceiveProps", nextProps => {
      this.setState({
        glossaryData: this.buildGlossaryData(nextProps, this.context)
      });
    });

    _defineProperty(this, "buildGlossaryData", (props, context) => {
      const {
        options,
        production,
        edition,
        id
      } = props;
      const {
        preprocessedData
      } = context;
      return preprocessedData && preprocessedData.blocks && preprocessedData.blocks[id] && preprocessedData.blocks[id].glossaryData || (0, _peritextUtils.buildGlossary)({
        options,
        production,
        edition
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
          glossaryData
        },
        context: {
          translate
        },
        toggleOpenedResource,
        openResource
      } = this;
      const {
        showMentions = true,
        showDescription = true
      } = options;
      return _react.default.createElement("div", {
        className: 'main-contents-container glossary-player'
      }, _react.default.createElement("div", {
        className: 'main-column'
      }, _react.default.createElement("h1", {
        className: 'view-title'
      }, title), _react.default.createElement("ul", {
        className: 'big-list-items-container'
      }, glossaryData.map((item, index) => {
        const handleClick = () => {
          openResource(item.resource.id);
        };

        const active = openResourceId === item.resource.id;
        return _react.default.createElement("li", {
          className: `big-list-item ${active ? 'active' : ''}`,
          key: index
        }, _react.default.createElement("div", {
          className: 'big-list-item-content'
        }, _react.default.createElement("div", {
          className: 'title'
        }, _react.default.createElement("h3", null, item.resource.data.name)), showDescription && item.resource.data.description && _react.default.createElement("div", {
          className: 'description'
        }, _react.default.createElement(_MarkdownPlayer.default, {
          src: item.resource.data.description
        }))), _react.default.createElement("div", {
          className: 'big-list-item-actions'
        }, showMentions && item.mentions.length > 0 && _react.default.createElement("div", null, _react.default.createElement("button", {
          className: 'link',
          onClick: handleClick
        }, item.mentions.length, " ", item.mentions.length === 1 ? translate('mention') : translate('mentions')))), item.resource && (0, _peritextUtils.resourceHasContents)(item.resource) && _react.default.createElement("div", {
          className: 'big-list-item-actions'
        }, _react.default.createElement(_LinkProvider.default, {
          to: {
            routeClass: 'resourcePage',
            routeParams: {
              resourceId: item.resource.id
            }
          }
        }, translate('Expand contents'))));
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
      openResourceId: undefined,
      glossaryData: this.buildGlossaryData(_props, _context)
    };
  }

}

exports.default = Glossary;

_defineProperty(Glossary, "contextTypes", {
  translate: _propTypes.default.func,
  asideVisible: _propTypes.default.bool,
  toggleAsideVisible: _propTypes.default.func
});