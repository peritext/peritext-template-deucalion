import React from 'react';
import { storiesOf } from '@storybook/react';

import ContextProvider from './ContextProvider';

import template from '../src';
import production from './assets/production.json';
import { webEdition, editionTypes } from './assets/mocks';

const {
  components: {
    Edition
  }
} = template;

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

const extractSpecificView = ( viewType ) => {
  return {
    ...webEdition,
    data: {
      ...webEdition.data,
      plan: {
        ...webEdition.data.plan,
        summary: [ editionTypes[viewType] ]
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
  .add( 'sections', () => renderWithEdition( extractSpecificView( 'sections' ) ) )
  .add( 'landing', () => renderWithEdition( extractSpecificView( 'landing' ) ) )
  .add( 'resources map', () => renderWithEdition( extractSpecificView( 'resourcesMap' ) ) )
  .add( 'references', () => renderWithEdition( extractSpecificView( 'references' ) ) )
  .add( 'glossary', () => renderWithEdition( extractSpecificView( 'glossary' ) ) )
  .add( 'places', () => renderWithEdition( extractSpecificView( 'places' ) ) )
  .add( 'events', () => renderWithEdition( extractSpecificView( 'events' ) ) );
