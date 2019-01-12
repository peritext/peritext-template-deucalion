import { getContextualizationsFromEdition, buildContextContent } from 'peritext-utils';

export const buildGlossary = ( {
  production,
  edition,
  options
} ) => {
  const {
    contextualizers,
    resources
  } = production;

  const {
      showUncited = false,
      glossaryTypes = [ 'person', 'place', 'event', 'notion', 'other' ]
    } = options;

  let items;
  const usedContextualizations = getContextualizationsFromEdition( production, edition );
  if ( showUncited ) {
    items = Object.keys( production.resources )
        .filter( ( resourceId ) => production.resources[resourceId].metadata.type === 'glossary' )
        .map( ( resourceId ) => production.resources[resourceId] )
        .map( ( resource ) => {
          return {
            resource,
            mentions: usedContextualizations.filter( ( c ) => c.contextualization.resourceId === resource.id )
          };
        } );
  }
 else {
    items = usedContextualizations
      .filter( ( element ) => {
        const contextualization = element.contextualization;
        const contextualizerId = contextualization.contextualizerId;
        const contextualizer = contextualizers[contextualizerId];
        return contextualizer && contextualizer.type === 'glossary';
      } )
      .map( ( element ) => {
        const contextualization = element.contextualization;
        return {
          ...contextualization,
          contextualizer: contextualizers[contextualization.contextualizerId],
          resource: resources[contextualization.resourceId],
          contextContent: buildContextContent( production, contextualization.id ),
          containerId: element.containerId,
        };
      } )
      .reduce( ( entries, contextualization ) => {
        return {
          ...entries,
          [contextualization.resourceId]: {
            resource: contextualization.resource,
            mentions: entries[contextualization.resourceId] ?
                        entries[contextualization.resourceId].mentions.concat( contextualization )
                        : [ contextualization ]
          }
        };
      }, {} );
      items = Object.keys( items ).map( ( resourceId ) => ( {
        resource: items[resourceId].resource,
        mentions: items[resourceId].mentions
      } ) );
  }

  const glossaryMentions = items
  .filter( ( item ) => {
    return glossaryTypes.includes( item.resource.data.entryType );
  } )
  .sort( ( a, b ) => {
    if ( a.resource.data.name.toLowerCase() > b.resource.data.name.toLowerCase() ) {
      return 1;
    }
    else {
      return -1;
    }
  } );

  return glossaryMentions;
};
