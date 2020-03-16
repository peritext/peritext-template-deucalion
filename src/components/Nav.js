import React from 'react';
import PropTypes from 'prop-types';
import { abbrevString } from 'peritext-utils';
const Nav = ( {
  summary = [],
  toggleIndex,
  locationTitle,
  title
}, { LinkComponent } ) => {
  const realSummary = summary.filter( ( v ) => v.routeClass !== 'landing' );
  const landingView = summary.find( ( v ) => v.routeClass === 'landing' );
  let firstLink = landingView;
  if ( !firstLink && summary.length ) {
    firstLink = summary[0];
  }
  return (
    <nav className={ 'nav' }>
      <div className={ 'nav-header' }>
        <button
          className={ 'nav-toggle' }
          onClick={ toggleIndex }
        >
          <span className={ 'nav-toggle-symbol' }>✚</span>
        </button>
        <h1 className={ 'title' }>
          {
            firstLink ?
              <LinkComponent to={ firstLink }>
                <strong className={ 'hero-title' }>
                  {abbrevString( title, 40 )}
                </strong>
              </LinkComponent>
            : title
          } {
            locationTitle &&
            <em
              onClick={ toggleIndex }
              className={ 'location-title' }
            >
              {abbrevString( locationTitle, 60 )}
            </em>
          }
        </h1>

      </div>
      <div className={ 'nav-content-container' }>
        <ul>
          {
            realSummary.map( ( item, index ) => {
              return (
                <li
                  key={ index }
                  className={ `nav-item level-${item.level}` }
                >
                  <LinkComponent to={ item }>
                    {item.title}
                  </LinkComponent>
                </li>
              );

            } )
          }
        </ul>
      </div>
    </nav>
  );
};
Nav.contextTypes = {
  LinkComponent: PropTypes.func,
};

export default Nav;
