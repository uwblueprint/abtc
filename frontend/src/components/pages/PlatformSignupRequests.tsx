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
  Input,
  Heading,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaXmark,
  FaArrowsRotate,
  FaAngleRight,
  FaAngleLeft,
  FaRegClock,
} from "react-icons/fa6";
import { FiClock } from "react-icons/fi";

import NavBar from "../common/NavBar";
import SignupRequestAPIClient from "../../APIClients/SignupRequestAPIClient";
import UserAPIClient from "../../APIClients/UserAPIClient";

interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  createdAt: string | null;
}

const PlatformSignupRequests = (): React.ReactElement => {
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [filteredUserInfo, setFilteredUserInfo] = useState<UserInfo[]>([]);

  // Search filter
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Filter flag (show only PENDING)
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ServiceRequestAPIClient.getPlatformSignups();
        setUserInfo(response);
      } catch (error) {
        console.error("Error fetching platform signups:", error);
      }
    };
    fetchData();
  }, []);

  // Checkbox and pagination logic
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Filtering logic
  useEffect(() => {
    setFilteredUserInfo(
      userInfo.filter((user) => {
        // Search by first + last name
        const nameMatch = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(
          searchFilter.toLowerCase(),
        );

        // If isFilterActive is true, only keep rows with status === "PENDING"
        const statusMatch = isFilterActive ? user.status === "PENDING" : true;

        return nameMatch && statusMatch;
      }),
    );
    setCurrentPage(1);
  }, [userInfo, searchFilter, isFilterActive]);

  // When userInfo changes, reset the checked items array
  useEffect(() => {
    setCheckedItems(new Array(userInfo.length).fill(false));
  }, [userInfo]);

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCheckedItems(new Array(userInfo.length).fill(newSelectAll));
  };

  const handleCheckboxChange = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    setSelectAll(newCheckedItems.every((item) => item));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredUserInfo.length / itemsPerPage);
  const currentItems = filteredUserInfo.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const itemCountStart = (currentPage - 1) * itemsPerPage + 1;
  const itemCountEnd = Math.min(
    currentPage * itemsPerPage,
    filteredUserInfo.length,
  );

  // Status badge style
  const getBadgeBg = (status: string): string => {
    if (status === "PENDING") return "#DACFFB";
    return "gray.200";
  };

  const getBadgeColor = (status: string): string => {
    if (status === "PENDING") return "#230282";
    return "black";
  };

  const handleApproveClick = () => {
    checkedItems.forEach((checkedItem, index) => {
      if (checkedItem) {
        console.log(userInfo[index]);
        console.log(userInfo[index].id);
        console.log(userInfo[index].email);
        SignupRequestAPIClient.deletePlatformSignup(userInfo[index].id);
        UserAPIClient.acceptUserByEmail(userInfo[index].email);
      }
    });
    console.log("Approve icon clicked");
  };

  const handleRejectClick = () => {
    // reject logic to be determined
    console.log("Reject icon clicked");
  };

  const handleSearchClick = () => {
    console.log("Search icon clicked");
  };

  const handleRefreshClick = () => {
    setSearchFilter("");
    setIsFilterActive(false);
    setSelectAll(false);
    setCheckedItems(new Array(userInfo.length).fill(false));
    setCurrentPage(1);
    setIsFilterActive(false);
  };

  // Toggle showing only PENDING rows
  const handleFilterClick = () => {
    setIsFilterActive((prev) => !prev);
  };

  return (
    <Flex direction="column" h="100vh">
      <NavBar firstName="L" lastName="F" userRole="ADMIN" />
      <Flex direction="column" ml={10} mr={20}>
        <Heading as="h1" size="lg" mt="30px" mb="15px">
          Platform Requests
        </Heading>

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
                <Th>
                  <Checkbox
                    size="md"
                    isChecked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </Th>
                <Th>
                  <IconButton
                    aria-label="Approve"
                    size="sm"
                    icon={<Icon as={FaCheck} />}
                    variant="ghost"
                    onClick={handleApproveClick}
                  />
                  <IconButton
                    aria-label="Reject"
                    size="sm"
                    icon={<Icon as={FaXmark} />}
                    variant="ghost"
                    onClick={handleRejectClick}
                  />
                  <IconButton
                    aria-label="Filter"
                    size="sm"
                    icon={<Icon as={FaRegClock} />}
                    onClick={handleFilterClick}
                    variant={isFilterActive ? "solid" : "ghost"}
                  />
                  <IconButton
                    aria-label="Refresh"
                    size="sm"
                    icon={<Icon as={FaArrowsRotate} />}
                    variant="ghost"
                    onClick={handleRefreshClick}
                  />

                  <Input
                    placeholder="Search for a user"
                    size="sm"
                    onChange={handleSearch}
                    value={searchFilter}
                    borderRadius="md"
                    ml="4"
                  />
                </Th>
                <Th />
                <Th />
                <Th>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Flex alignItems="center">
                      <Text>
                        {itemCountStart}-{itemCountEnd} of{" "}
                        {filteredUserInfo.length}
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
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentItems.map((user, index) => (
                <Tr key={user.id}>
                  <Td>
                    <Checkbox
                      size="md"
                      isChecked={checkedItems[index]}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </Td>
                  <Td>
                    {user.firstName} {user.lastName}
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </Td>
                  <Td display="flex" justifyContent="center">
                    <Badge
                      bg={getBadgeBg(user.status)}
                      color={getBadgeColor(user.status)}
                      px="6"
                      textTransform="unset"
                    >
                      {user.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Flex>
  );
};

export default PlatformSignupRequests;
