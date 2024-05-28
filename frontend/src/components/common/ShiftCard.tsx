import React from "react";
import { Text, Box } from "@chakra-ui/react";
import { ServiceRequest } from "../../types/ServiceRequestTypes";

type ShiftCardProps = {
  shift: ServiceRequest;
};

const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  const { requestName, shiftTime, shiftEndTime, description } = shift;

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours %= 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")}${ampm}`;
  };

  return (
    <Box
      width="full"
      my="5"
      p="5"
      border="0.5px"
      borderStyle="solid"
      borderColor="#0B0B0B"
      borderRadius="lg"
    >
      <Text fontSize="xl" fontWeight="bold">
        {requestName}
      </Text>
      <Text fontSize="md" color="#969696">
        {formatTime(shiftTime)} - {formatTime(shiftEndTime)}
      </Text>
      <Text fontSize="md" mt="10px">
        {description}
      </Text>
    </Box>
  );
};

export default ShiftCard;
