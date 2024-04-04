import "./styles.css";
import React, { useCallback, useMemo, useState } from "react";
import moment from "moment";
import { Text, Box, Flex, Icon, IconButton, Select } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Views, DateRange } from "react-big-calendar";

import Calendar from "../Calendar";
import events from "./eventSeed";

type Keys = keyof typeof Views;

export default function CustomizedCalendar() {
  const [selectedRequestType, setSelectedRequestType] = useState('');
  const [view, setView] = useState<(typeof Views)[Keys]>(Views.MONTH);
  const [date, setDate] = useState<Date>(moment(new Date()).toDate());

  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);
  const onView = useCallback((newView: (typeof Views)[Keys]) => setView(newView), [setView]);

  const onDrillDown = useCallback(
    (newDate: Date) => {
      setDate(newDate);
      setView(Views.WEEK);
    },
    [setDate, setView]
  );

  const onPrevClick = useCallback(() => {
    if (view === Views.WEEK) {
      setDate(moment(date).subtract(1, "w").toDate());
    } else {
      setDate(moment(date).subtract(1, "M").toDate());
    }
  }, [view, date]);

  const onNextClick = useCallback(() => {
    if (view === Views.WEEK) {
      setDate(moment(date).add(1, "w").toDate());
    } else {
      setDate(moment(date).add(1, "M").toDate());
    }
  }, [view, date]);

  const onSelectRequestTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.currentTarget.value;
    setSelectedRequestType(selected);
  }, [selectedRequestType]);

  const onSelectViewChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.currentTarget.value;
    switch (selected.toUpperCase()) {
      case "WEEK":
        setView(Views.WEEK);
        break;
      default:
        setView(Views.MONTH);
    }
  }, [view]);

  const dateText = useMemo(() => {
    return moment(date).format("MMMM, YYYY");
  }, [date]);

  const formats = useMemo(() => ({
    dateFormat: 'D',

    timeGutterFormat: 'h a',

    eventTimeRangeFormat: (range: DateRange, culture: any, localizer: any) =>
      `${localizer.format(range.start, 'h:mma', culture)} - ${localizer.format(range.end, 'h:mma', culture)}`,

    dayFormat: (dateParam: Date, culture: any, localizer: any) =>
      localizer.format(dateParam, 'ddd', culture).substring(0, 3).toUpperCase()
      + localizer.format(dateParam, ' D', culture)
  }), []);

  const eventPropGetter = useCallback(
    (event: any, _start: Date, _end: Date, _isSelected: boolean) => {
      switch (event.resource.requestType) {
        case "kitchen":
          return {
            style: {
              backgroundColor: '#FAE7E7', // pale red
              color: "#D10000",
            },
          };
        case "site":
          return {
            style: {
              backgroundColor: '#E1F4E6', // pale green
              color: "#00701F",
            },
          };
        default:
          return {
            style: {
              backgroundColor: '#E8E8E8', // pale gray
              color: "#A0A0A0",
            },
          };
      }
    }
    ,
    []
  );

  return <Flex height="100%" direction="column" width="100%" gap={2} p={2}>
    <Flex ml={view === Views.WEEK ? "50px" : "0"} mb={3} mt={2} justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center" gap={3} pt={2} pb={2}>
        <Text fontSize="xl" fontWeight="bold">{dateText}</Text>
        <Box>
          <IconButton
            aria-label="Back"
            size="sm"
            icon={<Icon as={FaChevronLeft} />}
            variant='ghost'
            onClick={onPrevClick}
          />
          <IconButton
            aria-label="Next"
            size="sm"
            icon={<Icon as={FaChevronRight} />}
            variant='ghost'
            onClick={onNextClick}
          />
        </Box>
      </Box>
      <Box display="flex" flexGrow={0.1} gap={3}>
        <Select
          placeholder="Filter by"
          onChange={onSelectRequestTypeChange}
          value={selectedRequestType}
          size='sm'
          borderRadius={20}
          fontWeight="600"
        >
          <option value='kitchen'>Kitchen</option>
          <option value='site'>Site</option>
        </Select>
        <Select
          onChange={onSelectViewChange}
          value={view}
          size='sm'
          borderRadius={20}
          fontWeight="600"
        >
          <option value='month'>Month</option>
          <option value='week'>Week</option>
        </Select>
      </Box>
    </Flex>
    <Box
      flex={1}
      width="100%"
      overflow="auto"
      position="relative"
    >
      <Calendar
        events={selectedRequestType === '' ? events : events.filter((event) => event.resource.requestType === selectedRequestType)}
        eventPropGetter={eventPropGetter}
        defaultView={Views.MONTH}
        toolbar={false}
        date={date}
        view={view}
        formats={formats}
        onDrillDown={onDrillDown}
        onNavigate={onNavigate}
        onView={onView}
      />
    </Box>
  </Flex >;
}
