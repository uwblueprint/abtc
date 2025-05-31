import "./styles.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Text, Box, Flex, Icon, IconButton, Select } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Views, DateRange, Event } from "react-big-calendar";

import { useHistory } from "react-router-dom";
import Calendar from "../Calendar";
import ServiceRequestAPIClient from "../../../APIClients/ServiceRequestAPIClient";
import {
  ServiceRequest,
  ServiceRequestType,
} from "../../../types/ServiceRequestTypes";

type Keys = keyof typeof Views;

export default function CustomizedCalendar() {
  const history = useHistory();
  const [shifts, setShifts] = useState<Event[]>([]);
  const [selectedRequestType, setSelectedRequestType] = useState("");
  const [view, setView] = useState<typeof Views[Keys]>(Views.MONTH);
  const [date, setDate] = useState<Date>(moment(new Date()).toDate());

  useEffect(() => {
    const getAndTransformRequests = async () => {
      const serviceRequests: ServiceRequest[] = await ServiceRequestAPIClient.get();
      const events: any[] = [];
      serviceRequests.forEach((shift) => {
        if (!shift.shiftTime || !shift.shiftEndTime) return;
        events.push({
          id: shift.id,
          title: shift.requestName,
          start: new Date(shift.shiftTime),
          end: new Date(shift.shiftEndTime),
          resource: {
            requestType: shift.requestType,
          },
        });
      });
      setShifts(events);
    };

    getAndTransformRequests();
  }, []);

  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [
    setDate,
  ]);
  const onView = useCallback(
    (newView: typeof Views[Keys]) => setView(newView),
    [setView],
  );

  const onDrillDown = useCallback(
    (newDate: Date) => {
      setDate(newDate);
      setView(Views.WEEK);
    },
    [setDate, setView],
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

  const onSelectRequestTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selected = e.currentTarget.value;
      setSelectedRequestType(selected);
    },
    [selectedRequestType],
  );

  const onSelectViewChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selected = e.currentTarget.value;
      switch (selected.toUpperCase()) {
        case "WEEK":
          setView(Views.WEEK);
          break;
        default:
          setView(Views.MONTH);
      }
    },
    [view],
  );

  const dateText = useMemo(() => {
    return moment(date).format("MMMM, YYYY");
  }, [date]);

  const formats = useMemo(
    () => ({
      dateFormat: "D",

      timeGutterFormat: "h a",

      eventTimeRangeFormat: (range: DateRange, culture: any, localizer: any) =>
        `${localizer.format(
          range.start,
          "h:mma",
          culture,
        )} - ${localizer.format(range.end, "h:mma", culture)}`,

      dayFormat: (dateParam: Date, culture: any, localizer: any) =>
        localizer
          .format(dateParam, "ddd", culture)
          .substring(0, 3)
          .toUpperCase() + localizer.format(dateParam, " D", culture),
    }),
    [],
  );

  const eventPropGetter = useCallback(
    (event: any, _start: Date, _end: Date, _isSelected: boolean) => {
      switch (event.resource.requestType) {
        case ServiceRequestType.KITCHEN:
          return {
            style: {
              backgroundColor: "#3bb47a", 
              color: "white",
            },
          };
        case ServiceRequestType.SITE:
          return {
            style: {
              backgroundColor: "#4054b2",
              color: "white", 
            },
          };
        case ServiceRequestType.DELIVERY:
          return {
            style: {
              backgroundColor: "#f4be3b",
              color: "white",
            },
          };
        default:
          return {
            style: {
              backgroundColor: "#f4be3b", 
              color: "white",
            },
          };
      }
    },
    [],
  );
  console.log("shifts", shifts);
  return (
    <Flex height="100%" direction="column" width="100%" gap={2} p={2}>
      <Flex
        ml={view === Views.WEEK ? "50px" : "0"}
        mb={3}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center" gap={3} pb={2}>
          <Text fontSize="4xl" fontWeight="bold" color="#3b2f3d">
            {dateText}
          </Text>
          <Box>
            <IconButton
              aria-label="Back"
              size="sm"
              icon={<Icon as={FaChevronLeft} />}
              variant="ghost"
              color="#3b2f3d"
              onClick={onPrevClick}
            />
            <IconButton
              aria-label="Next"
              size="sm"
              icon={<Icon as={FaChevronRight} />}
              variant="ghost"
              color="#3b2f3d"
              onClick={onNextClick}
            />
          </Box>
        </Box>
        <Box display="flex" flexGrow={0.1} gap={3}>
          <Select
            placeholder="Filter by"
            color="#3b2f3d"
            onChange={onSelectRequestTypeChange}
            value={selectedRequestType}
            size="sm"
            borderRadius={20}
            fontWeight="600"
          >
            <option value="kitchen">Kitchen</option>
            <option value="site">Site</option>
            <option value="delivery">Delivery</option>
          </Select>
          <Select
            onChange={onSelectViewChange}
            color="#3b2f3d"
            value={view}
            size="sm"
            borderRadius={20}
            fontWeight="600"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
          </Select>
        </Box>
      </Flex>
      <Box flex={1} width="100%" overflow="auto" position="relative" backgroundColor="white" borderRadius="5px">
        <Calendar
          events={
            selectedRequestType === ""
              ? shifts
              : shifts.filter(
                  (shift) =>
                    shift.resource.requestType ===
                    selectedRequestType.toUpperCase(),
                )
          }
          eventPropGetter={eventPropGetter}
          defaultView={Views.MONTH}
          toolbar={false}
          date={date}
          view={view}
          formats={formats}
          onDrillDown={onDrillDown}
          onNavigate={onNavigate}
          onView={onView}
          // New Props for Time Layout
          step={30} // 30 minutes per slot
          timeslots={2} // 2 slots per hour
          defaultDate={new Date()} // Today's date
          onSelectEvent={(event: any) => {
            history.push(`/dashboard?shiftId=${event.id}`);
          }}
        />
      </Box>
    </Flex>
  );
}
