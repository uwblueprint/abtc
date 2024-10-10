import React, { useEffect, useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import CustomizedCalendar from "./Calendar/CustomizedCalendar";
import Shifts from "./Shifts";
import NavBarVolunteer from "../common/NavBarVolunteer";

const VolunteerDashboard = (): React.ReactElement => {
  const [userInfo, setUserInfo] = useState<any>({
    firstName: "",   
    lastName: "",    
    role: "",        
  });

  useEffect(() => {
    const userData = localStorage.getItem(AUTHENTICATED_USER_KEY);
    

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      console.log(parsedUserData); // Remove this later

      setUserInfo(parsedUserData);
    }
  }, []);

  return (
    <Flex direction="column" h="100vh">
      <NavBarVolunteer firstName={userInfo.firstName} lastName={userInfo.lastName} role={userInfo.role}/>
      <Flex flex="1">
        <Box pt={10} pl={8} border="1px" borderColor="gray.100">
          <Shifts />
        </Box>

        <Box flex="1" pt={10} pl={6} border="1px" borderColor="gray.100">
          <CustomizedCalendar />
        </Box>
      </Flex>
    </Flex>
  );
};

export default VolunteerDashboard;
