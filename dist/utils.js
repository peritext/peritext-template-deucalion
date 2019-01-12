"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildGlossary = void 0;

var _peritextUtils = require("peritext-utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const buildGlossary = ({
  production,
  edition,
  options
}) => {
  const {
    contextualizers,
    resources
  } = production;
  const {
    showUncited = false,
    glossaryTypes = ['person', 'place', 'event', 'notion', 'other']
  } = options;
  let items;
  const usedContextualizations = (0, _peritextUtils.getContextualizationsFromEdition)(production, edition);

  if (showUncited) {
    items = Object.keys(production.resources).filter(resourceId => production.resources[resourceId].metadata.type === 'glossary').map(resourceId => production.resources[resourceId]).map(resource => {
      return {
        resource,
        mentions: usedContextualizations.filter(c => c.contextualization.resourceId === resource.id)
      };
    });
  } else {
    items = usedContextualizations.filter(element => {
      const contextualization = element.contextualization;
      const contextualizerId = contextualization.contextualizerId;
      const contextualizer = contextualizers[contextualizerId];
      return contextualizer && contextualizer.type === 'glossary';
    }).map(element => {
      const contextualization = element.contextualization;
      return _objectSpread({}, contextualization, {
        contextualizer: contextualizers[contextualization.contextualizerId],
        resource: resources[contextualization.resourceId],
        contextContent: (0, _peritextUtils.buildContextContent)(production, contextualization.id),
        containerId: element.containerId
      });
    }).reduce((entries, contextualization) => {
      return _objectSpread({}, entries, {
        [contextualization.resourceId]: {
          resource: contextualization.resource,
          mentions: entries[contextualization.resourceId] ? entries[contextualization.resourceId].mentions.concat(contextualization) : [contextualization]
        }
      });
    }, {});
    items = Object.keys(items).map(resourceId => ({
      resource: items[resourceId].resource,
      mentions: items[resourceId].mentions
    }));
  }

  const glossaryMentions = items.filter(item => {
    return glossaryTypes.includes(item.resource.data.entryType);
  }).sort((a, b) => {
    if (a.resource.data.name.toLowerCase() > b.resource.data.name.toLowerCase()) {
      return 1;
    } else {
      return -1;
    }
  });
  return glossaryMentions;
};

exports.buildGlossary = buildGlossary;