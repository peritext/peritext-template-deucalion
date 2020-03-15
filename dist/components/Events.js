"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _groupBy = _interopRequireDefault(require("lodash/groupBy"));

var _RelatedContexts = _interopRequireDefault(require("./RelatedContexts"));

var _Aside = _interopRequireDefault(require("./Aside"));

var _peritextUtils = require("peritext-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const buildDateLabel = ({
  year,
  month,
  day
}) => {
  let output = year;

  if (day) {
    output = `${day}/${month}/${year}`;
  } else if (month) {
    output = `${month}/${year}`;
  }

  return output;
};

class Events extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "openEvent", id => {
      if (!this.context.asideVisible) {
        this.context.toggleAsideVisible();
      }

      this.setState({
        openEventId: id
      });
    });

    _defineProperty(this, "toggleOpenedEvent", id => {
      this.context.toggleAsideVisible();
      this.setState({
        openEventId: this.state.openEventId ? undefined : id
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
          openEventId
        },
        context: {
          translate
        },
        toggleOpenedEvent,
        openEvent
      } = this;
      const items = (0, _peritextUtils.buildGlossary)({
        options: _objectSpread({}, options, {
          glossaryTypes: ['event']
        }),
        production,
        edition
      }).filter(item => item.resource.data.dates && item.resource.data.dates.start);
      const eventsMap = (0, _groupBy.default)(items, item => `${item.resource.data.dates.start}-${item.resource.data.dates.end}`);
      const events = Object.keys(eventsMap).map(datum => ({
        dates: eventsMap[datum][0].resource.data.dates,
        items: eventsMap[datum],
        id: datum
      })).sort((a, b) => {
        if (a.dates.start > b.dates.start) {
          return 1;
        }

        return -1;
      });
      const openedEvent = openEventId && events.find(p => p.id === openEventId);
      return _react.default.createElement("div", {
        className: 'main-contents-container events-player'
      }, _react.default.createElement("div", {
        className: 'main-column'
      }, _react.default.createElement("h1", {
        className: 'view-title'
      }, title), _react.default.createElement("ul", {
        className: 'big-list-items-container'
      }, events.map((event, eventIndex) => {
        const displayStart = event.dates.startDateParts ? buildDateLabel(event.dates.startDateParts) : new Date(event.dates.start).toLocaleDateString();
        const displayEnd = event.dates.end && (event.dates.endDateParts ? buildDateLabel(event.dates.endDateParts) : new Date(event.dates.end).toLocaleDateString());
        const eventTitle = displayEnd ? `${displayStart} - ${displayEnd}` : displayStart;

        const handleClick = () => {
          openEvent(event.id);
        };

        return _react.default.createElement("li", {
          className: 'big-list-item',
          key: eventIndex
        }, _react.default.createElement("div", {
          className: 'big-list-item-content'
        }, _react.default.createElement("h3", null, eventTitle)), _react.default.createElement("div", {
          className: 'big-list-item-actions'
        }, _react.default.createElement("button", {
          onClick: handleClick
        }, translate('See mentions'))));
      }))), _react.default.createElement(_Aside.default, {
        isActive: openEventId !== undefined,
        title: translate('Mentions about an event'),
        onClose: toggleOpenedEvent
      }, openEventId && _react.default.createElement("div", null, openedEvent && _react.default.createElement("h5", {
        className: 'event-details'
      }, _react.default.createElement("span", null, "\u25C8"), _react.default.createElement("em", null, openedEvent.dates.startDateParts ? buildDateLabel(openedEvent.dates.startDateParts) : new Date(openedEvent.dates.start).toLocaleDateString(), openedEvent.dates.end && ` - ${openedEvent.dates.endDateParts ? buildDateLabel(openedEvent.dates.endDateParts) : new Date(openedEvent.dates.end).toLocaleDateString()}`)), _react.default.createElement("div", {
        className: 'glossaries-related-to-event-list'
      }, eventsMap[openEventId].map((item, itemIndex) => {
        return _react.default.createElement(_RelatedContexts.default, {
          production: production,
          edition: edition,
          resourceId: item.resource.id,
          key: itemIndex
        });
      })))));
    });

    this.state = {
      openEventId: undefined
    };
  }

}

exports.default = Events;

_defineProperty(Events, "contextTypes", {
  translate: _propTypes.default.func,
  asideVisible: _propTypes.default.bool,
  toggleAsideVisible: _propTypes.default.func
});