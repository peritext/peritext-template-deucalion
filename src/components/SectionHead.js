import React from 'react';
import Helmet from 'react-helmet';

const PlainHead = ( { children } ) => <head>{children}</head>;

const SectionHead = ( {
  section,
  production,
  edition,
  withHelmet = false,
} ) => {
  if ( !section || !production ) {
    return null;
  }
  const title = `${edition.data.publicationTitle && edition.data.publicationTitle.length ? edition.data.publicationTitle : production.metadata.title} - ${section.metadata.title}`,
        authors = ( section.metadata.authors && section.metadata.authors.length ) ? section.metadata.authors : production.metadata.authors || [],
        tags = section.metadata.tags && section.metadata.tags.length ? section.metadata.tags : production.metadata.tags || [],
        description = section.metadata.description && section.metadata.description.length ? section.metadata.description : production.metadata.description,
        url = '';
  const authorsStr = authors.map( ( a ) => `${a.given} ${a.family}` ).join( ', ' );
  const Container = withHelmet ? Helmet : PlainHead;
  return (
    <Container>
      <meta charSet={ 'UTF-8' } />
      <title>{title}</title>
      <meta
        name={ 'generator' }
        content={ 'peritext' }
      />
      {/*<!-- META DUBLIN CORE -->*/}
      <meta
        name={ 'DC.Title' }
        lang={ 'fr' }
        content={ title }
      />
      <meta
        name={ 'DC.Date.created' }
        schema={ 'W3CDTF' }
        content={ new Date().toISOString() }
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
      {
          // tags.map((thatTag, index) => <meta key={index} name="DC.subject" xml:lang="en-GB" content={thatTag} />)
        }
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
      {/*<!-- todo : Twitter Summary card images must be at least 200x200px -->*/}
      {/*<meta name="twitter:image" content="https://ovide.surge.sh/apple-touch-icon.png">*/}
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
      {/*<meta itemProp="image" content="https://peritex.surge.sh/bulgur-rs.png">*/}
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

export default SectionHead;
