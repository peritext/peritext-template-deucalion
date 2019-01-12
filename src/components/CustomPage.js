import React from 'react';

import MarkdownPlayer from './MarkdownPlayer';

const FrontCover = ( {
  activeViewParams,
  options = {},
} ) => {
  const {
    title,
    markdownContents,
    customCssId = activeViewParams.routeSlug
  } = options;
  return (
    <div
      id={ customCssId }
      className={ 'custom-page main-contents-container' }
    >
      <div className={ 'main-column' }>
        <div className={ 'header view-title' }>
          <h1>{title}</h1>
        </div>
        <div className={ 'contents' }>
          <MarkdownPlayer src={ markdownContents } />
        </div>
      </div>
    </div>
  );
};

export default FrontCover;
