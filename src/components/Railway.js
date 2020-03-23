import React from 'react';
import Tooltip from 'react-tooltip';

const Railway = ( {
    scrollRatio,
    scrollTopRatio,
    scrollToElement,
    shadows = [],
}, {
} ) => {
  return (
    <nav className={ 'railway' }>
      {
          shadows.map( ( shadow, index ) => {
              const handleClick = () => {
                scrollToElement( shadow.element );
              };
              return (
                <div
                  className={ `shadow ${shadow.tagName.toLowerCase()}` }
                  data-html
                  data-tip={ shadow.tagName.indexOf( 'H1' ) !== 0 ? shadow.text : undefined }
                  data-place={ 'left' }
                  data-effect={ 'solid' }
                  data-for={ 'railway-tooltip' }
                  data-offset={ "{'left': 20}" }
                  onClick={ handleClick }
                  key={ index }
                  style={ {
                            top: `${shadow.y * 100 }%`,
                            height: `${shadow.h * 100 }%`,
                        } }
                >
                  {shadow.tagName.indexOf( 'H' ) === 0 &&
                    <span className={ 'railway-title' }>{shadow.text}</span>
                  }
                </div>
                );
            } )
      }
      {
          ( scrollRatio !== undefined && scrollTopRatio !== undefined )
          ?
            <div
              className={ 'elevator' }
              style={ {
                top: `${scrollTopRatio * 100 }%`,
                height: `${scrollRatio * 100 }%`,
            } }
            />
          : null
      }
      <Tooltip id={ 'railway-tooltip' } />
    </nav>
  );

};

export default Railway;
