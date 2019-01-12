import React from 'react';
import Helmet from 'react-helmet';

const PlainHead = ( { children } ) => <head profile={ 'http://dublincore.org/documents/2008/08/04/dc-html/' }>{children}</head>;

const ProductionHead = ( {
  production,
  edition = {},
  pageName,
  withHelmet = false
} ) => {

  /**
   * @todo check https://scholar.google.com/intl/en/scholar/inclusion.html#indexing
   */
  const title = `${edition.data.publicationTitle && edition.data.publicationTitle.length ? edition.data.publicationTitle : production.metadata.title}${pageName ? ` - ${ pageName}` : ''}`,
        authors = production.metadata.authors || [],
        tags = production.metadata.tags || [],
        description = production.metadata.description,
        url = '';
  const authorsStr = authors.map( ( a ) => `${a.given} ${a.family}` ).join( ', ' );
  const Container = withHelmet ? Helmet : PlainHead;
  return (
    <Container>
      <title>{title}</title>
      <meta
        name={ 'generator' }
        content={ 'peritext' }
      />
      {/*<!-- META DUBLIN CORE -->*/}
      <link
        rel={ 'schema.DC' }
        href={ 'http://purl.org/dc/elements/1.1/' }
      />
      <meta
        name={ 'DC.Title' }
        lang={ 'fr' }
        content={ title }
      />

      {
        authors.map( ( author, authorIndex ) => (
          <meta
            key={ `${author.family}, ${author.given}-${authorIndex}` }
            name={ 'DC.creator' }
            content={ `${author.family}, ${author.given}` }
          />
        ) )
      }
      <meta
        name={ 'DC.issued' }
        lang={ 'fr' }
        content={ edition.metadata.lastUpdateAt && new Date( edition.metadata.lastUpdateAt ).toISOString() }
      />
      <meta
        name={ 'DC.Date.created' }
        schema={ 'W3CDTF' }
        content={ new Date().toISOString() }
      />

      {/*<!-- END META DUBLIN CORE -->*/}

      {/*<!-- REGULAR META -->*/}
      <meta
        name={ 'author' }
        content={ authorsStr }
      />
      <meta
        name={ 'keywords' }
        content={ tags.join( ',' ) }
      />
      <meta
        name={ 'description' }
        content={ description }
      />
      <meta
        name={ 'viewport' }
        content={ 'user-scalable=no,width=device-width' }
      />
      {/*<!-- END REGULAR META -->*/}

      {/*<!-- META TWITTER -->*/}
      <meta
        name={ 'twitter:card' }
        value={ 'summary' }
      />
      <meta
        name={ 'twitter:site' }
        content={ url }
      />
      <meta
        name={ 'twitter:title' }
        content={ title }
      />
      <meta
        name={ 'twitter:description' }
        content={ description }
      />
      {/*<!-- end meta twitter-->*/}

      {/*<!-- META GOOGLE + -->*/}
      <meta
        itemProp={ 'name' }
        content={ title }
      />
      <meta
        itemProp={ 'description' }
        content={ description }
      />
      {/*<!-- END META GOOGLE + -->*/}

      {/*<!-- META OPEN GRAPH / FACEBOOK -->*/}
      <meta
        property={ 'og:title' }
        content={ title }
      />
      <meta
        property={ 'og:type' }
        content={ 'website' }
      />
      <meta
        property={ 'og:url' }
        content={ url }
      />
      <meta
        property={ 'og:description' }
        content={ description }
      />
      {/*<!-- END META OPEN GRAPH / FACEBOOK -->*/}
    </Container>
  );
};

export default ProductionHead;
