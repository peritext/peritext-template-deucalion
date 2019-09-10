"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d3Ease = require("d3-ease");

var _reactCustomScrollbars = require("react-custom-scrollbars");

var _reactCiteproc = require("react-citeproc");

var _peritextUtils = require("peritext-utils");

var _lodash = require("lodash");

var _ProductionHead = _interopRequireDefault(require("./ProductionHead"));

var _utils = require("../utils");

var _Nav = _interopRequireDefault(require("./Nav"));

var _defaultStyle = _interopRequireDefault(require("../defaultStyle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const inBrowser = isBrowser();
/* eslint no-new-func : 0 */

let sizeMe;

if (inBrowser) {
  sizeMe = require('react-sizeme');
}

const RESPONSIVE_BREAK_POINTS = {
  TABLET_MIN_WIDTH: 768,
  DESKTOP_MIN_WIDTH: 1224
};

const getOffsetToParent = (element, container) => {
  let offset = 0;
  let el = element;

  do {
    offset += el.offsetTop;
    el = el.offsetParent;
  } while (el !== undefined && el !== container);

  return offset;
};

class Layout extends _react.Component {
  constructor(_props, _context) {
    super(_props);

    _defineProperty(this, "getChildContext", () => {
      const dimensions = _objectSpread({}, this.props.size, {
        width: this.props.size && this.props.size.width || inBrowser && window.innerWidth,
        height: this.props.size && this.props.size.height || inBrowser && window.innerHeight
      });

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
        asideVisible: this.state.gui.asideVisible
      };
    });

    _defineProperty(this, "componentDidMount", () => {
      this.updateConstants(this.props);
      this.onProductionChange(this.context.production);
    });

    _defineProperty(this, "componentWillReceiveProps", nextProps => {
      if (this.props.production !== nextProps.production) {
        this.updateConstants(nextProps);
      }

      if (this.props.viewId !== nextProps.viewId) {
        if (this.state.gui.asideVisible) {
          setTimeout(() => this.toggleAsideVisible());
        }
        /**
         * Mobiles & tablets: close full-screen menu
         */


        if (this.state.gui.indexOpen && nextProps.size.width < RESPONSIVE_BREAK_POINTS.DESKTOP_MIN_WIDTH) {
          this.toggleIndex();
        }
      }
    });

    _defineProperty(this, "componentWillUpdate", (nextProps, nextState, nextContext) => {
      if (this.context.production && nextContext.production && this.context.production.id !== nextContext.production.id) {
        this.onProductionChange(nextContext.production);
      }
    });

    _defineProperty(this, "updateConstants", props => {
      this.setState({
        finalCss: this.updateStyles(props, this.context)
      });
    });

    _defineProperty(this, "bindContextualizationElement", (id, element) => {
      this.contextualizationElements[id] = element;
    });

    _defineProperty(this, "buildCitations", production => {
      const {
        contextualizations,
        resources,
        contextualizers
      } = production;
      const bibContextualizations = Object.keys(contextualizations).filter(assetKey => contextualizers[contextualizations[assetKey].contextualizerId].type === 'bib').map(assetKey => contextualizations[assetKey]); // build citations items data

      const citationItems = bibContextualizations.reduce((finalCitations, contextualization) => {
        const resource = resources[contextualization.resourceId];
        const citations = [...(0, _peritextUtils.resourceToCslJSON)(resource), ...(contextualization.additionalResources ? contextualization.additionalResources.map(resId => (0, _peritextUtils.resourceToCslJSON)(resources[resId])) : [])].flat();
        const newCitations = citations.reduce((final2, citation) => {
          return _objectSpread({}, final2, {
            [citation.id]: citation
          });
        }, {});
        return _objectSpread({}, finalCitations, newCitations);
      }, {}); // build citations's citations data

      const citationInstances = bibContextualizations // Object.keys(bibContextualizations)
      .map((bibCit, index) => {
        const key1 = bibCit.id;
        const contextualization = contextualizations[key1];
        const contextualizer = contextualizers[contextualization.contextualizerId];
        const resource = resources[contextualization.resourceId];
        const targets = [...(0, _peritextUtils.resourceToCslJSON)(resource), ...(bibCit.additionalResources ? bibCit.additionalResources.map(resId => (0, _peritextUtils.resourceToCslJSON)(resources[resId])) : [])].flat();
        return {
          citationID: key1,
          citationItems: targets.map(ref => ({
            locator: contextualizer.locator,
            prefix: contextualizer.prefix,
            suffix: contextualizer.suffix,
            // ...contextualizer,
            id: ref.id
          })),
          properties: {
            noteIndex: index + 1
          }
        };
      }).filter(c => c);
      /*
       * map them to the clumsy formatting needed by citeProc
       * todo: refactor the citationInstances --> citeProc-formatted data as a util
       */

      const citationData = citationInstances.map((instance, index) => [instance, // citations before
      citationInstances.slice(0, index === 0 ? 0 : index).map(oCitation => [oCitation.citationID, oCitation.properties.noteIndex]), []
      /*
       * citations after (not using it seems to work anyway)
       * citationInstances.slice(index)
       *   .map((oCitation) => [
       *       oCitation.citationID,
       *       oCitation.properties.noteIndex
       *     ]
       *   ),
       */
      ]);
      return {
        citationItems,
        citationData
      };
    });

    _defineProperty(this, "onProductionChange", production => {
      this.setState({
        citations: this.buildCitations(production)
      });
    });

    _defineProperty(this, "scrollToElement", (element, center = true, withTransition = true) => {
      if (element && inBrowser && this.globalScrollbar) {
        const container = this.globalScrollbar.container;
        let offset = getOffsetToParent(element, container);
        offset = center && this.props.size ? offset - this.props.size.height / 2 : offset;
        this.scrollTo(offset, withTransition);
      }
    });

    _defineProperty(this, "scrollToContextualization", (id, center = true) => {
      const element = this.contextualizationElements[id];
      this.scrollToElement(element, center);
    });

    _defineProperty(this, "scrollToElementId", (id, center = true) => {
      const element = this.context.usedDocument.getElementById(id);
      this.scrollToElement(element, center);
    });

    _defineProperty(this, "scrollTo", (initialTop, withTransition = true) => {
      if (!withTransition) {
        if (this.globalScrollbar) {
          this.globalScrollbar.scrollTop(initialTop);
        }

        return;
      }

      const scrollbars = this.globalScrollbar;

      if (!scrollbars) {
        setTimeout(() => {
          if (this.globalScrollbar) {
            this.scrollTo(initialTop);
          }
        });
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

      for (let t = 0; t <= 1; t += animationTick) {
        const to = (0, _d3Ease.easeCubic)(t);
        setTimeout(() => {
          this.globalScrollbar.scrollTop(scrollTop + diff * to);
        }, ANIMATION_DURATION * t);
      }
    });

    _defineProperty(this, "onScrollUpdate", scrollPosition => {
      const scrollTop = scrollPosition.top;
      const scrollTopAbs = scrollPosition.scrollTop;
      const scrollRatio = scrollPosition.clientHeight / scrollPosition.scrollHeight;
      const scrollTopRatio = scrollPosition.scrollTop / scrollPosition.scrollHeight;
      let stateChanges = {};

      if (scrollTop !== this.state.gui.scrollTop) {
        stateChanges = _objectSpread({}, stateChanges, {
          gui: _objectSpread({}, this.state.gui, {
            inTop: scrollTop === 0 ? true : false,
            scrollTop,
            scrollTopAbs,
            scrollRatio,
            scrollTopRatio,
            scrollHeight: scrollPosition.scrollHeight
          })
        });
      }

      if (Object.keys(stateChanges).length) {
        this.setState(stateChanges);
      }
    });

    _defineProperty(this, "toggleIndex", () => {
      this.setState({
        gui: _objectSpread({}, this.state.gui, {
          indexOpen: !this.state.gui.indexOpen
        })
      });
    });

    _defineProperty(this, "toggleAsideVisible", () => {
      this.setState({
        gui: _objectSpread({}, this.state.gui, {
          asideVisible: !this.state.gui.asideVisible
        })
      });
    });

    _defineProperty(this, "updateStyles", (props, context) => {
      const {
        edition: {
          data = {}
        }
      } = props;
      const {
        contextualizers = {}
      } = context;
      const {
        style: {
          css = '',
          mode = 'merge'
        } = {
          css: ''
        }
      } = data;
      const contextualizersStyles = Object.keys(contextualizers).map(type => contextualizers[type] && contextualizers[type].defaultCss || '').join('\n');

      if (mode === 'merge') {
        return [_defaultStyle.default, // templateStylesheet,
        contextualizersStyles, css].join('\n');
      } else {
        // styleMode === 'replace'
        return [contextualizersStyles, css].join('\n');
      }
    });

    _defineProperty(this, "render", () => {
      const {
        props: {
          children,
          production,
          edition = {},
          summary = [],
          viewId,
          viewClass
        },
        context: {},
        state: {
          finalCss,
          gui: {
            indexOpen,
            inTop,
            asideVisible
          },
          citations
        },
        toggleIndex,
        onScrollUpdate
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
      const editionAsCSLRecord = (0, _utils.convertEditionToCslRecord)(production, edition);

      const bindGlobalScrollbarRef = scrollbar => {
        this.globalScrollbar = scrollbar;
      };

      const activeItem = viewId && summary.find(v => v.viewId === viewId);
      const locationTitle = activeItem && activeItem.routeClass !== 'landing' && activeItem.title;
      return _react.default.createElement(_reactCiteproc.ReferencesManager, {
        style: citationStyle,
        locale: citationLocale,
        items: citations.citationItems,
        citations: citations.citationData,
        componentClass: 'references-manager'
      }, _react.default.createElement(_ProductionHead.default, {
        production: production,
        edition: edition,
        withHelmet: true
      }), inBrowser ? _react.default.createElement("section", {
        className: `deucalion-layout has-view-class-${viewClass} ${asideVisible ? 'has-aside-visible' : ''} ${indexOpen ? 'has-index-open' : ''}`
      }, _react.default.createElement("section", {
        className: 'main-container'
      }, _react.default.createElement(_reactCustomScrollbars.Scrollbars, {
        ref: bindGlobalScrollbarRef,
        autoHide: true,
        onUpdate: onScrollUpdate,
        universal: true
      }, _react.default.createElement(_peritextUtils.StructuredCOinS, {
        cslRecord: editionAsCSLRecord
      }), children)), _react.default.createElement(_Nav.default, {
        indexOpen: indexOpen,
        toggleIndex: toggleIndex,
        locationTitle: locationTitle,
        inTop: inTop,
        summary: summary,
        title: globalTitle
      })) : // config for server-side rendering (no scrollbars)
      _react.default.createElement("section", {
        className: `deucalion-layout has-view-class-${viewClass} ${asideVisible ? 'has-aside-visible' : ''} ${indexOpen ? 'has-index-open' : ''}`
      }, _react.default.createElement("section", {
        className: 'main-container'
      }, children), _react.default.createElement(_Nav.default, {
        indexOpen: indexOpen,
        toggleIndex: toggleIndex,
        locationTitle: locationTitle,
        inTop: inTop,
        edition: edition,
        title: globalTitle
      })), _react.default.createElement("style", {
        type: 'text/css',
        dangerouslySetInnerHTML: {
          /* eslint react/no-danger: 0 */
          __html: finalCss
        }
      }), _react.default.createElement("div", {
        dangerouslySetInnerHTML: {
          /* eslint react/no-danger: 0 */
          __html: additionalHTML
        }
      }));
    });

    this.state = {
      gui: {
        indexOpen: false
      },
      citations: this.buildCitations(_props.production),
      finalCss: this.updateStyles(_props, _context)
    };
    this.contextualizationElements = {};
    this.onScrollUpdate = (0, _lodash.debounce)(this.onScrollUpdate, 100);
  }

}

Layout.contextTypes = {
  production: _propTypes.default.object,
  edition: _propTypes.default.object,
  usedDocument: _propTypes.default.object,
  contextualizers: _propTypes.default.object
};
Layout.childContextTypes = {
  dimensions: _propTypes.default.object,
  scrollToElementId: _propTypes.default.func,
  scrollToElement: _propTypes.default.func,
  scrollToTop: _propTypes.default.func,
  scrollTop: _propTypes.default.number,
  scrollTopAbs: _propTypes.default.number,
  scrollRatio: _propTypes.default.number,
  scrollTopRatio: _propTypes.default.number,
  scrollHeight: _propTypes.default.number,
  rawCitations: _propTypes.default.object,
  bindContextualizationElement: _propTypes.default.func,
  scrollToContextualization: _propTypes.default.func,
  asideVisible: _propTypes.default.bool,
  toggleAsideVisible: _propTypes.default.func
};

var _default = inBrowser && sizeMe ? sizeMe({
  monitorHeight: true,
  monitorWidth: true,
  monitorPosition: true
})(Layout) : Layout;

exports.default = _default;