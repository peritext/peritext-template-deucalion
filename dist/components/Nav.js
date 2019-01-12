"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _peritextUtils = require("peritext-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Nav = ({
  summary = [],
  toggleIndex,
  locationTitle,
  title
}, {
  LinkComponent
}) => {
  const realSummary = summary.filter(v => v.routeClass !== 'landing');
  const landingView = summary.find(v => v.routeClass === 'landing');
  let firstLink = landingView;

  if (!firstLink && summary.length) {
    firstLink = summary[0];
  }

  return _react.default.createElement("nav", {
    className: 'nav'
  }, _react.default.createElement("div", {
    className: 'nav-header'
  }, _react.default.createElement("button", {
    className: 'nav-toggle',
    onClick: toggleIndex
  }, _react.default.createElement("span", {
    className: 'nav-toggle-symbol'
  }, "\u271A")), _react.default.createElement("h1", {
    className: 'title'
  }, firstLink ? _react.default.createElement(LinkComponent, {
    to: firstLink
  }, _react.default.createElement("strong", {
    className: 'hero-title'
  }, (0, _peritextUtils.abbrevString)(title))) : title, " ", locationTitle && _react.default.createElement("em", {
    onClick: toggleIndex,
    className: 'location-title'
  }, (0, _peritextUtils.abbrevString)(locationTitle)))), _react.default.createElement("div", {
    className: 'nav-content-container'
  }, _react.default.createElement("ul", null, realSummary.map((item, index) => {
    return _react.default.createElement("li", {
      key: index,
      className: `nav-item level-${item.level}`
    }, _react.default.createElement(LinkComponent, {
      to: item
    }, item.title));
  }))));
};

Nav.contextTypes = {
  LinkComponent: _propTypes.default.func
};
var _default = Nav;
exports.default = _default;