import React, { Component } from 'react';/* eslint no-unused-vars : 0 */
import PropTypes from 'prop-types';

export default class CitationsProvider extends Component {
  static childContextTypes = {
    citations: PropTypes.object
  }
  getChildContext = () => ( {
    citations: this.props.citations ? this.props.citations.citationComponents : {}
  } )

  render = () => {
    const { children } = this.props;
    return children;
  }
}
