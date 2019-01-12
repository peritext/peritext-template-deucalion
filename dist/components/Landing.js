"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FrontCover = ({
  production,
  edition = {},
  options = {},
  nextNavItem
}) => {
  const {
    customTitle,
    customSubtitle,
    customPresentationText,
    customReadingLinks = [],
    customNextLinkTitle,
    animatedBackground = 'none'
  } = options;
  const {
    data = {}
  } = edition;
  const {
    publicationTitle,
    publicationSubtitle
  } = data;
  const title = customTitle && customTitle.trim().length ? customTitle : publicationTitle || production.metadata.title;
  const subtitle = customSubtitle && customSubtitle.trim().length ? customSubtitle : publicationSubtitle || production.metadata.subtitle;
  const presentationText = customPresentationText && customPresentationText.trim().length ? customPresentationText : production.metadata.abstract;
  const authors = production.metadata.authors || [];
  return _react.default.createElement("div", {
    className: `landing-player main-contents-container ${animatedBackground && animatedBackground !== 'none' ? `has-animated-background-${animatedBackground}` : ''}`
  }, _react.default.createElement("div", {
    className: 'main-column'
  }, _react.default.createElement("div", {
    className: 'header'
  }, _react.default.createElement("h1", {
    className: 'landing-title'
  }, title), subtitle && subtitle.length && _react.default.createElement("h2", {
    className: 'landing-subtitle'
  }, subtitle), _react.default.createElement("h3", null, authors.length > 0 && authors.map((author, authorIndex) => {
    return typeof author === 'string' ? _react.default.createElement("span", {
      key: authorIndex
    }, author) : _react.default.createElement("span", {
      key: authorIndex
    }, `${author.given} ${author.family}`);
  }).reduce((cur, item, index) => {
    return index === 0 ? [item] : [...cur, ', ', item];
  }, []))), presentationText && _react.default.createElement("div", {
    className: 'presentation'
  }, presentationText), _react.default.createElement("ul", {
    className: 'links'
  }, nextNavItem && _react.default.createElement("li", {
    className: 'main-link'
  }, _react.default.createElement(_LinkProvider.default, {
    to: nextNavItem
  }, customNextLinkTitle && customNextLinkTitle.length ? customNextLinkTitle : nextNavItem.title, " \u2192")), customReadingLinks.length > 0 && customReadingLinks.map((link, index) => {
    return _react.default.createElement("a", {
      key: index,
      href: link.link,
      target: 'blank',
      rel: 'noopener'
    }, link.linkTitle, " \u2192");
  }))));
};

var _default = FrontCover;
exports.default = _default;