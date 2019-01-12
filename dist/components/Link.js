"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This module exports a stateless reusable external link component
 * ============
 * @module perinext/components/Link
 */

/**
 * Renders a link as a pure component
 * @param {object} props
 * @param {string} props.to - the url to point to
 * @param {array} props.children - children elements of the component
 * @return {ReactElement} component - the component
 */
const Link = ({
  to,
  children
}) => _react.default.createElement("a", {
  href: to,
  target: 'blank'
}, children);
/**
 * Component's properties types
 */


Link.propTypes = {
  /**
   * url to point to
   */
  children: _propTypes.default.array,

  /**
   * children react elements
   */
  to: _propTypes.default.string
};
var _default = Link;
exports.default = _default;