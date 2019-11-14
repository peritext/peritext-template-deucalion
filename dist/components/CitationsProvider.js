"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CitationsProvider extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "getChildContext", () => ({
      citations: this.props.citations ? this.props.citations.citationComponents : {}
    }));

    _defineProperty(this, "render", () => {
      const {
        children
      } = this.props;
      return children;
    });
  }

}

exports.default = CitationsProvider;

_defineProperty(CitationsProvider, "childContextTypes", {
  citations: _propTypes.default.object
});