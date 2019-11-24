"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertEditionToCslRecord = exports.convertSectionToCslRecord = exports.makeAssetTitle = void 0;

var _react = _interopRequireDefault(require("react"));

var _peritextUtils = require("peritext-utils");

var _reactCiteproc = require("react-citeproc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const makeAssetTitle = (resource, production, edition) => {
  const type = resource.metadata.type;

  switch (type) {
    case 'glossary':
      return resource.data.name ? resource.data.name : `${resource.data.firstName} ${resource.data.lastName}`;

    case 'bib':
      const item = (0, _peritextUtils.resourceToCslJSON)(resource)[0];
      const citation = (0, _reactCiteproc.makeBibliography)({
        [item.id]: item
      }, edition.data.citationStyle.data, edition.data.citationLocale.data, {
        select: [{
          field: 'id',
          value: resource.data.citations[0].id
        }]
      })[1];
      return _react.default.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: citation
        }
      });

    /* eslint react/no-danger : 0 */

    default:
      return resource.metadata.title;
  }
};

exports.makeAssetTitle = makeAssetTitle;

const convertSectionToCslRecord = (section, production, edition = {}) => {
  const {
    data: editionData = {}
  } = edition;
  const {
    publicationTitle,
    publicationDate,
    publicationAuthors = [],
    bibType: parentBibType = 'book'
  } = editionData;
  const title = publicationTitle || production.metadata.title;
  const globalAuthors = publicationAuthors.length ? publicationAuthors : production.metadata.authors || [];
  let sectionBibType;
  const record = {};
  record.id = section.id;
  record.title = section.metadata.title;
  let now;

  if (publicationDate) {
    now = new Date(publicationDate);
  } else {
    now = new Date();
  }

  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  record.issued = {
    'date-parts': [year, month, day]
  };
  const authors = section.metadata.authors && section.metadata.authors.length ? section.metadata.authors : globalAuthors;
  record.abstract = production.metadata.abstract;
  record.author = authors.map(a => ({
    given: a.given,
    family: a.family
  }));

  switch (parentBibType) {
    case 'article':
      sectionBibType = 'article';
      break;

    case 'book':
    case 'booklet':
    case 'inbook':
    case 'incollection':
      sectionBibType = 'chapter';
      record.booktitle = title;
      break;

    case 'mastersthesis':
    case 'phdthesis':
      sectionBibType = 'chapter';
      record.booktitle = title;
      break;

    case 'proceedings':
    case 'inproceedings':
      sectionBibType = 'paper-conference';
      record.booktitle = title;
      break;

    case 'techreport':
    case 'unpublished':
    case 'manual':
    case 'misc':
    default:
      sectionBibType = 'webpage';
      break;
  }

  record.type = sectionBibType;
  return record;
};

exports.convertSectionToCslRecord = convertSectionToCslRecord;

const convertEditionToCslRecord = (production, edition = {}) => {
  const {
    data: editionData = {}
  } = edition;
  const {
    publicationTitle,
    publicationDate,
    publicationAuthors = [],
    bibType = 'book'
  } = editionData;
  const title = publicationTitle || production.metadata.title;
  const globalAuthors = publicationAuthors.length ? publicationAuthors : production.metadata.authors || [];
  const record = {};
  record.id = production.id;
  record.title = title;
  record.abstract = production.metadata.abstract;
  let now;

  if (publicationDate) {
    now = new Date(publicationDate);
  } else {
    now = new Date();
  }

  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  record.issued = {
    'date-parts': [year, month, day]
  };
  record.author = globalAuthors.map(a => ({
    given: a.given,
    family: a.family
  }));

  switch (bibType) {
    case 'booklet':
    case 'incollection':
    case 'inbook':
    case 'proceedings':
      record.type = 'chapter';
      break;

    case 'mastersthesis':
    case 'phdthesis':
      record.type = 'thesis';
      break;

    case 'inproceedings':
      record.type = 'paper-conference';
      break;

    case 'techreport':
      record.type = 'report';
      break;

    case 'manual':
    case 'unpublished':
      record.type = 'manuscript';
      break;

    case 'misc':
      record.type = 'webpage';
      break;

    /*
     * case "article":
     * case "book":
     */

    default:
      record.type = bibType;
      break;
  }

  return record;
};

exports.convertEditionToCslRecord = convertEditionToCslRecord;