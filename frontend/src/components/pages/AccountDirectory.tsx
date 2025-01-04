import React, { useEffect, useState } from "react";
import {
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
  Badge,
  IconButton,
  Icon,
  Textarea,
  Input,
  Heading,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaXmark,
  FaArrowsRotate,
  FaAngleRight,
  FaAngleLeft,
  FaRegClock,
} from "react-icons/fa6";
import { GrDocumentUpdate } from "react-icons/gr";
import userEvent from "@testing-library/user-event";
import NavBar from "../common/NavBar";
import ServiceRequestAPIClient from "../../APIClients/ServiceRequestAPIClient";
import UserAPIClient from "../../APIClients/UserAPIClient";
import SignupRequestAPIClient from "../../APIClients/SignupRequestAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { formatPhoneNumber, titleCase } from "../../utils/FormatUtils";

interface UserInfo {
  id: string;
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyPhoneNumber: string;
  role: string;
  isAccepted: string;
}

const AccountDirectory = (): React.ReactElement => {
  const [currentUser, setCurrentUser] = useState<any>({
    firstName: "",
    lastName: "",
    role: "",
  });
  useEffect(() => {
    const userData = localStorage.getItem(AUTHENTICATED_USER_KEY);
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setCurrentUser(parsedUserData);
    }
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await UserAPIClient.getUsers();
        setUserInfo(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(userInfo.length / itemsPerPage);
  const currentItems = userInfo.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const itemCountStart = (currentPage - 1) * itemsPerPage + 1;
  const itemCountEnd = Math.min(currentPage * itemsPerPage, userInfo.length);

  return (
    <Flex direction="column" h="100vh">
      <NavBar
        firstName={currentUser.firstName}
        lastName={currentUser.lastName}
        userRole={currentUser.role}
      />
      <Flex direction="column" ml={10} mr={20}>
        <Heading as="h1" size="lg" mt="30px" mb="15px">
          Account Directory
        </Heading>
        {!isLoading ? (
          <TableContainer
            mt="5"
            mb="10"
            border="1px"
            borderColor="gray.200"
            borderRadius="20"
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Phone Number</Th>
                  <Th>Emergency Contact</Th>
                  <Th>Phone Number</Th>
                  <Th>Role</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {currentItems.map((user, index) => (
                  <Tr key={user.id}>
                    <Td>
                      {user.firstName} {user.lastName}
                    </Td>
                    <Td>{user.email}</Td>
                    <Td> {formatPhoneNumber(user.phoneNumber)}</Td>
                    <Td>
                      {user.emergencyFirstName} {user.emergencyLastName}
                    </Td>
                    <Td>{formatPhoneNumber(user.emergencyPhoneNumber)}</Td>
                    <Td> {titleCase(user.role)}</Td>
                    <Td> {user.isAccepted} </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Flex flexDirection="row" width="100%" justifyContent="center">
            <Text fontSize={20} marginRight={3} fontWeight="semibold">
              Fetching data..{" "}
            </Text>
            <Spinner />
          </Flex>
        )}
        <Flex justifyContent="end" alignItems="center">
          <Flex alignItems="center">
            <Text marginRight={2}>
              {itemCountStart}-{itemCountEnd} of {userInfo.length}
            </Text>
            <IconButton
              aria-label="Previous Page"
              size="sm"
              icon={<FaAngleLeft />}
              variant="ghost"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <IconButton
              aria-label="Next Page"
              size="sm"
              icon={<FaAngleRight />}
              variant="ghost"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AccountDirectory;
