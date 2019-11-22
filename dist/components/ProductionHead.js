"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactHelmet = _interopRequireDefault(require("react-helmet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PlainHead = ({
  children
}) => _react.default.createElement("head", {
  profile: 'http://dublincore.org/documents/2008/08/04/dc-html/'
}, children);

const ProductionHead = ({
  production,
  edition = {},
  pageName,
  withHelmet = false
}) => {
  /**
   * @todo check https://scholar.google.com/intl/en/scholar/inclusion.html#indexing
   */
  const title = `${edition.data.publicationTitle && edition.data.publicationTitle.length ? edition.data.publicationTitle : production.metadata.title}${pageName ? ` - ${pageName}` : ''}`,
        authors = production.metadata.authors || [],
        tags = production.metadata.tags || [],
        description = production.metadata.description,
        url = '';
  const authorsStr = authors.map(a => `${a.given} ${a.family}`).join(', ');
  const Container = withHelmet ? _reactHelmet.default : PlainHead;
  return _react.default.createElement(Container, null, _react.default.createElement("meta", {
    charset: 'UTF-8'
  }), _react.default.createElement("title", null, title), _react.default.createElement("meta", {
    name: 'generator',
    content: 'peritext'
  }), _react.default.createElement("link", {
    rel: 'schema.DC',
    href: 'http://purl.org/dc/elements/1.1/'
  }), _react.default.createElement("meta", {
    name: 'DC.Title',
    lang: 'fr',
    content: title
  }), authors.map((author, authorIndex) => _react.default.createElement("meta", {
    key: `${author.family}, ${author.given}-${authorIndex}`,
    name: 'DC.creator',
    content: `${author.family}, ${author.given}`
  })), _react.default.createElement("meta", {
    name: 'DC.issued',
    lang: 'fr',
    content: edition.metadata.lastUpdateAt && new Date(edition.metadata.lastUpdateAt).toISOString()
  }), _react.default.createElement("meta", {
    name: 'DC.Date.created',
    schema: 'W3CDTF',
    content: new Date().toISOString()
  }), _react.default.createElement("meta", {
    name: 'author',
    content: authorsStr
  }), _react.default.createElement("meta", {
    name: 'keywords',
    content: tags.join(',')
  }), _react.default.createElement("meta", {
    name: 'description',
    content: description
  }), _react.default.createElement("meta", {
    name: 'viewport',
    content: 'user-scalable=no,width=device-width'
  }), _react.default.createElement("meta", {
    name: 'twitter:card',
    value: 'summary'
  }), _react.default.createElement("meta", {
    name: 'twitter:site',
    content: url
  }), _react.default.createElement("meta", {
    name: 'twitter:title',
    content: title
  }), _react.default.createElement("meta", {
    name: 'twitter:description',
    content: description
  }), _react.default.createElement("meta", {
    itemProp: 'name',
    content: title
  }), _react.default.createElement("meta", {
    itemProp: 'description',
    content: description
  }), _react.default.createElement("meta", {
    property: 'og:title',
    content: title
  }), _react.default.createElement("meta", {
    property: 'og:type',
    content: 'website'
  }), _react.default.createElement("meta", {
    property: 'og:url',
    content: url
  }), _react.default.createElement("meta", {
    property: 'og:description',
    content: description
  }));
};

var _default = ProductionHead;
exports.default = _default;