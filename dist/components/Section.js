"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _peritextUtils = require("peritext-utils");

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _utils = require("../utils");

var _RelatedContexts = _interopRequireDefault(require("./RelatedContexts"));

var _NotesContainer = _interopRequireDefault(require("./NotesContainer"));

var _Renderer = _interopRequireDefault(require("./Renderer"));

var _SectionHead = _interopRequireDefault(require("./SectionHead"));

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

var _Aside = _interopRequireDefault(require("./Aside"));

var _Railway = _interopRequireDefault(require("./Railway"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Section extends _react.Component {
  constructor(_props) {
    super(_props);

    _defineProperty(this, "getChildContext", () => {
      const {
        production = {},
        activeViewParams = {}
      } = this.props;
      return {
        openAsideContextualization: this.openAsideContextualization,
        openedContextualizationId: this.state.openedContextualizationId,
        notes: production.sections[activeViewParams.sectionId].notes,
        onNoteContentPointerClick: this.onNoteContentPointerClick
      };
    });

    _defineProperty(this, "componentDidMount", () => {
      this.init(this.props);
    });

    _defineProperty(this, "componentWillReceiveProps", nextProps => {
      if (this.props.activeViewClass !== nextProps.activeViewClass || this.props.activeViewParams !== nextProps.activeViewParams) {
        this.init(nextProps);
      }
    });

    _defineProperty(this, "componentWillUpdate", (nextProps, nextState, nextContext) => {
      /*
       * edge case of navigating mentions
       * within the same section
       */
      if (this.props.activeViewParams.sectionId === nextProps.activeViewParams.sectionId && this.state.gui.openedContextualizationId && !nextState.gui.openedContextualizationId && nextContext.asideVisible) {
        nextContext.toggleAsideVisible();
      }
    });

    _defineProperty(this, "init", props => {
      if (props.activeViewParams.contextualizationId) {
        setTimeout(() => {
          this.context.scrollToContextualization(props.activeViewParams.contextualizationId);
        });
      } else {
        this.context.scrollToTop(0, false, false);
      }

      setTimeout(() => {
        const {
          scrollHeight
        } = this.context;
        let elements = document.querySelector('.main-contents-wrapper .rendered-content');
        elements = elements && elements.childNodes;
        const shadows = [];

        if (elements) {
          elements.forEach(element => {
            const {
              height
            } = element.getBoundingClientRect();
            shadows.push({
              y: element.offsetTop / scrollHeight,
              h: height / scrollHeight,
              html: element.innerHTML,
              element
            });
          });
          this.setState({
            shadows
          });

          _reactTooltip.default.rebuild();
        }
      });
      this.setState({
        gui: {
          openedContextualizationId: undefined
        }
      });
    });

    _defineProperty(this, "onNoteContentPointerClick", noteId => {
      this.context.scrollToElementId(noteId);
    });

    _defineProperty(this, "onNotePointerClick", noteId => {
      this.context.scrollToElementId(`note-content-pointer-${noteId}`);
    });

    _defineProperty(this, "closeAsideContextualization", () => {
      if (this.context.asideVisible) {
        this.context.toggleAsideVisible();
      }

      if (this.state.gui.openedContextualizationId) {
        this.setState({
          gui: _objectSpread({}, this.state.gui, {
            openedContextualizationId: undefined
          })
        });
      }
    });

    _defineProperty(this, "openAsideContextualization", assetId => {
      if (!this.context.asideVisible) {
        this.context.toggleAsideVisible();
      }

      this.setState({
        gui: _objectSpread({}, this.state.gui, {
          openedContextualizationId: assetId
        })
      });
    });

    _defineProperty(this, "render", () => {
      const {
        closeAsideContextualization,
        state: {
          gui: {
            openedContextualizationId
          },
          shadows
        },
        props: {
          production,
          edition = {},
          previousSection,
          nextSection,
          activeViewClass,
          activeViewParams = {},
          options = {}
        },
        context: {
          // dimensions,
          translate = {},
          scrollRatio,
          scrollTopRatio,
          scrollToElement
        },
        onNotePointerClick
      } = this;

      if (activeViewClass !== 'sections') {
        return null;
      }

      const {
        data: editionData = {}
      } = edition;
      const {
        publicationTitle = ''
      } = editionData;
      const displayedTitle = publicationTitle.length ? publicationTitle : production.metadata.title;
      const section = production.sections[activeViewParams.sectionId];

      if (!section) {
        return;
      }

      const contents = section.contents;
      const sectionAuthors = section.metadata.authors;
      const notesPosition = options.notesPosition;
      const sectionAsCSLRecord = (0, _utils.convertSectionToCslRecord)(section, production, edition);
      return _react.default.createElement("section", {
        className: `main-contents-container section-player has-notes-position-${notesPosition}`
      }, _react.default.createElement(_SectionHead.default, {
        production: production,
        section: section,
        edition: edition,
        withHelmet: true
      }), _react.default.createElement(_peritextUtils.StructuredCOinS, {
        cslRecord: sectionAsCSLRecord
      }), _react.default.createElement("div", {
        className: 'main-column'
      }, _react.default.createElement("h1", {
        className: 'view-title section-title'
      }, section.metadata.title || translate('untitled section') || 'Section sans titre'), section.metadata.subtitle && _react.default.createElement("h2", {
        className: 'subtitle'
      }, section.metadata.subtitle), sectionAuthors.length > 0 && _react.default.createElement("h2", {
        className: 'authors'
      }, sectionAuthors && sectionAuthors.length > 0 && sectionAuthors.map((author, index) => _react.default.createElement("span", {
        key: index
      }, author.given, " ", author.family)).reduce((prev, curr) => [prev, ', ', curr])), _react.default.createElement("div", {
        className: 'main-contents-wrapper'
      }, _react.default.createElement(_Renderer.default, {
        raw: contents
      }))), Object.keys(section.notes).length > 0 ? _react.default.createElement(_NotesContainer.default, {
        pointers: this.noteContentPointers,
        notes: section.notes,
        notesOrder: section.notesOrder,
        notesPosition: notesPosition,
        title: translate('Notes'),
        id: 'notes-container',
        onNotePointerClick: onNotePointerClick
      }) : null, _react.default.createElement("footer", {
        className: 'navigation-footer'
      }, _react.default.createElement("ul", null, previousSection && _react.default.createElement("li", {
        className: 'prev'
      }, _react.default.createElement(_LinkProvider.default, {
        to: {
          routeClass: 'sections',
          viewId: previousSection.viewId,
          routeParams: {
            sectionId: previousSection.routeParams.sectionId
          }
        }
      }, _react.default.createElement("span", {
        className: 'navigation-item'
      }, _react.default.createElement("span", {
        className: 'navigation-item-arrow'
      }, "\u2190"), _react.default.createElement("span", {
        className: 'navigation-item-text'
      }, (0, _peritextUtils.abbrevString)(production.sections[previousSection.routeParams.sectionId].metadata.title, 40))))), _react.default.createElement("li", null, _react.default.createElement("i", null, (0, _peritextUtils.abbrevString)(displayedTitle, 30), " - ", (0, _peritextUtils.abbrevString)(section.metadata.title, 40))), nextSection && _react.default.createElement("li", {
        className: 'next'
      }, _react.default.createElement(_LinkProvider.default, {
        to: {
          routeClass: 'sections',
          viewId: nextSection.viewId,
          routeParams: {
            sectionId: nextSection.routeParams.sectionId
          }
        }
      }, _react.default.createElement("span", {
        className: 'navigation-item'
      }, _react.default.createElement("span", {
        className: 'navigation-item-text'
      }, (0, _peritextUtils.abbrevString)(production.sections[nextSection.routeParams.sectionId].metadata.title, 40)), _react.default.createElement("span", {
        className: 'navigation-item-arrow'
      }, "\u2192")))))), openedContextualizationId ? _react.default.createElement(_Aside.default, {
        isActive: openedContextualizationId !== undefined,
        title: openedContextualizationId && translate('More informations'),
        onClose: closeAsideContextualization
      }, _react.default.createElement(_RelatedContexts.default, {
        production: production,
        edition: edition,
        assetId: openedContextualizationId,
        onDismiss: closeAsideContextualization
      })) : _react.default.createElement(_Railway.default, {
        scrollRatio: scrollRatio,
        scrollTopRatio: scrollTopRatio,
        scrollToElement: scrollToElement,
        shadows: shadows
      }));
    });

    this.state = {
      gui: {
        openedContextualizationId: undefined
      }
    };
  }

}

_defineProperty(Section, "contextTypes", {
  scrollToTop: _propTypes.default.func,
  dimensions: _propTypes.default.object
});

Section.childContextTypes = {
  openAsideContextualization: _propTypes.default.func,
  openedContextualizationId: _propTypes.default.string,
  notes: _propTypes.default.object,
  onNoteContentPointerClick: _propTypes.default.func
};
Section.contextTypes = {
  dimensions: _propTypes.default.object,
  production: _propTypes.default.object,
  scrollTopRatio: _propTypes.default.number,
  scrollTopAbs: _propTypes.default.number,
  scrollRatio: _propTypes.default.number,
  scrollHeight: _propTypes.default.number,
  scrollToTop: _propTypes.default.func,
  scrollToElementId: _propTypes.default.func,
  contextualizers: _propTypes.default.object,
  translate: _propTypes.default.func,
  citations: _propTypes.default.object,
  scrollToContextualization: _propTypes.default.func,
  scrollToElement: _propTypes.default.func,
  toggleAsideVisible: _propTypes.default.func,
  asideVisible: _propTypes.default.bool
};
var _default = Section;
exports.default = _default;