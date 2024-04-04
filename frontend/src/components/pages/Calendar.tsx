import 'react-big-calendar/lib/css/react-big-calendar.css';

import React from "react";
import moment from "moment";
// start from Monday as first day
import 'moment/locale/en-gb';

import { Calendar as BigCalendar, Views, CalendarProps, momentLocalizer } from "react-big-calendar";

const localizer = momentLocalizer(moment);

export default function Calendar({
    events,
    eventPropGetter,
    defaultView,
    formats,
    toolbar,
    date,
    onDrillDown,
    onNavigate,
    onView,
    view
}: Omit<CalendarProps, "localizer">) {
    return <BigCalendar
        views={[Views.WEEK, Views.MONTH]}
        events={events}
        eventPropGetter={eventPropGetter}
        defaultView={defaultView}
        min={new Date(0, 0, 0, 6, 0, 0)} // 6am
        max={new Date(0, 0, 0, 18, 0, 0)} // 6pm
        toolbar={toolbar}
        date={date}
        localizer={localizer}
        view={view}
        formats={formats}
        onDrillDown={onDrillDown}
        onNavigate={onNavigate}
        onView={onView}
    />;
}
