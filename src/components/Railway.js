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
                  className={ 'shadow' }
                  data-html
                  data-tip={ shadow.html }
                  data-place={ 'left' }
                  data-effect={ 'solid' }
                  data-for={ 'tooltip' }
                  data-offset={ "{'left': 20}" }
                  onClick={ handleClick }
                  key={ index }
                  style={ {
                            top: `${shadow.y * 100 }%`,
                            height: `${shadow.h * 100 }%`,
                        } }
                />
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
      <Tooltip id={ 'tooltip' } />
    </nav>
  );

};

export default Railway;
