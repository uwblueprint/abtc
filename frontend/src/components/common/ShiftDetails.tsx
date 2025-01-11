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
} from "@chakra-ui/react";
import { TbCircleChevronLeft } from "react-icons/tb";
import { Link as ReactRouterLink, useHistory } from "react-router-dom";
import ServiceRequestAPIClient from "../../APIClients/ServiceRequestAPIClient";
import EntityAPIClient from "../../APIClients/EntityAPIClient";
import { titleCase } from "../../utils/FormatUtils";
import UserAPIClient from "../../APIClients/UserAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";

const ShiftDetails = ({ shiftId }: any) => {
  const [shiftData, setShiftData] = useState<any>();
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [photo, setPhoto] = useState("");
  const [volunteerNames, setVolunteerNames] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>({
    firstName: "",
    lastName: "",
    role: "",
  });
  console.log("shiftId", shiftId);
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
      const path = shiftData?.requestType;
      const photoFile = await EntityAPIClient.getFile(
        shiftTypeToPhoto[path as keyof typeof shiftTypeToPhoto],
      );

      if (shiftData?.assigneeIds) {
        const userDataArray = await Promise.all(
          shiftData?.assigneeIds.map(async (id: any) => {
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
      setPhoto(photoFile);
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
      history.push("/");
    } catch (error) {
      console.error("Error deleting shift:", error);
    }
  };

  const addUserToShift = async () => {
    try {
      await ServiceRequestAPIClient.addUserToServiceRequest(
        currentUser.id,
        shiftData?.id,
      );
      onClose();
      history.push("/");
    } catch (error) {
      console.error("Error deleting shift:", error);
    }
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="start"
      height="100%"
      width="65%"
      marginLeft={17}
    >
      <ChakraLink
        as={ReactRouterLink}
        to="/dashboard"
        color="#444750"
        fontWeight="500"
        _hover={{ color: "black", textDecoration: "none" }}
        borderRadius={8}
      >
        <Flex flexDirection="row" alignItems="center" marginBottom={10}>
          <Icon as={TbCircleChevronLeft} boxSize="35px" marginRight={2} />
          <Heading as="h1" fontSize={25}>
            {shiftData?.requestName}
          </Heading>
        </Flex>
      </ChakraLink>
      <Flex
        flexDirection="column"
        padding={15}
        marginRight={10}
        minH="50%"
        border="1px solid black"
        borderRadius={15}
      >
        <Heading as="h1" size="lg" mb="5px">
          {`${shiftData ? titleCase(shiftData?.requestType) : ""} Shift`}
        </Heading>
        <Flex color="#969696" fontSize={18} mb="10px">
          <Text marginRight={2} fontWeight={600}>
            {day}
          </Text>
          <Text>{time}</Text>
        </Flex>
        <Text fontWeight={600} fontSize={18}>
          Details
        </Text>
        <Text fontSize={18}>{shiftData?.description}</Text>
        <Flex justifyContent="space-between" marginRight="30%">
          <Image
            src={photo}
            alt={shiftData?.requestType}
            boxSize={{ base: "100px", md: "200px", lg: "300px" }}
            objectFit="cover"
            borderRadius="md"
          />
          <Flex flexDirection="column" gap={5} mt={10}>
            <Flex flexDirection="column">
              {shiftData?.requestType === "KITCHEN" && (
                <>
                  <Text fontWeight={600} fontSize={18}>
                    Meal
                  </Text>
                  <Text fontSize={18}>
                    {shiftData ? titleCase(shiftData?.meal) : ""}
                  </Text>
                  <Text fontWeight={600} fontSize={18}>
                    Cooking Method
                  </Text>
                  <Text fontSize={18}>
                    {shiftData ? titleCase(shiftData?.cookingMethod) : ""}
                  </Text>
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDirection="column" mb={3}>
          <Text fontWeight={600} fontSize={18}>
            Location
          </Text>
          <Text fontSize={18}>{shiftData?.location}</Text>
        </Flex>
        <Flex justifyContent="space-between" alignItems="end">
          <Flex flexDirection="column">
            <Text fontWeight={600} fontSize={18} mb={2}>
              Volunteers
            </Text>
            <Flex gap={2} mb={3}>
              {volunteerNames.map((name, index) => (
                <Badge key={index} bg="#DACFFB" color="#230282">
                  {name}
                </Badge>
              ))}
            </Flex>
          </Flex>
          {currentUser?.role === "ADMIN" ? (
            <Button mr={8} mb={3} bg="#BF0A30" color="white" onClick={onOpen}>
              Delete Shift
            </Button>
          ) : (
            <Button
              mr={8}
              mb={3}
              onClick={() => {
                addUserToShift();
              }}
            >
              Sign up
            </Button>
          )}
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
