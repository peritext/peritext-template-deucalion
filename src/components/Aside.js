import React from 'react';
import PropTypes from 'prop-types';

const Aside = ( {
  children,
  isActive,
  title = '',
  onClose,
}, {
  toggleAsideVisible,
} ) => {

  return (
    <aside className={ `aside ${isActive ? 'is-active' : ''}` }>
      <button
        className={ 'aside-toggle' }
        onClick={ toggleAsideVisible }
      >
      ▶
      </button>
      <div className={ 'aside-content' }>
        <div className={ 'aside-header' }>
          <h4 className={ 'aside-title' }>
            {title}
          </h4>
          {
            typeof onClose === 'function' &&
            <button
              onClick={ onClose }
              className={ 'aside-close-btn' }
            >
              ×
            </button>
          }
        </div>
        <div className={ 'aside-body' }>
          {children}
        </div>
      </div>
    </aside>
  );

};

Aside.contextTypes = {
  toggleAsideVisible: PropTypes.func,
};

export default Aside;
