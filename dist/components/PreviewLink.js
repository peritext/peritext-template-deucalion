"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PreviewLink = ({
  to = {},
  children,
  onButtonClick
}, {
  navigateTo,
  activeViewId
}) => {
  const active = to.viewId === activeViewId;
  return _react.default.createElement("span", {
    onClick: () => {
      if (typeof onButtonClick === 'function') {
        onButtonClick();
      }

      navigateTo(to);
    },
    className: `link ${active ? 'active' : ''}`
  }, children);
};

PreviewLink.contextTypes = {
  navigateTo: _propTypes.default.func,
  activeViewId: _propTypes.default.string
};
var _default = PreviewLink;
exports.default = _default;