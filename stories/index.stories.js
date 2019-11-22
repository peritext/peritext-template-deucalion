import React from 'react';
import { storiesOf } from '@storybook/react';

import ContextProvider from './ContextProvider';

import { preprocessEditionData } from 'peritext-utils';

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

const preprocessedData = preprocessEditionData( {
  production,
  edition: webEdition
} );

const extractSpecificView = ( ...viewTypes ) => {
  const newEdition = {
    ...webEdition,
    data: {
      ...webEdition.data,
      plan: {
        ...webEdition.data.plan,
        summary: [ ...viewTypes.map( ( viewType ) => editionTypes[viewType] ) ]
      }
    }
  };
  const thatPrepro = preprocessEditionData( {
    production,
    edition: newEdition
  } );
  return {
    edition: newEdition,
    preprocessedData: thatPrepro
  };
};

const renderWithEdition = ( { edition: thatEdition, preprocessedData: thatPrepro } ) => (
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
                preprocessedData: thatPrepro,
                previewMode: true,
                locale: {},
              }
            }
    />
  </ContextProvider>
);

storiesOf( 'Template', module )
  .add( 'complete edition', () => renderWithEdition( webEdition, preprocessedData ) )
  .add( 'sections', () => renderWithEdition( extractSpecificView( 'sections' ) ) )
  .add( 'landing', () => renderWithEdition( extractSpecificView( 'landing' ) ) )
  .add( 'resources map', () => renderWithEdition( extractSpecificView( 'resourcesMap', 'sections' ) ) )
  .add( 'references', () => renderWithEdition( extractSpecificView( 'references', 'sections' ) ) )
  .add( 'glossary', () => renderWithEdition( extractSpecificView( 'glossary' ) ) )
  .add( 'places', () => renderWithEdition( extractSpecificView( 'places' ) ) )
  .add( 'events', () => renderWithEdition( extractSpecificView( 'events' ) ) );
