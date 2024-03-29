import React, { useEffect, useState } from "react";
import { Flex, Box, Heading } from '@chakra-ui/react';
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";

const VolunteerDashboard = (): React.ReactElement => {
  const [userInfo, setUserInfo] = useState<any>(null); 

  useEffect(() => {
    const userData = localStorage.getItem(AUTHENTICATED_USER_KEY);

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      console.log(parsedUserData);

      setUserInfo(userData);
    }
  }, []);

  return (
    <Flex direction="column" h="100vh">
      {/* Navbar Component Here */}

      <Flex bg="gray.100" pl={8} align="center" h="72px">
        <Heading size='md'>Temp Navbar</Heading>
      </Flex>

      <Flex flex="1">
        <Box w="23%" pt={10} pl={8} border='1px' borderColor='gray.100'>
          <Heading size='md'>Your Shifts</Heading>
        </Box>

        <Box flex="1" pt={10} pl={6} border='1px' borderColor='gray.100'>
          <Heading size='md'>Month, Year</Heading>
        </Box>
      </Flex>
    </Flex>
  );
};

export default VolunteerDashboard;
