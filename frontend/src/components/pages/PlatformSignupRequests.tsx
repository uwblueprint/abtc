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
import NavBar from "../common/NavBar";
import ServiceRequestAPIClient from "../../APIClients/ServiceRequestAPIClient";
import UserAPIClient from "../../APIClients/UserAPIClient";
import SignupRequestAPIClient from "../../APIClients/SignupRequestAPIClient";

interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  createdAt: string | null;
  note: string | null;
}

const PlatformSignupRequests = (): React.ReactElement => {
  const toast = useToast();

  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [filteredUserInfo, setFilteredUserInfo] = useState<UserInfo[]>([]);

  // Search filter
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Filter flag (show only PENDING)
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  // For selecting all checkboxes
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SignupRequestAPIClient.getPlatformSignups();
        setUserInfo(response);

        // Build an object keyed by userId => initial note (or "")
        const initialNotes: Record<string, string> = {};
        response.forEach((user) => {
          initialNotes[user.id] = user.note ?? "";
        });
        setNotes(initialNotes);
      } catch (error) {
        console.error("Error fetching platform signups:", error);
      }
    };
    fetchData();
  }, []);

  /**
   * Filtering + Sorting logic
   *  - First, filter by name + status (if isFilterActive)
   *  - Then, sort by `createdAt` descending.
   *    Rows with null or empty createdAt go last.
   */
  useEffect(() => {
    // 1) Filter the data
    const filtered = userInfo.filter((user) => {
      const nameMatch = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(
        searchFilter.toLowerCase(),
      );
      const statusMatch = isFilterActive ? user.status === "PENDING" : true;
      return nameMatch && statusMatch;
    });

    // 2) Sort the filtered data in reverse chronological order
    //    If createdAt is null or empty, push it to the bottom.
    const sorted = filtered.sort((a, b) => {
      const dateA = a.createdAt ? Date.parse(a.createdAt) : NaN;
      const dateB = b.createdAt ? Date.parse(b.createdAt) : NaN;

      // Both invalid => preserve order between them
      if (Number.isNaN(dateA) && Number.isNaN(dateB)) return 0;
      // a invalid, b valid => a goes after b
      if (Number.isNaN(dateA)) return 1;
      // b invalid, a valid => b goes after a
      if (Number.isNaN(dateB)) return -1;
      // Both valid => descending
      return dateB - dateA;
    });

    setFilteredUserInfo(sorted);
    setCurrentPage(1);
  }, [userInfo, searchFilter, isFilterActive]);

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

  const handleNoteChange = (userId: string, newValue: string) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [userId]: newValue,
    }));
  };

  const handleNoteSubmit = (userId: string, note: string) => {
    SignupRequestAPIClient.updateNote(userId, note);
    toast({
      description: "Your note has been saved.",
      status: "success",
      position: "top-right",
      duration: 3000,
      isClosable: true,
    });
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

  // When userInfo changes, reset the checked items array
  useEffect(() => {
    setCheckedItems(new Array(filteredUserInfo.length).fill(false));
  }, [filteredUserInfo]);

  // Status badge style
  const getBadgeBg = (status: string): string => {
    if (status === "PENDING") return "#DACFFB";
    if (status === "ACCEPTED") return "#A8E4A0";
    return "gray.200";
  };

  const getBadgeColor = (status: string): string => {
    if (status === "PENDING") return "#230282";
    if (status === "ACCEPTED") return "#2E6F40";
    return "black";
  };

  // Approve selected items
  const handleApproveClick = () => {
    // Make a copy of checkedItems
    const newCheckedItems = [...checkedItems];

    // Make a copy of filteredUserInfo
    const newFiltered = filteredUserInfo.map((user, index) => {
      if (newCheckedItems[index]) {
        // Approve logic
        SignupRequestAPIClient.acceptPlatformSignup(user.id);
        UserAPIClient.acceptUserByEmail(encodeURI(user.email));
        // Update the status
        return { ...user, status: "ACCEPTED" };
      }
      return user;
    });

    // Reset the checkboxes
    for (let i = 0; i < newCheckedItems.length; i += 1) {
      if (newCheckedItems[i]) {
        newCheckedItems[i] = false;
      }
    }

    // Update state
    setFilteredUserInfo(newFiltered);
    setCheckedItems(newCheckedItems);
    setSelectAll(false);
  };

  const handleRejectClick = () => {
    // Make a copy of checkedItems
    const newCheckedItems = [...checkedItems];

    // Make a copy of filteredUserInfo
    const newFiltered = filteredUserInfo.map((user, index) => {
      if (newCheckedItems[index]) {
        // Approve logic
        SignupRequestAPIClient.rejectPlatformSignup(user.id);
        UserAPIClient.acceptUserByEmail(encodeURI(user.email));
        // Update the status
        return { ...user, status: "REJECTED" };
      }
      return user;
    });

    // Reset the checkboxes
    for (let i = 0; i < newCheckedItems.length; i += 1) {
      if (newCheckedItems[i]) {
        newCheckedItems[i] = false;
      }
    }

    // Update state
    setFilteredUserInfo(newFiltered);
    setCheckedItems(newCheckedItems);
    setSelectAll(false);
  };

  const handleRefreshClick = () => {
    setSearchFilter("");
    setIsFilterActive(false);
    setSelectAll(false);
    setCheckedItems(new Array(userInfo.length).fill(false));
    setCurrentPage(1);
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
                    ml={1}
                  />
                  <IconButton
                    aria-label="Refresh"
                    size="sm"
                    icon={<Icon as={FaArrowsRotate} />}
                    variant="ghost"
                    onClick={handleRefreshClick}
                    ml={1}
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
                <Th minWidth="350px" />
                <Th />
                <Th />
              </Tr>
            </Thead>

            <Tbody>
              {currentItems.map((user, index) => (
                <Tr key={user.id}>
                  <Td>
                    <Checkbox
                      size="md"
                      isChecked={
                        checkedItems[index + (currentPage - 1) * itemsPerPage]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          index + (currentPage - 1) * itemsPerPage,
                        )
                      }
                    />
                  </Td>
                  <Td>
                    {user.firstName} {user.lastName}
                  </Td>
                  <Td>{user.email}</Td>
                  <Td minWidth="400px">
                    <Flex flexDirection="row" alignItems="center" gap={1}>
                      <Textarea
                        placeholder="Add a note.."
                        size="sm"
                        rows={1} // show at least 2 lines
                        resize="vertical" // allow vertical resize (optional)
                        value={notes[user.id] || ""}
                        onChange={(e) =>
                          handleNoteChange(user.id, e.target.value)
                        }
                        borderRadius="md"
                        ml="4"
                        maxWidth="300px"
                      />
                      {notes[user.id] && (
                        <IconButton
                          aria-label="Approve"
                          size="md"
                          icon={<Icon as={GrDocumentUpdate} />}
                          variant="ghost"
                          onClick={() => {
                            handleNoteSubmit(user.id, notes[user.id] || "");
                          }}
                        />
                      )}
                    </Flex>
                  </Td>
                  <Td marginTop={4}>
                    <Badge
                      bg={getBadgeBg(user.status)}
                      color={getBadgeColor(user.status)}
                      px="6"
                      textTransform="unset"
                    >
                      {user.status}
                    </Badge>
                  </Td>
                  <Td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : ""}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Flex justifyContent="end" alignItems="center">
          <Flex alignItems="center">
            <Text marginRight={2}>
              {itemCountStart}-{itemCountEnd} of {filteredUserInfo.length}
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

export default PlatformSignupRequests;
