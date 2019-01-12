import React from 'react';
import Link from './LinkProvider';

const FrontCover = ( {
  production,
  edition = {},
  options = {},
  nextNavItem,
} ) => {
  const {
    customTitle,
    customSubtitle,
    customPresentationText,
    customReadingLinks = [],
    customNextLinkTitle,
    animatedBackground = 'none',
  } = options;
  const {
    data = {}
  } = edition;
  const {
    publicationTitle,
    publicationSubtitle,
  } = data;
  const title = ( customTitle && customTitle.trim().length ) ? customTitle : publicationTitle || production.metadata.title;
  const subtitle = ( customSubtitle && customSubtitle.trim().length ) ? customSubtitle : publicationSubtitle || production.metadata.subtitle;
  const presentationText = ( customPresentationText && customPresentationText.trim().length ) ? customPresentationText : production.metadata.abstract;
  const authors = production.metadata.authors || [];
  return (
    <div className={ `landing-player main-contents-container ${animatedBackground && animatedBackground !== 'none' ? `has-animated-background-${ animatedBackground}` : ''}` }>
      <div className={ 'main-column' }>
        <div className={ 'header' }>
          <h1 className={ 'landing-title' }>{title}</h1>
          {subtitle && subtitle.length &&
            <h2 className={ 'landing-subtitle' }>
              {subtitle}
            </h2>
          }
          <h3>
            {
              authors.length > 0 &&
              authors
              .map( ( author, authorIndex ) => {
                return typeof author === 'string' ?
                  ( <span key={ authorIndex }>{author}</span> )
                    :
                  (
                    <span key={ authorIndex }>
                      {`${author.given} ${author.family}`}
                    </span>
                  );
              } )
              .reduce( ( cur, item, index ) => {
                return index === 0 ?
                  [ item ]
                  :
                  [ ...cur, ', ', item ];
              }, [] )
            }
          </h3>
        </div>
        {
          presentationText &&
          <div className={ 'presentation' }>
            {presentationText}
          </div>
        }
        <ul className={ 'links' }>
          {nextNavItem &&
          <li className={ 'main-link' }>
            <Link to={ nextNavItem }>
              {customNextLinkTitle && customNextLinkTitle.length ? customNextLinkTitle : nextNavItem.title} →
            </Link>
          </li>
          }
          {customReadingLinks.length > 0 &&
            customReadingLinks.map( ( link, index ) => {
              return (
                <a
                  key={ index }
                  href={ link.link }
                  target={ 'blank' }
                  rel={ 'noopener' }
                >
                  {link.linkTitle} →
                </a>
              );
            } )
          }
        </ul>
      </div>

    </div>
  );
};

export default FrontCover;
