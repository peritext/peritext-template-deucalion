// import Helmet from 'react-helmet';

import Wrapper, { routeItemToUrl, buildNav, renderHeadFromRouteItem, getAdditionalRoutes } from './components/Wrapper';

import styles from './defaultStyle';

const components = {
  Edition: Wrapper,
};

import meta from './meta';

export default {
  meta,
  components,

  utils: {
    buildNav,
    routeItemToUrl,
    renderHeadFromRouteItem,
    getAdditionalRoutes,
  },

  css: styles
};
