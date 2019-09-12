"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Railway = ({
  scrollRatio,
  scrollTopRatio,
  scrollToElement,
  shadows = []
}, {}) => {
  return _react.default.createElement("nav", {
    className: 'railway'
  }, shadows.map((shadow, index) => {
    const handleClick = () => {
      scrollToElement(shadow.element);
    };

    return _react.default.createElement("div", {
      className: 'shadow',
      "data-html": true,
      "data-tip": shadow.text,
      "data-place": 'left',
      "data-effect": 'solid',
      "data-for": 'railway-tooltip',
      "data-offset": "{'left': 20}",
      onClick: handleClick,
      key: index,
      style: {
        top: `${shadow.y * 100}%`,
        height: `${shadow.h * 100}%`
      }
    });
  }), scrollRatio !== undefined && scrollTopRatio !== undefined ? _react.default.createElement("div", {
    className: 'elevator',
    style: {
      top: `${scrollTopRatio * 100}%`,
      height: `${scrollRatio * 100}%`
    }
  }) : null, _react.default.createElement(_reactTooltip.default, {
    id: 'railway-tooltip'
  }));
};

var _default = Railway;
exports.default = _default;