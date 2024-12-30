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
    Heading
} from '@chakra-ui/react';
import { FaCheck, FaXmark, FaSistrix, FaArrowsRotate, FaBars, FaAngleRight, FaAngleLeft } from "react-icons/fa6";

import NavBar from "../common/NavBar";
import ServiceRequestAPIClient from "../../APIClients/ServiceRequestAPIClient";

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

  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [searchFilter, setSearchFilter] = useState<string>('');
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value)
  };

  useEffect(() => {
    setFilteredUserInfo(userInfo.filter((user) => (`${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`).includes(searchFilter.toLowerCase())));
    setCurrentPage(1);
  }, [userInfo, searchFilter]);

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

  const getBadgeBg = (status: string): string => {
    if (status === "PENDING") return "#DACFFB";
    return "gray.200";
  };

  const getBadgeColor = (status: string): string => {
    if (status === "PENDING") return "#230282";
    return "black";
  };

  const handleApproveClick = () => {
    console.log("Approve icon clicked");
  };

  const handleRejectClick = () => {
    console.log("Reject icon clicked");
  };

  // const handleSearchClick = () => {
  //   console.log("Search icon clicked");
  // };

  const handleRefreshClick = () => {
    setSearchFilter('');
    setSelectAll(false);
    setCheckedItems(new Array(userInfo.length).fill(false));
    setCurrentPage(1);
  };

  const handleFilterClick = () => {
    console.log("Filter icon clicked");
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
  const itemCountEnd = Math.min(currentPage * itemsPerPage, filteredUserInfo.length);

  return (
    <Flex direction="column" h="100vh">
      <NavBar
        firstName="L"
        lastName="F"
        userRole="ADMIN"
      />
      <Flex direction="column" ml={10} mr={20}>
      <Heading as="h1" size="lg" mt="30px" mb="15px"> Platform Requests </Heading>

            <TableContainer mt='5' mb = "10" border='1px' borderColor='gray.200' borderRadius='20'>
                <Table variant='simple'>
                    <Thead>
                    <Tr mt='3'>
                            <Th><Checkbox size='md' isChecked={selectAll} onChange={handleSelectAllChange} /></Th>
                            <Th>
                                <IconButton
                                    aria-label="Approve"
                                    size="sm"
                                    icon={<Icon as={FaCheck} />}
                                    variant='ghost'
                                    onClick={handleApproveClick}
                                />
                                <IconButton
                                    aria-label="Reject"
                                    size="sm"
                                    icon={<Icon as={FaXmark} />}
                                    variant='ghost'
                                    onClick={handleRejectClick}
                                />
                                {/* <IconButton
                                    aria-label="Search"
                                    size="sm"
                                    icon={<Icon as={FaSistrix} />}
                                    variant='ghost'
                                    onClick={handleSearchClick}
                                /> */}
                                <IconButton
                                    aria-label="Refresh"
                                    size="sm"
                                    icon={<Icon as={FaArrowsRotate} />}
                                    variant='ghost'
                                    onClick={handleRefreshClick}
                                />
                                {/* <IconButton
                                    aria-label="Filter"
                                    size="sm"
                                    icon={<Icon as={FaBars} />}
                                    variant='ghost'
                                    onClick={handleFilterClick}
                                /> */}
                                <Input 
                                    placeholder='Search for a user' 
                                    size='sm' 
                                    onChange={handleSearch}
                                    value={searchFilter}
                                    borderRadius="md"
                                />
                            </Th>
                            <Th> </Th>
                            <Th> </Th>
                            <Th>
                                <Flex justifyContent="space-between" alignItems="center">
                                    <Flex alignItems="center">
                                        <Text>{itemCountStart}-{itemCountEnd} of {filteredUserInfo.length}</Text>
                                        <IconButton
                                            aria-label="Previous Page"
                                            size="sm"
                                            icon={<FaAngleLeft />}
                                            variant='ghost'
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        />
                                        <IconButton
                                            aria-label="Next Page"
                                            size="sm"
                                            icon={<FaAngleRight />}
                                            variant='ghost'
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
                                size='md'
                                isChecked={checkedItems[index]}
                                onChange={() => handleCheckboxChange(index)}
                              />
                            </Td>
                            <Td>{user.firstName} {user.lastName}</Td>
                            <Td>{user.email}</Td>
                            <Td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</Td>
                            <Td display="flex" justifyContent="center">
                              <Badge
                                bg={getBadgeBg(user.status)}
                                color={getBadgeColor(user.status)}
                                px="6"
                                textTransform='unset'
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
