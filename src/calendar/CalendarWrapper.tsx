import { useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import type { CSSProperties } from "react";
import FullCalendar from "@fullcalendar/react";
import type { CalendarApi, EventClickArg, DateSelectArg, EventInput, CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

export interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  color?: string;
  textColor?: string;
  extendedProps?: Record<string, unknown>;
}

export interface CalendarWrapperProps extends Omit<CalendarOptions, "plugins" | "events"> {
  events?: CalendarEvent[];
  height?: number | string;
  style?: CSSProperties;
  className?: string;
  onEventClick?: (event: CalendarEvent, clickInfo: EventClickArg) => void;
  onDateSelect?: (selectInfo: DateSelectArg) => void;
  onCalendarApiReady?: (api: CalendarApi) => void;
}

export interface CalendarWrapperRef {
  getApi: () => CalendarApi | undefined;
}

function CalendarWrapperInner(
  {
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
  }: CalendarWrapperProps,
  ref: React.ForwardedRef<CalendarWrapperRef>
) {
  const calendarRef = useRef<FullCalendar>(null);

  useImperativeHandle(ref, () => ({
    getApi: () => calendarRef.current?.getApi(),
  }));

  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      const event: CalendarEvent = {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start ?? "",
        end: clickInfo.event.end ?? undefined,
        allDay: clickInfo.event.allDay,
        color: clickInfo.event.backgroundColor,
        textColor: clickInfo.event.textColor,
        extendedProps: clickInfo.event.extendedProps as Record<string, unknown>,
      };
      onEventClick?.(event, clickInfo);
    },
    [onEventClick]
  );

  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
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
    right: "dayGridMonth,dayGridWeek,dayGridDay",
  };

  return (
    <div className={className} style={style}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView={initialView}
        events={events}
        headerToolbar={defaultHeaderToolbar}
        locale={locale}
        height={height}
        eventClick={onEventClick ? handleEventClick : undefined}
        select={onDateSelect ? handleDateSelect : undefined}
        selectable={!!onDateSelect}
        datesSet={handleDatesSet}
        {...rest}
      />
    </div>
  );
}

export const CalendarWrapper = forwardRef(CalendarWrapperInner);
