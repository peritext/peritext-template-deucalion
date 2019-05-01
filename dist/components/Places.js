"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _groupBy = _interopRequireDefault(require("lodash/groupBy"));

var _pigeonMaps = _interopRequireDefault(require("pigeon-maps"));

var _pigeonOverlay = _interopRequireDefault(require("pigeon-overlay"));

var _d3Array = require("d3-array");

var _d3Scale = require("d3-scale");

var _Aside = _interopRequireDefault(require("./Aside"));

var _RelatedContexts = _interopRequireDefault(require("./RelatedContexts"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// const MIN_LATITUDE =  -90;
const MAX_LATITUDE = 90; // const MIN_LONGITUDE =  -180;

const MAX_LONGITUDE = 180;

const LocalizationMarker = ({
  items = [],
  onClick,
  nbMentions,
  markerScale
}) => {
  const color = 'white';
  return _react.default.createElement("div", {
    onClick: onClick,
    className: 'localization-marker'
  }, _react.default.createElement("span", {
    style: {
      cursor: 'pointer',
      color,
      width: `${markerScale(nbMentions)}px`,
      height: `${markerScale(nbMentions)}px`,
      borderRadius: '50%',
      background: 'red',
      border: `1px ${color} solid`,
      padding: '1em',
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      top: '-15px',
      left: '-15px'
    }
  }, nbMentions), _react.default.createElement("div", {
    style: {
      position: 'absolute',
      left: 5,
      top: -15,
      width: 50
    }
  }, location.adress && _react.default.createElement("h3", {
    className: 'localization-adress'
  }, location.adress), _react.default.createElement("ul", {
    className: 'localization-entries-list'
  }, items.map((item, itemIndex) => _react.default.createElement("li", {
    className: 'localization-entry',
    key: itemIndex
  }, item.resource.data.name)))));
};

class Places extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "openPlace", id => {
      if (!this.context.asideVisible) {
        this.context.toggleAsideVisible();
      }

      this.context.toggleAsideVisible();
      this.setState({
        openPlaceId: id
      });
    });

    _defineProperty(this, "toggleOpenedPlace", id => {
      this.setState({
        openPlaceId: this.state.openPlaceId ? undefined : id
      });
    });

    _defineProperty(this, "render", () => {
      const {
        props: {
          production,
          edition,
          options = {},
          title
        },
        state: {
          openPlaceId
        },
        context: {
          translate
        },
        toggleOpenedPlace,
        openPlace
      } = this;
      const {
        mapStyle = 'toner'
      } = options;
      const items = (0, _utils.buildGlossary)({
        options: _objectSpread({}, options, {
          glossaryTypes: ['place']
        }),
        production,
        edition
      }).filter(item => item.resource.data.location && item.resource.data.location.latitude);
      const placesMap = (0, _groupBy.default)(items, item => `${item.resource.data.location.latitude}-${item.resource.data.location.longitude}`);
      const places = Object.keys(placesMap).map(loc => ({
        location: placesMap[loc][0].resource.data.location,
        items: placesMap[loc],
        nbMentions: placesMap[loc].reduce((sum, item) => sum + item.mentions.length, 0),
        id: loc
      }));
      const mentionsExtent = (0, _d3Array.extent)(places, d => d.nbMentions);
      const latitudeExtent = (0, _d3Array.extent)(places, d => d.location.latitude);
      const longitudeExtent = (0, _d3Array.extent)(places, d => d.location.longitude);
      const latMean = (0, _d3Array.mean)(places, d => d.location.latitude);
      const lngMean = (0, _d3Array.mean)(places, d => d.location.longitude);
      const area = (latitudeExtent[1] - latitudeExtent[0]) * (longitudeExtent[1] - longitudeExtent[0]);
      const zoomScale = (0, _d3Scale.scaleLinear)().domain([0, MAX_LATITUDE * 2 * (MAX_LONGITUDE * 2)]).range([1, 12]);
      const markerScale = (0, _d3Scale.scaleLinear)().domain(mentionsExtent).range([1, 5]);
      const zoom = area > 0 ? zoomScale(area) : 6;
      let tileProvider;

      switch (mapStyle) {
        case 'nolabel':
          tileProvider = (x, y, z) => `https://tiles.wmflabs.org/osm-no-labels/${z}/${x}/${y}.png`;

          break;

        case 'shading':
          tileProvider = (x, y, z) => `http://c.tiles.wmflabs.org/hillshading/${z}/${x}/${y}.png`;

          break;

        case 'watercolor':
          tileProvider = (x, y, z) => `http://c.tile.stamen.com/watercolor/${z}/${x}/${y}.png`;

          break;

        case 'toner':
          tileProvider = (x, y, z) => `http://a.tile.stamen.com/toner/${z}/${x}/${y}.png`;

          break;

        case 'openstreetmap':
        default:
          tileProvider = (x, y, z) => ` https://a.tile.openstreetmap.org/${z}/${x}/${y}.png `;

          break;
      }

      const openedPlace = openPlaceId && places.find(p => p.id === openPlaceId);
      return _react.default.createElement("div", null, _react.default.createElement("h1", null, title), _react.default.createElement("div", {
        className: 'places-container'
      }, _react.default.createElement(_pigeonMaps.default, {
        center: [latMean, lngMean],
        defaultZoom: zoom,
        provider: tileProvider
      }, places.map(place => {
        const onClick = () => {
          openPlace(place.id);
        };

        return _react.default.createElement(_pigeonOverlay.default, {
          key: place.id,
          anchor: [place.location.latitude, place.location.longitude]
        }, _react.default.createElement(LocalizationMarker, {
          onClick: onClick,
          nbMentions: place.nbMentions,
          markerScale: markerScale,
          items: place.items,
          location: place.location
        }));
      }))), _react.default.createElement(_Aside.default, {
        isActive: openPlaceId !== undefined,
        title: translate('Mentions about this place'),
        onClose: toggleOpenedPlace
      }, openedPlace && _react.default.createElement("h5", {
        className: 'location-details'
      }, _react.default.createElement("span", null, "\uD83C\uDF10"), _react.default.createElement("em", null, openedPlace.location.address, " (", openedPlace.location.latitude, ", ", openedPlace.location.longitude, ")")), _react.default.createElement("div", {
        className: 'glossaries-related-to-place-list'
      }, openPlaceId && placesMap[openPlaceId].map((item, itemIndex) => {
        return _react.default.createElement(_RelatedContexts.default, {
          production: production,
          key: itemIndex,
          edition: edition,
          resourceId: item.resource.id
        });
      }))));
    });

    this.state = {
      openPlaceId: undefined
    };
  }

}

exports.default = Places;

_defineProperty(Places, "contextTypes", {
  asideVisible: _propTypes.default.bool,
  toggleAsideVisible: _propTypes.default.func,
  translate: _propTypes.default.func
});