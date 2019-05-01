import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { easeCubic } from 'd3-ease';
import { Scrollbars } from 'react-custom-scrollbars';
import { ReferencesManager } from 'react-citeproc';
import { resourceToCslJSON, StructuredCOinS } from 'peritext-utils';

import ProductionHead from './ProductionHead';

import { convertEditionToCslRecord } from '../utils';
import Nav from './Nav';
import templateStyle from '../defaultStyle';

const isBrowser = new Function( 'try {return this===window;}catch(e){ return false;}' );
const inBrowser = isBrowser();/* eslint no-new-func : 0 */
let sizeMe;

if ( inBrowser ) {
  sizeMe = require( 'react-sizeme' );
}

const RESPONSIVE_BREAK_POINTS = {
  TABLET_MIN_WIDTH: 768,
  DESKTOP_MIN_WIDTH: 1224,
};

const getOffsetToParent = ( element, container ) => {
  let offset = 0;
  let el = element;
  do {
    offset += el.offsetTop;
    el = el.offsetParent;
  } while ( el !== undefined && el !== container );

  return offset;
};

class Layout extends Component {
  constructor( props, context ) {
    super( props );
    this.state = {
      gui: {
        indexOpen: false,
      },
      citations: this.buildCitations( props.production ),
      finalCss: this.updateStyles( props, context )
    };
    this.contextualizationElements = {};
  }

  getChildContext = () => {
    const dimensions = {
      ...this.props.size,
      width: ( this.props.size && this.props.size.width ) || ( inBrowser && window.innerWidth ),
      height: ( this.props.size && this.props.size.height ) || ( inBrowser && window.innerHeight ),
    };
    return {
      dimensions,
      scrollToElement: this.scrollToElement,
      scrollToElementId: this.scrollToElementId,
      scrollToTop: this.scrollTo,
      scrollTop: this.state.gui.scrollTop,
      scrollTopAbs: this.state.gui.scrollTopAbs,
      scrollRatio: this.state.gui.scrollRatio,
      scrollTopRatio: this.state.gui.scrollTopRatio,
      scrollHeight: this.state.gui.scrollHeight,
      rawCitations: this.state.citations,
      bindContextualizationElement: this.bindContextualizationElement,
      scrollToContextualization: this.scrollToContextualization,

      toggleAsideVisible: this.toggleAsideVisible,
      asideVisible: this.state.gui.asideVisible,
    };
  }

  /**
   * Livecycle methods
   */
  componentDidMount = () => {
    this.updateConstants( this.props );
    this.onProductionChange( this.context.production );
  }

  componentWillReceiveProps = ( nextProps ) => {
    if ( this.props.production !== nextProps.production ) {
      this.updateConstants( nextProps );
    }
    if ( this.props.viewId !== nextProps.viewId ) {
      if ( this.state.gui.asideVisible ) {
        setTimeout( () => this.toggleAsideVisible() );
      }

      /**
       * Mobiles & tablets: close full-screen menu
       */
      if ( this.state.gui.indexOpen && nextProps.size.width < RESPONSIVE_BREAK_POINTS.DESKTOP_MIN_WIDTH ) {
        this.toggleIndex();
      }

    }
  }

  componentWillUpdate = ( nextProps, nextState, nextContext ) => {
    if ( this.context.production && nextContext.production && this.context.production.id !== nextContext.production.id ) {
      this.onProductionChange( nextContext.production );
    }
  }

  updateConstants = ( props ) => {
    this.setState( {
      finalCss: this.updateStyles( props, this.context )
    } );
  }

  bindContextualizationElement = ( id, element ) => {
    this.contextualizationElements[id] = element;
  }

  buildCitations = ( production ) => {
    const {
      contextualizations,
      resources,
      contextualizers
    } = production;

    const bibContextualizations = Object.keys( contextualizations )
      .filter( ( assetKey ) =>
          contextualizers[contextualizations[assetKey].contextualizerId].type === 'bib'
        )
      .map( ( assetKey ) => contextualizations[assetKey] );

    // build citations items data
    const citationItems = bibContextualizations
      .reduce( ( finalCitations, contextualization ) => {
        const resource = resources[contextualization.resourceId];
        const citations = resourceToCslJSON( resource );
        const newCitations = citations.reduce( ( final2, citation ) => {
          return {
            ...final2,
            [citation.id]: citation
          };
        }, {} );
        return {
          ...finalCitations,
          ...newCitations,
        };
      }, {} );

    // build citations's citations data
    const citationInstances = bibContextualizations // Object.keys(bibContextualizations)
      .map( ( bibCit, index ) => {
        const key1 = bibCit.id;
        const contextualization = contextualizations[key1];

        const contextualizer = contextualizers[contextualization.contextualizerId];
        const resource = resources[contextualization.resourceId];
        return {
          citationID: key1,
          citationItems: resourceToCslJSON( resource ).map( ( ref ) => ( {
            locator: contextualizer.locator,
            prefix: contextualizer.prefix,
            suffix: contextualizer.suffix,
            // ...contextualizer,
            id: ref.id,
          } ) ),
          properties: {
            noteIndex: index + 1
          }
        };
      } ).filter( ( c ) => c );

    /*
     * map them to the clumsy formatting needed by citeProc
     * todo: refactor the citationInstances --> citeProc-formatted data as a util
     */
    const citationData = citationInstances.map( ( instance, index ) => [
      instance,
      // citations before
      citationInstances.slice( 0, ( index === 0 ? 0 : index ) )
        .map( ( oCitation ) => [
            oCitation.citationID,
            oCitation.properties.noteIndex
          ]
        ),
      []

      /*
       * citations after (not using it seems to work anyway)
       * citationInstances.slice(index)
       *   .map((oCitation) => [
       *       oCitation.citationID,
       *       oCitation.properties.noteIndex
       *     ]
       *   ),
       */
    ] );

    return { citationItems, citationData };
  }

  onProductionChange = ( production ) => {
    this.setState( {
      citations: this.buildCitations( production )
    } );
  }

  scrollToElement = ( element, center = true, withTransition = true ) => {
    if ( element && inBrowser && this.globalScrollbar ) {
      const container = this.globalScrollbar.container;
      let offset = getOffsetToParent( element, container );
      offset = center && this.props.size ? offset - this.props.size.height / 2 : offset;
      this.scrollTo( offset, withTransition );
    }
  }

  scrollToContextualization = ( id, center = true ) => {
      const element = this.contextualizationElements[id];
      this.scrollToElement( element, center );
  }

  /**
   * Handle scrolling to a specific title in the page
   * @param {string} id - the id of the item to scroll to
   */
  scrollToElementId = ( id, center = true ) => {
    const element = this.context.usedDocument.getElementById( id );
    this.scrollToElement( element, center );
  }

  /**
   * Programmatically modifies the scroll state of the component
   * so that it transitions to a specific point in the page
   * @param {number} top - the position to scroll to
   */
  scrollTo = ( initialTop, withTransition = true ) => {
    if ( !withTransition ) {
      if ( this.globalScrollbar ) {
        this.globalScrollbar.scrollTop( initialTop );
      }
      return;
    }
    const scrollbars = this.globalScrollbar;
    if ( !scrollbars ) {
      setTimeout( () => {
        if ( this.globalScrollbar ) {
          this.scrollTo( initialTop );
        }
      } );
      return;
    }
    const scrollTop = scrollbars.getScrollTop();
    const scrollHeight = scrollbars.getScrollHeight();
    let top = initialTop > scrollHeight ? scrollHeight : initialTop;
      top = top < 0 ? 0 : top;

      const ANIMATION_DURATION = 1000;
      const ANIMATION_STEPS = 10;
      const animationTick = 1 / ANIMATION_STEPS;

      const diff = top - scrollTop;

      for ( let t = 0; t <= 1; t += animationTick ) {
        const to = easeCubic( t );
        setTimeout( () => {
          this.globalScrollbar.scrollTop( scrollTop + ( diff * to ) );
        }, ANIMATION_DURATION * t );
      }
  }

  onScrollUpdate = ( scrollPosition ) => {
    const scrollTop = scrollPosition.top;
    const scrollTopAbs = scrollPosition.scrollTop;
    const scrollRatio = scrollPosition.clientHeight / scrollPosition.scrollHeight;
    const scrollTopRatio = scrollPosition.scrollTop / scrollPosition.scrollHeight;
    let stateChanges = {};
    if ( scrollTop !== this.state.gui.scrollTop ) {
      stateChanges = {
        ...stateChanges,
        gui: {
          ...this.state.gui,
          inTop: scrollTop === 0 ? true : false,
          scrollTop,
          scrollTopAbs,
          scrollRatio,
          scrollTopRatio,
          scrollHeight: scrollPosition.scrollHeight,
        }
      };
    }
    if ( Object.keys( stateChanges ).length ) {
      this.setState( stateChanges );
    }
  }

  toggleIndex = ( ) => {
    this.setState( {
      gui: {
        ...this.state.gui,
        indexOpen: !this.state.gui.indexOpen,
      }
    } );
  }

  toggleAsideVisible = ( ) => {
    this.setState( {
      gui: {
        ...this.state.gui,
        asideVisible: !this.state.gui.asideVisible,
      }
    } );
  }

  updateStyles = ( props, context ) => {
    const {
      edition: {
        data = {}
      },

    } = props;
    const {
      contextualizers = {}
    } = context;

    const {
          style: {
            css = '',
            mode = 'merge',
          } = { css: '' }
    } = data;

    const contextualizersStyles = Object.keys( contextualizers )
      .map( ( type ) => contextualizers[type] && contextualizers[type].defaultCss || '' )
      .join( '\n' );
    if ( mode === 'merge' ) {
      return [
        templateStyle,
        // templateStylesheet,
        contextualizersStyles,
        css
      ]
      .join( '\n' );
    }
    else { // styleMode === 'replace'
      return [
        contextualizersStyles,
        css
      ].join( '\n' );
    }

  }

  render = () => {

    const {
      props: {
        children,
        production,
        edition = {},
        summary = [],
        viewId,
        viewClass,
      },
      context: {

      },
      state: {
        finalCss,
        gui: {
          indexOpen,
          inTop,
          asideVisible,
        },
        citations,
      },
      toggleIndex,
      onScrollUpdate,
    } = this;

    const {
      data = {}
    } = edition;
    const {
      additionalHTML = ''
    } = data;

    const citationStyle = edition.data.citationStyle.data;
    const citationLocale = edition.data.citationLocale.data;
    const globalTitle = edition.data.publicationTitle && edition.data.publicationTitle.length ? edition.data.publicationTitle : production.metadata.title;

    const editionAsCSLRecord = convertEditionToCslRecord( production, edition );
    const bindGlobalScrollbarRef = ( scrollbar ) => {
      this.globalScrollbar = scrollbar;
    };

    const activeItem = viewId && summary.find( ( v ) => v.viewId === viewId );
    const locationTitle = activeItem && activeItem.routeClass !== 'landing' && activeItem.title;

    return (
      <ReferencesManager
        style={ citationStyle }
        locale={ citationLocale }
        items={ citations.citationItems }
        citations={ citations.citationData }
        componentClass={ 'references-manager' }
      >
        <ProductionHead
          production={ production }
          edition={ edition }
          withHelmet
        />
        {inBrowser ?
          <section
            className={ `deucalion-layout has-view-class-${viewClass} ${asideVisible ? 'has-aside-visible' : ''} ${indexOpen ? 'has-index-open' : ''}` }
          >

            <section className={ 'main-container' }>
              <Scrollbars
                ref={ bindGlobalScrollbarRef }
                autoHide
                onUpdate={ onScrollUpdate }
                universal
              >
                <StructuredCOinS cslRecord={ editionAsCSLRecord } />
                {children}
              </Scrollbars>
            </section>
            <Nav
              indexOpen={ indexOpen }
              toggleIndex={ toggleIndex }
              locationTitle={ locationTitle }
              inTop={ inTop }
              summary={ summary }
              title={ globalTitle }
            />
          </section>
            : // config for server-side rendering (no scrollbars)
          <section
            className={ `deucalion-layout has-view-class-${viewClass} ${asideVisible ? 'has-aside-visible' : ''} ${indexOpen ? 'has-index-open' : ''}` }
          >
            <section className={ 'main-container' }>
              {children}
            </section>
            <Nav
              indexOpen={ indexOpen }
              toggleIndex={ toggleIndex }
              locationTitle={ locationTitle }
              inTop={ inTop }
              edition={ edition }
              title={ globalTitle }
            />
          </section>
        }
        <style
          type={ 'text/css' }
          dangerouslySetInnerHTML={ {/* eslint react/no-danger: 0 */
            __html: finalCss
          } }
        />
        <div
          dangerouslySetInnerHTML={ {/* eslint react/no-danger: 0 */
            __html: additionalHTML
          } }
        />
      </ReferencesManager>
    );
  }
}

Layout.contextTypes = {
  production: PropTypes.object,
  edition: PropTypes.object,
  usedDocument: PropTypes.object,
  contextualizers: PropTypes.object,
};

Layout.childContextTypes = {
  dimensions: PropTypes.object,
  scrollToElementId: PropTypes.func,
  scrollToElement: PropTypes.func,
  scrollToTop: PropTypes.func,
  scrollTop: PropTypes.number,
  scrollTopAbs: PropTypes.number,
  scrollRatio: PropTypes.number,
  scrollTopRatio: PropTypes.number,
  scrollHeight: PropTypes.number,
  rawCitations: PropTypes.object,
  bindContextualizationElement: PropTypes.func,
  scrollToContextualization: PropTypes.func,

  asideVisible: PropTypes.bool,
  toggleAsideVisible: PropTypes.func
};

export default inBrowser && sizeMe ? sizeMe( {
  monitorHeight: true,
  monitorWidth: true,
  monitorPosition: true,
} )( Layout ) : Layout;
