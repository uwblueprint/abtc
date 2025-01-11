import React, { useEffect, useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import CustomizedCalendar from "./Calendar/CustomizedCalendar";
import Shifts from "./Shifts";
import NavBar from "../common/NavBar";
import ShiftDetails from "../common/ShiftDetails";

const Dashboard = (): React.ReactElement => {
  const [userInfo, setUserInfo] = useState<any>({
    firstName: "",
    lastName: "",
    role: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem(AUTHENTICATED_USER_KEY);

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUserInfo(parsedUserData);
    }
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  const shiftId = urlParams.has("shiftId") ? urlParams.get("shiftId") : null;

  return (
    <Flex direction="column" h="100vh">
      <NavBar
        firstName={userInfo.firstName}
        lastName={userInfo.lastName}
        userRole={userInfo.role}
      />
      <Flex flex="1">
        <Box pt={10} pl={8} border="1px" borderColor="gray.100">
          <Shifts />
        </Box>

        <Box flex="1" pt={10} pl={6} border="1px" borderColor="gray.100">
          {shiftId ? (
            <ShiftDetails shiftId={shiftId} />
          ) : (
            <CustomizedCalendar />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
