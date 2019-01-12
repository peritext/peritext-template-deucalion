"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RouterLink = ({
  to: item,
  children
}, {
  routeItemToUrl
}) => {
  const url = routeItemToUrl(item);
  return _react.default.createElement(_reactRouterDom.NavLink, {
    to: `${url}`,
    className: 'link',
    activeClassName: 'active'
  }, children);
};

RouterLink.contextTypes = {
  routeItemToUrl: _propTypes.default.func
};
var _default = RouterLink;
exports.default = _default;