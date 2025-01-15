import React from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Divider,
  IconButton,
  Badge,
  Button,
} from "@chakra-ui/react";
import { FiCheck, FiX } from "react-icons/fi";

const NotificationPanel = ({
  isVisible,
  onClose,
  numUnchecked,
  setNumUnchecked,
}: {
  isVisible: boolean;
  onClose: () => void;
  numUnchecked: number;
  setNumUnchecked: (num: number) => void;
}) => {
  const notifications = [
    {
      notificationDescription: "Here is a notification description",
      notificationTitle: "Cancelled Shift",
      date: "2024-03",
      checked: false,
      id: 1,
    },
    {
      notificationDescription: "Here is a notification description",
      notificationTitle: "Cancelled Shift",
      date: "2024-03",
      checked: true,
      id: 2,
    },
    {
      notificationDescription: "Here is a notification description",
      notificationTitle: "Cancelled Shift",
      date: "2024-03",
      checked: false,
      id: 3,
    },
  ];

  if (!isVisible) {
    return null; // Don't render if the panel is not visible
  }

  return (
    <Box
      position="fixed"
      top="100px"
      right="25px"
      bg="white"
      boxShadow="md"
      borderRadius="lg"
      width="400px"
      maxHeight="500px"
      p={4}
      zIndex={1000}
    >
      {notifications.map((notification) => (
        <Box key={notification.id} mb={4}>
          <Flex alignItems="center">
            <Box flex="1">
              <Text as="span" fontWeight="bold">
                {notification.notificationTitle}
              </Text>{" "}
              <Text flexDirection="column">
                {notification.notificationDescription}
              </Text>
            </Box>

            {!notification.checked && (
              <Flex flexDirection="column" gap={1}>
                <Badge colorScheme="blue" ml={2}>
                  New
                </Badge>
                <Text fontSize="xs" color="gray.500">
                  {notification.date}
                </Text>
              </Flex>
            )}
          </Flex>
          <Divider mt={4} />
        </Box>
      ))}
    </Box>
  );
};

export default NotificationPanel;
