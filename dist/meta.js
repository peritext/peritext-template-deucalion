"use strict";

module.exports = {
  id: 'deucalion',
  type: 'peritext-template',
  name: 'Deucalion template',
  renderingTypes: ['screened'],
  generatorsTypes: ['multi-page-html', 'single-page-html'],
  summaryType: 'linear',
  options: {
    referencesScope: {
      type: 'string',
      enum: ['sections', 'edition'],
      default: 'edition'
    },
    allowAnnotation: {
      type: 'boolean',
      default: false
    }
  },
  defaultBibType: 'misc',
  defaultAdditionalHTML: '<link href="https://fonts.googleapis.com/css?family=Source+Serif+Pro:400,600,700" rel="stylesheet">',
  defaultPlan: {
    type: 'linear',
    summary: [{
      type: 'landing',
      data: {
        customReadingLinks: [],
        animatedBackground: 'none'
      }
    }, {
      type: 'sections',
      data: {
        customSummary: {
          active: false,
          summary: []
        },
        notesPosition: 'sidenotes'
      }
    }]
  },
  summaryBlockDataTypes: {
    landing: {
      type: 'object',
      unique: true,
      properties: {
        customTitle: {
          type: 'string'
        },
        customSubtitle: {
          type: 'string'
        },
        customPresentationText: {
          type: 'string',
          longString: true
        },
        customNextLinkTitle: {
          type: 'string'
        },
        customReadingLinks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              linkTitle: {
                type: 'string'
              },
              link: {
                type: 'string'
              }
            }
          }
        },
        animatedBackground: {
          type: 'string',
          description: 'animated background to use',
          enum: ['gradient', 'none']
        }
      },
      default: {
        customReadingLinks: []
      }
    },
    sections: {
      type: 'object',
      properties: {
        customSummary: {
          type: 'object',
          uiType: 'customSummary',
          properties: {
            active: {
              type: 'boolean'
            },
            summary: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  resourceId: {
                    type: 'string'
                  },
                  level: {
                    type: 'number'
                  }
                }
              }
            }
          }
        },
        notesPosition: {
          type: 'string',
          enum: ['footnotes', 'sidenotes']
        }
      },
      default: {
        customSummary: {
          active: false,
          summary: []
        },
        notesPosition: 'sidenotes'
      }
    },
    customPage: {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        },
        markdownContents: {
          type: 'string',
          longString: true
        },
        routeSlug: {
          type: 'string'
        },
        customCssId: {
          type: 'string',
          description: 'custom id for this page'
        }
      }
    },
    resourcesMap: {
      type: 'object',
      default: {
        showUncitedReferences: false,
        showAllResources: true
      },
      properties: {
        showAllResources: {
          type: 'boolean'
        },
        minimumCooccurrenceNumber: {
          type: 'number',
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        resourceTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['bib', 'image', 'table', 'video', 'embed', 'webpage']
          },
          uiType: 'select',
          description: 'which types of resources to show as references'
        },
        customTitle: {
          type: 'string'
        },
        showUncitedReferences: {
          type: 'boolean',
          description: 'whether to show references which are not cited in the contents of the edition'
        }
      }
    },
    references: {
      type: 'object',
      default: {
        showUncitedReferences: false,
        showMentions: false,
        resourceTypes: ['bib']
        /*
         * sortingKey: 'date',
         * sortingAscending: true
         */

      },
      properties: {
        resourceTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['bib', 'image', 'table', 'video', 'embed', 'webpage']
          },
          uiType: 'select',
          description: 'which types of resources to show as references'
        },
        customTitle: {
          type: 'string'
        },
        showUncitedReferences: {
          type: 'boolean',
          description: 'whether to show references which are not cited in the contents of the edition'
        },
        showMentions: {
          type: 'boolean',
          description: 'whether to show active mentions in the text for each reference'
        },
        sortingKey: {
          type: 'string',
          description: 'key to use for sorting references',
          enum: ['authors', 'title', 'date', 'mentions']
        },
        sortingAscending: {
          type: 'boolean',
          description: 'whether to sort references in ascending order'
        }
      }
    },
    glossary: {
      type: 'object',
      default: {
        showDescription: true,
        showMentions: true,
        showUncited: false,
        glossaryTypes: ['person', 'place', 'event', 'notion', 'other']
      },
      properties: {
        customTitle: {
          type: 'string'
        },
        showDescriptions: {
          type: 'boolean',
          description: 'whether to show elements descriptions in the glossary'
        },
        showMentions: {
          type: 'boolean',
          description: 'whether to show active mentions in the text for each glossary element'
        },
        glossaryTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['person', 'place', 'event', 'notion', 'other']
          },
          uiType: 'select',
          description: 'which types of glossary items to show'
        },
        showUncited: {
          type: 'boolean',
          description: 'whether to show uncited glossary items'
        }
      }
    },
    places: {
      type: 'object',
      default: {
        showUncited: true,
        mapStyle: 'openstreetmap'
      },
      properties: {
        customTitle: {
          type: 'string'
        },
        showUncited: {
          type: 'boolean',
          description: 'whether to show uncited glossary items'
        },
        mapStyle: {
          type: 'string',
          description: 'map renderer tiles style',
          enum: ['toner', 'watercolor', 'shading', 'openstreetmap', 'nolabel']
        }
      }
    },
    events: {
      type: 'object',
      default: {
        showUncited: true
      },
      properties: {
        customTitle: {
          type: 'string'
        },
        showUncited: {
          type: 'boolean',
          description: 'whether to show uncited glossary items'
        }
      }
    }
  }
};