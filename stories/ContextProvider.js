import React, { Component } from 'react';/* eslint no-unused-vars : 0 */
import PropTypes from 'prop-types';

export default class ContextProvider extends Component {

  static childContextTypes = {
    renderingMode: PropTypes.string,
  }

  getChildContext = () => ( {
    renderingMode: this.props.renderingMode,
  } )
  render = () => {
    return this.props.children;
  }
}
