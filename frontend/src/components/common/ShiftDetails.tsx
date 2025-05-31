import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Icon,
  Link as ChakraLink,
  Text,
  Image,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { TbCircleChevronLeft } from "react-icons/tb";
import { Link as ReactRouterLink, useHistory } from "react-router-dom";
import ServiceRequestAPIClient from "../../APIClients/ServiceRequestAPIClient";
import EntityAPIClient from "../../APIClients/EntityAPIClient";
import { titleCase } from "../../utils/FormatUtils";
import UserAPIClient from "../../APIClients/UserAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import NotificationAPIClient from "../../APIClients/NotificationAPIClient";
import { NotificationType } from "../../types/NotificationTypes";

const ShiftDetails = ({ shiftId }: any) => {
  const toast = useToast();
  const [shiftData, setShiftData] = useState<any>();
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [photo, setPhoto] = useState("");
  const [volunteerNames, setVolunteerNames] = useState<any[]>([]);
  const [userAssignedShift, setUserAssignedShift] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<any>({
    firstName: "",
    lastName: "",
    role: "",
  });

  const history = useHistory();

  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra's modal hooks

  const shiftTypeToPhoto = {
    SITE: "70bd4e8d6f6f2cd986f3ca622a930a0f.jpg",
    DELIVERY: "handdrawn-delivery-truck-icon-isolated-600nw-2133041811.webp",
    KITCHEN:
      "cooking-concept-illustration-with-doodle-drawing-style-pan-with-food-ingredients-free-vector.jpg",
  };

  function formatShiftTimes(
    shiftStart: string,
    shiftEnd: string,
  ): [string, string] {
    const startDate = new Date(shiftStart);
    const endDate = new Date(shiftEnd);

    const dateFormat = startDate.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const timeFormat = `${startDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${endDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    return [dateFormat, timeFormat];
  }

  useEffect(() => {
    const userData = localStorage.getItem(AUTHENTICATED_USER_KEY);
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setCurrentUser(parsedUserData);
    }
  }, [shiftId]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await ServiceRequestAPIClient.getById({
        requestId: shiftId,
      });

      setShiftData(data);
    };
    fetchData();
  }, [shiftId]);

  useEffect(() => {
    const fetchData = async () => {
      if (shiftData?.requestType) {
        const path = shiftData.requestType;
        const photoFile = shiftTypeToPhoto[
          path as keyof typeof shiftTypeToPhoto
        ]
          ? await EntityAPIClient.getFile(
              shiftTypeToPhoto[path as keyof typeof shiftTypeToPhoto],
            )
          : null;

        if (photoFile) {
          setPhoto(photoFile);
        }
      }

      if (shiftData?.assigneeIds) {
        const userDataArray = await Promise.all(
          shiftData.assigneeIds.map(async (id: any) => {
            if (id === currentUser.id) {
              setUserAssignedShift(true);
            }
            const userData = await UserAPIClient.getUserById(id);
            return `${titleCase(userData.firstName)} ${titleCase(
              userData.lastName,
            )}`;
          }),
        );
        setVolunteerNames(userDataArray);
      }

      const formattedDate = formatShiftTimes(
        shiftData?.shiftTime,
        shiftData?.shiftEndTime,
      );
      setDay(formattedDate[0]);
      setTime(formattedDate[1]);
    };

    fetchData();
  }, [shiftData, shiftId]);

  // Delete function
  const deleteShift = async () => {
    try {
      await ServiceRequestAPIClient.deleteShiftById(shiftData?.id);
      onClose();
      history.push("/?refresh=true");
    } catch (error) {
      console.error("Error deleting shift:", error);
    }
  };

  const addUserToShift = async () => {
    if (volunteerNames.length >= shiftData?.numberOfVolunteers) {
      toast({
        title: "Registration failed",
        description: "Maximum number of volunteers reached",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await ServiceRequestAPIClient.addUserToServiceRequest(
        currentUser.id,
        shiftData?.id,
      );

      onClose();
      history.push("/?refresh=true");
    } catch (error) {
      console.error("Error adding user to shift:", error);
    }
  };

  const removeUserFromShift = async () => {
    try {
      await ServiceRequestAPIClient.removeUserFromServiceRequest(
        currentUser.id,
        shiftData?.id,
        shiftData?.requestName,
        `${currentUser?.firstName} ${currentUser?.lastName}`,
        formatShiftTimes(shiftData?.shiftTime, shiftData?.shiftEndTime)[0],
      );
      await NotificationAPIClient.post({
        assigneeId: "",
        requesterId: currentUser.id,
        notificationDescription: `${currentUser.fiFstName} ${currentUser.lastName} has withdrawn from a shift.`,
        notificationTitle: "Cancelled Shift",
        type: NotificationType.CANCELLED,
        shiftId: shiftData?.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        adminView: true,
      });
      onClose();
      history.push("/?refresh=true");
    } catch (error) {
      console.error("Error removing user from shift:", error);
    }
  };

  const RenderButton = () => {
    if (currentUser?.role === "ADMIN") {
      return (
        <Button mr={8} mb={3} bg="#BF0A30" color="white" onClick={onOpen}>
          Delete Shift
        </Button>
      );
    }

    if (userAssignedShift) {
      return (
        <Button
          mr={8}
          mb={3}
          onClick={() => {
            removeUserFromShift();
          }}
          bg="#BF0A30"
          color="white"
          minW="150px"
        >
          Cancel
        </Button>
      );
    }

    return (
      <Button
        mr={8}
        mb={3}
        onClick={() => {
          addUserToShift();
        }}
        bg="#28214C"
        color="white"
        minW="150px"
      >
        Sign up
      </Button>
    );
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="start"
      width="40%"
      marginLeft={17}
      position="absolute"
      zIndex={1400}
      bg="rgba(247, 241, 241, 0.6 )"
      boxShadow="0 8px 32px 0 rgba(31, 32, 34, 0.37)"
      backdropFilter="blur(4px)"
      sx={{
        WebkitBackdropFilter: "blur(4px)"
      }}
      borderRadius="10px"
      border="1px solid rgba(255, 255, 255, 0.18)"
      top="35%"
      left="35%"
    >
      {/* <ChakraLink
        as={ReactRouterLink}
        to="/dashboard"
        color="#444750"
        fontWeight="500"
        _hover={{ color: "black", textDecoration: "none" }}
        borderRadius={8}
      >
       
      </ChakraLink> */}
      <Flex
        direction="column"
        p={4}               // 16px padding all around
        mr={10}
        minH="45%"
      
      
        overflow="hidden"   // make sure child bg is clipped to radius
      >
        <Flex
          direction="column"
          bg="gray.50"
          p={4}
          mt={-4}           // pull up by 16px
          mx={-4}           // pull left/right by 16px
          borderTopRadius="15px"
          backgroundColor="transparent"
        >
          <Heading as="h1" size="lg" mb="5px">
            {`${shiftData ? titleCase(shiftData?.requestName) : ""} Shift`}
          </Heading>
          <Flex color="#969696" fontSize={18} >
            <Text mr={2} fontWeight={600}>{day}</Text>
            <Text>{time}</Text>
        </Flex>
        </Flex>
        
        <Text fontWeight={600} fontSize={18} mt={2}>
          Details
        </Text>
        <Text fontSize={18}>{shiftData?.description}</Text>
        <Flex justifyContent="space-between" marginRight="30%">
          <Flex flexDirection="column" mt={10}>
              <Flex flexDirection="column">
                <Text fontWeight={600} fontSize={18}>
                  Location
                </Text>
                <Text fontSize={18} mb={2}>
                  {shiftData?.location}
                </Text>
                {shiftData?.requestType === "KITCHEN" && (
                  <>
                    <Text fontWeight={600} fontSize={18}>
                      Meal
                    </Text>
                    <Text fontSize={18} mb={2}>
                      {shiftData ? titleCase(shiftData?.meal) : ""}
                    </Text>
                    <Text fontWeight={600} fontSize={18}>
                      Cooking Method
                    </Text>
                    <Text fontSize={18} mb={2}>
                      {shiftData ? titleCase(shiftData?.cookingMethod) : ""}
                    </Text>
                  </>
                )}
              </Flex>
          </Flex>
         
          
        </Flex>

        <Flex justifyContent="space-between" alignItems="end">
          <Flex flexDirection="column">
            <Flex gap={2}>
              <Text fontWeight={600} fontSize={18} mb={2}>
                Volunteers ({volunteerNames.length} /{" "}
                {shiftData?.numberOfVolunteers})
              </Text>
            </Flex>
            <Flex gap={2} mb={3}>
              {volunteerNames.map((name, index) => (
                <Badge key={index} bg="#DACFFB" color="#230282">
                  {name}
                </Badge>
              ))}
            </Flex>
          </Flex>
          <RenderButton />
        </Flex>
      </Flex>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Shift Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this shift? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button bg="#BF0A30" color="white" mr={3} onClick={deleteShift}>
              Yes, Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ShiftDetails;
