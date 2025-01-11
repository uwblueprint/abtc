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
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const notifications = [
    {
      id: 1,
      avatar: "https://bit.ly/dan-abramov",
      name: "frankiesullivan",
      action: "followed you",
      time: "2 hours ago",
    },
    {
      id: 2,
      avatar: "https://bit.ly/prosper-baba",
      name: "eleanor_mac",
      action: "commented on your post",
      comment:
        "Love the background on this! Would love to learn how you created the mesh gradient effect.",
      time: "3 hours ago",
    },
    {
      id: 3,
      avatar: "https://bit.ly/code-beast",
      name: "eleanor_mac",
      action: "liked your post",
      time: "3 hours ago",
    },
    {
      id: 4,
      avatar: "https://bit.ly/ryan-florence",
      name: "ollie_diggs",
      action: "invited you to Sisyphus Dashboard",
      time: "4 hours ago",
      isInvitation: true,
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
      p={4}
      zIndex={1000}
    >
      <Flex justifyContent="space-between" mb={4}>
        <Text fontWeight="bold">Your Notifications</Text>
        <Text fontSize="sm" color="blue.500" cursor="pointer" onClick={onClose}>
          Close
        </Text>
      </Flex>
      {notifications.map((notification) => (
        <Box key={notification.id} mb={4}>
          <Flex alignItems="center">
            <Avatar size="sm" src={notification.avatar} mr={4} />
            <Box flex="1">
              <Text>
                <Text as="span" fontWeight="bold">
                  @{notification.name}
                </Text>{" "}
                {notification.action}
              </Text>
              {notification.comment && (
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {notification.comment}
                </Text>
              )}
              <Text fontSize="xs" color="gray.500">
                {notification.time}
              </Text>
            </Box>
            {notification.isInvitation && (
              <Flex>
                <IconButton
                  icon={<FiCheck />}
                  aria-label="Accept"
                  size="sm"
                  colorScheme="green"
                  mr={2}
                />
                <IconButton
                  icon={<FiX />}
                  aria-label="Decline"
                  size="sm"
                  colorScheme="red"
                />
              </Flex>
            )}
            {!notification.isInvitation && (
              <Badge colorScheme="blue" ml={2}>
                New
              </Badge>
            )}
          </Flex>
          <Divider mt={4} />
        </Box>
      ))}
    </Box>
  );
};

export default NotificationPanel;
