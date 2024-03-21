import React from "react";
import { Flex, Box, Spacer, Heading } from '@chakra-ui/react';

const VolunteerDashboard = (): React.ReactElement => {
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
