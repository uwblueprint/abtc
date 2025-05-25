import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Text, Box, Badge, Flex } from "@chakra-ui/react";
import { ServiceRequest } from "../../types/ServiceRequestTypes";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { titleCase } from "../../utils/FormatUtils";

type ShiftCardProps = {
  shift: ServiceRequest;
};

const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  const history = useHistory();

  const {
    requestName,
    shiftTime,
    shiftEndTime,
    description,
    id,
    assigneeIds,
  } = shift;

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours %= 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")}${ampm}`;
  };

  const [volunteerNames, setVolunteerNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (assigneeIds) {
        const userDataArray = await Promise.all(
          assigneeIds.map(async (userId: any) => {
            const userData = await UserAPIClient.getUserById(userId);
            return `${titleCase(userData.firstName)} ${titleCase(
              userData.lastName,
            )}`;
          }),
        );
        setVolunteerNames(userDataArray);
      }
    };
    fetchData();
  }, []);

  return (
    <Box
      width="full"
      my="5"
      p="5"
      borderRadius="lg"
      backgroundColor="white"
      boxShadow="md"
      onClick={() => {
        history.push(`/dashboard?shiftId=${id}`);
      }}
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
      <Flex gap={2} mt={2}>
        {volunteerNames.length > 0 && (
          <Badge bg="#DACFFB" color="#230282">
            {volunteerNames[0]}
          </Badge>
        )}
        {volunteerNames.length > 1 && (
          <Badge bg="#DACFFB" color="#230282">
            +{volunteerNames.length - 1}
          </Badge>
        )}
      </Flex>
    </Box>
  );
};

export default ShiftCard;
