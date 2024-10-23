import React, { useEffect, useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import {Redirect} from "react-router-dom";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import CustomizedCalendar from "./Calendar/CustomizedCalendar";
import Shifts from "./Shifts";
import NavBarVolunteer from "../common/NavBarVolunteer";
import { INVITE_PAGE } from "../../constants/Routes";

const VolunteerDashboard = (): React.ReactElement => {
  const [userInfo, setUserInfo] = useState<any>({
    firstName: "",   
    lastName: "",    
    role: "",        
  });

  
  const [inviteShiftId, setInviteShiftId] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem(AUTHENTICATED_USER_KEY);
    const shiftId = localStorage.getItem('shiftId');
    if (shiftId) {
      setInviteShiftId(shiftId);
      localStorage.removeItem('shiftId');
    }

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      console.log(parsedUserData); // Remove this later

      setUserInfo(parsedUserData);
    }
  }, []);

  if (inviteShiftId) {
    return <Redirect to={{pathname: INVITE_PAGE, search: `?shiftId=${inviteShiftId}`}} />
  }


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
