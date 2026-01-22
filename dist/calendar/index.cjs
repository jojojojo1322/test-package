'use strict';

var react = require('react');
var FullCalendar = require('@fullcalendar/react');
var dayGridPlugin = require('@fullcalendar/daygrid');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var FullCalendar__default = /*#__PURE__*/_interopDefault(FullCalendar);
var dayGridPlugin__default = /*#__PURE__*/_interopDefault(dayGridPlugin);

// src/calendar/CalendarWrapper.tsx
function CalendarWrapperInner({
  events = [],
  height = "auto",
  style,
  className,
  onEventClick,
  onDateSelect,
  onCalendarApiReady,
  initialView = "dayGridMonth",
  headerToolbar,
  locale = "ko",
  ...rest
}, ref) {
  const calendarRef = react.useRef(null);
  react.useImperativeHandle(ref, () => ({
    getApi: () => calendarRef.current?.getApi()
  }));
  const handleEventClick = react.useCallback(
    (clickInfo) => {
      const event = {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start ?? "",
        end: clickInfo.event.end ?? void 0,
        allDay: clickInfo.event.allDay,
        color: clickInfo.event.backgroundColor,
        textColor: clickInfo.event.textColor,
        extendedProps: clickInfo.event.extendedProps
      };
      onEventClick?.(event, clickInfo);
    },
    [onEventClick]
  );
  const handleDateSelect = react.useCallback(
    (selectInfo) => {
      onDateSelect?.(selectInfo);
    },
    [onDateSelect]
  );
  const handleDatesSet = react.useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (api) {
      onCalendarApiReady?.(api);
    }
  }, [onCalendarApiReady]);
  const defaultHeaderToolbar = headerToolbar ?? {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,dayGridWeek,dayGridDay"
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className, style, children: /* @__PURE__ */ jsxRuntime.jsx(
    FullCalendar__default.default,
    {
      ref: calendarRef,
      plugins: [dayGridPlugin__default.default],
      initialView,
      events,
      headerToolbar: defaultHeaderToolbar,
      locale,
      height,
      eventClick: onEventClick ? handleEventClick : void 0,
      select: onDateSelect ? handleDateSelect : void 0,
      selectable: !!onDateSelect,
      datesSet: handleDatesSet,
      ...rest
    }
  ) });
}
var CalendarWrapper = react.forwardRef(CalendarWrapperInner);

exports.CalendarWrapper = CalendarWrapper;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map