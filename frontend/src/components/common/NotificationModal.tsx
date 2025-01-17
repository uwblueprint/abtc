import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Divider, Badge } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import NotificationAPIClient from "../../APIClients/NotificationAPIClient";

const NotificationPanel = ({
  isVisible,
  onClose,
  numUnchecked,
  setNumUnchecked,
  userId,
  role,
}: {
  isVisible: boolean;
  onClose: () => void;
  numUnchecked: number;
  setNumUnchecked: (num: number) => void;
  userId: string;
  role: string;
}) => {
  const [notifications, setNotifications] = useState<any>([]);
  const history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          let data = [];
          if (role === "ADMIN") {
            console.log("what");
            data = await NotificationAPIClient.getAdminNotifications();
          } else {
            data = await NotificationAPIClient.getById({
              assigneeId: userId,
            });
          }
          setNotifications(data);
          const uncheckedCount = data.filter(
            (notification: any) => !notification.checked,
          ).length;
          setNumUnchecked(uncheckedCount);
        } catch {
          setNumUnchecked(0);
        }
      }
    };
    fetchData();
  }, [userId]);

  console.log(notifications);
  if (!isVisible) {
    return null; // Don't render if the panel is not visible
  }

  const handleNotificationClick = async (notification: any) => {
    await NotificationAPIClient.updateChecked({
      notificationId: notification.id,
    });
    setNumUnchecked(numUnchecked - 1);
    onClose();
    if (notification.type === "PLATFORM") {
      history.push("/platform-signup-requests");
    } else {
      history.push(`/dashboard?shiftId=${notification.shiftId}`);
    }
  };

  return (
    <Box
      position="fixed"
      top="100px"
      right="25px"
      bg="white"
      boxShadow="md"
      borderRadius="lg"
      width="400px"
      minWidth="350px"
      maxHeight="500px"
      p={4}
      zIndex={1000}
      overflowY="scroll" // Enables vertical scrolling
      css={{
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#A0AEC0",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#EDF2F7",
        },
      }}
    >
      {notifications.length > 0 ? (
        notifications.map((notification: any) => (
          <Box
            key={notification.id}
            p={3}
            borderRadius="md"
            _hover={{ backgroundColor: "gray.100" }}
            onClick={() => {
              handleNotificationClick(notification);
            }}
          >
            <Flex alignItems="center">
              <Box flex="1" mt={2}>
                <Text as="span" fontWeight="bold" mt={1}>
                  {notification.notificationTitle}
                </Text>{" "}
                <Text flexDirection="column">
                  {notification.notificationDescription}
                </Text>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {String(notification?.date).slice(0, 10)}
                </Text>
              </Box>
              <Flex flexDirection="column" gap={1} justifyContent="end" ml={4}>
                {!notification.checked && (
                  <Badge colorScheme="blue" width="40px">
                    New
                  </Badge>
                )}
              </Flex>
            </Flex>
            <Divider mt={2} />
          </Box>
        ))
      ) : (
        <Text justifyContent="center" textAlign="center">
          {" "}
          No pending notifications
        </Text>
      )}
    </Box>
  );
};

export default NotificationPanel;
