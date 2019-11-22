"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Aside = ({
  children,
  isActive,
  title = '',
  onClose
}, {
  toggleAsideVisible
}) => {
  return _react.default.createElement("aside", {
    className: `aside ${isActive ? 'is-active' : ''}`
  }, _react.default.createElement("button", {
    className: 'aside-toggle',
    onClick: toggleAsideVisible
  }, "\u25B6"), _react.default.createElement("div", {
    className: 'aside-content'
  }, _react.default.createElement("div", {
    className: 'aside-header'
  }, _react.default.createElement("h4", {
    className: 'aside-title'
  }, title), typeof onClose === 'function' && _react.default.createElement("button", {
    onClick: onClose,
    className: 'aside-close-btn'
  }, "\xD7")), _react.default.createElement("div", {
    className: 'aside-body'
  }, children)));
};

Aside.contextTypes = {
  toggleAsideVisible: _propTypes.default.func
};
var _default = Aside;
exports.default = _default;