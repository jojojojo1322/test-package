import { forwardRef, useRef, useImperativeHandle, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { jsx } from 'react/jsx-runtime';

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
  const calendarRef = useRef(null);
  useImperativeHandle(ref, () => ({
    getApi: () => calendarRef.current?.getApi()
  }));
  const handleEventClick = useCallback(
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
  const handleDateSelect = useCallback(
    (selectInfo) => {
      onDateSelect?.(selectInfo);
    },
    [onDateSelect]
  );
  const handleDatesSet = useCallback(() => {
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
  return /* @__PURE__ */ jsx("div", { className, style, children: /* @__PURE__ */ jsx(
    FullCalendar,
    {
      ref: calendarRef,
      plugins: [dayGridPlugin],
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
var CalendarWrapper = forwardRef(CalendarWrapperInner);

export { CalendarWrapper };
//# sourceMappingURL=chunk-L623CQPT.js.map
//# sourceMappingURL=chunk-L623CQPT.js.map