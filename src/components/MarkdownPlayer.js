import React from 'react';
import Player from 'react-markdown';

export default ( { src = '' } ) => <Player escapeHtml={false} source={ src } />;
