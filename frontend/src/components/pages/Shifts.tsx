import React, { useState, useEffect } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import ShiftCard from "../common/ShiftCard";
import { ServiceRequest } from "../../types/ServiceRequestTypes";
import ServiceRequestAPIClient from "../../APIClients/ServiceRequestAPIClient";

type DateShifts = {
  date: string;
  shifts: ServiceRequest[];
};

const Shifts = (): React.ReactElement => {
  const [shiftsByDate, setShiftsByDate] = useState<DateShifts[]>([]);
  const YEAR_SIZE = 6;

  const groupByDate = (shifts: ServiceRequest[]): DateShifts[] => {
    const groupedShifts: DateShifts[] = [];
    if (!shifts) return groupedShifts;
    const today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    );
    const tomorrow = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1,
    );

    shifts.forEach((shift: ServiceRequest) => {
      if (!shift.shiftTime || !shift.shiftEndTime) return;
      const shiftTime = new Date(shift.shiftTime);
      const date = new Date(
        shiftTime.getFullYear(),
        shiftTime.getMonth(),
        shiftTime.getDate(),
      );

      let dateStr = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (date.getTime() === today.getTime()) {
        dateStr = "Today";
      }
      if (date.getTime() === tomorrow.getTime()) {
        dateStr = "Tomorrow";
      }

      const dateShifts = groupedShifts.find(
        (dateShift) => dateShift.date === dateStr,
      );

      if (dateShifts) {
        dateShifts.shifts.push(shift);
      } else {
        groupedShifts.push({ date: dateStr, shifts: [shift] });
      }
    });
    return groupedShifts;
  };

  useEffect(() => {
    const fetchShifts = async () => {
      const data = await ServiceRequestAPIClient.get();
      setShiftsByDate(groupByDate(data));
    };
    fetchShifts();
  }, []);

  return (
    <Box height="100vh" position="relative">
      <Box
        p="10"
        width="400px"
        borderRight="0.5px"
        borderRightStyle="solid"
        borderRightColor="#0B0B0B"
        overflowY="scroll"
        height="100%"
      >
        <Heading as="h1" size="lg" mb="30px">
          Your Shifts
        </Heading>
        {shiftsByDate && shiftsByDate.length > 0 ? (
          shiftsByDate.map((dateShifts: DateShifts, index: number) => {
            return (
              <Box key={`date_${index}`} mb="20px">
                <Text fontSize="lg" fontWeight="semibold" mb="10px">
                  {dateShifts.date.substring(
                    0,
                    dateShifts.date.length - YEAR_SIZE,
                  )}
                </Text>
                {dateShifts.shifts.map((shift: ServiceRequest, idx: number) => {
                  return <ShiftCard key={`shift_${idx}`} shift={shift} />;
                })}
              </Box>
            );
          })
        ) : (
          <Text fontSize="lg">No shifts found</Text>
        )}
      </Box>
    </Box>
  );
};

export default Shifts;
