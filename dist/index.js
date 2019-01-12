"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Wrapper = _interopRequireWildcard(require("./components/Wrapper"));

var _defaultStyle = _interopRequireDefault(require("./defaultStyle"));

var _meta = _interopRequireDefault(require("./meta"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// import Helmet from 'react-helmet';
const components = {
  Edition: _Wrapper.default
};
var _default = {
  meta: _meta.default,
  components,
  utils: {
    buildNav: _Wrapper.buildNav,
    routeItemToUrl: _Wrapper.routeItemToUrl,
    renderHeadFromRouteItem: _Wrapper.renderHeadFromRouteItem,
    getAdditionalRoutes: _Wrapper.getAdditionalRoutes
  },
  css: _defaultStyle.default
};
exports.default = _default;