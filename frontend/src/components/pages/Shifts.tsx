import React, { useState, useEffect, useContext } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import ShiftCard from "../common/ShiftCard";
import { ServiceRequest } from "../../types/ServiceRequestTypes";
import ServiceRequestAPIClient from "../../APIClients/ServiceRequestAPIClient";
import CreateShift from "./CreateShift/CreateShift";
import AuthContext from "../../contexts/AuthContext";

type DateShifts = {
  date: string;
  shifts: ServiceRequest[];
};

const Shifts = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

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
      console.log(date, today);
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
      try {
        const shifts = await ServiceRequestAPIClient.get();

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the start of the day

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day to get yesterday

        // Filter shifts based on the role
        const filteredShifts = shifts.filter((shift) => {
          const shiftDate = new Date(shift.shiftTime!);

          if (shiftDate < yesterday) {
            return false; // Exclude shifts before yesterday
          }

          if (authenticatedUser?.role !== "ADMIN") {
            // Show only the user's shifts if not an admin
            return shift.assigneeIds?.includes(authenticatedUser?.id ?? "");
          }

          return true; // Admins see all future shifts
        });

        const upcomingShifts = filteredShifts
          .sort(
            (a, b) =>
              new Date(a.shiftTime!).getTime() -
              new Date(b.shiftTime!).getTime(),
          )
          .slice(0, 15);

        setShiftsByDate(groupByDate(upcomingShifts));
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
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
        {authenticatedUser?.role === "ADMIN" && (
          <Box mb="30px">
            <CreateShift />
          </Box>
        )}
        <Heading as="h1" size="lg" mb="30px">
          {authenticatedUser?.role === "ADMIN"
            ? "Upcoming Shifts"
            : "Your Shifts"}
        </Heading>
        {shiftsByDate && shiftsByDate.length > 0 ? (
          shiftsByDate.map((dateShifts: DateShifts, index: number) => {
            return (
              <Box key={`date_${index}`} mb="20px">
                <Text fontSize="lg" fontWeight="semibold" mb="10px">
                  {dateShifts.date === "Today" && "Today"}
                  {dateShifts.date === "Tomorrow" && "Tomorrow"}
                  {dateShifts.date !== "Today" &&
                    dateShifts.date !== "Tomorrow" &&
                    dateShifts.date.substring(
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
