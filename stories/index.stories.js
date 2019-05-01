import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import template from '../src';
import production from './assets/production.json';

const {
  components: {
    Edition
  }
} = template;

class ContextProvider extends Component {

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

const contextualizers = {
  bib: require( 'peritext-contextualizer-bib' ),
  webpage: require( 'peritext-contextualizer-webpage' ),
  glossary: require( 'peritext-contextualizer-glossary' ),
  embed: require( 'peritext-contextualizer-embed' ),
  video: require( 'peritext-contextualizer-video' ),
  image: require( 'peritext-contextualizer-image' ),
  sourceCode: require( 'peritext-contextualizer-source-code' ),
  vegaLite: require( 'peritext-contextualizer-vegalite' ),
  table: require( 'peritext-contextualizer-table' ),
};

const webEdition = production.editions[Object.keys( production.editions )[0]];
const extractSpecificView = ( viewType ) => {
  return {
    ...webEdition,
    data: {
      ...webEdition.data,
      plan: {
        ...webEdition.data.plan,
        summary: webEdition.data.plan.summary.filter( ( item ) => item.type === viewType )
      }
    }
  };
};

const renderWithEdition = ( thatEdition ) => (
  <ContextProvider
    renderingMode={ 'screened' }
  >
    <Edition
      {
              ...{
                production,
                edition: thatEdition,
                lang: 'fr',
                contextualizers,
                previewMode: true,
                locale: {},
              }
            }
    />
  </ContextProvider>
);

storiesOf( 'Template', module )
  .add( 'complete edition', () => renderWithEdition( webEdition ) )
  .add( 'sections', () => renderWithEdition( extractSpecificView('sections') ) )
  .add( 'landing', () => renderWithEdition( extractSpecificView('landing') ) )
  .add( 'resources map', () => renderWithEdition( extractSpecificView('resourcesMap') ) )
  .add( 'references', () => renderWithEdition( extractSpecificView('references') ) )
  .add( 'glossary', () => renderWithEdition( extractSpecificView('glossary') ) )
  .add( 'places', () => renderWithEdition( extractSpecificView('places') ) )
  .add( 'events', () => renderWithEdition( extractSpecificView('events') ) )
