import * as react from 'react';
import { CSSProperties } from 'react';
import { CalendarOptions, EventInput, EventClickArg, DateSelectArg, CalendarApi } from '@fullcalendar/core';
export { CalendarApi, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';

interface CalendarEvent extends EventInput {
    id: string;
    title: string;
    start: Date | string;
    end?: Date | string;
    allDay?: boolean;
    color?: string;
    textColor?: string;
    extendedProps?: Record<string, unknown>;
}
interface CalendarWrapperProps extends Omit<CalendarOptions, "plugins" | "events"> {
    events?: CalendarEvent[];
    height?: number | string;
    style?: CSSProperties;
    className?: string;
    onEventClick?: (event: CalendarEvent, clickInfo: EventClickArg) => void;
    onDateSelect?: (selectInfo: DateSelectArg) => void;
    onCalendarApiReady?: (api: CalendarApi) => void;
}
interface CalendarWrapperRef {
    getApi: () => CalendarApi | undefined;
}
declare const CalendarWrapper: react.ForwardRefExoticComponent<CalendarWrapperProps & react.RefAttributes<CalendarWrapperRef>>;

export { type CalendarEvent, CalendarWrapper, type CalendarWrapperProps, type CalendarWrapperRef };
