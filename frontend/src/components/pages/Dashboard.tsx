import React, { useEffect, useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import { useLocation, useHistory } from "react-router-dom";
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

  const history = useHistory();
  const location = useLocation(); // Hook to detect URL changes

  useEffect(() => {
    const userData = localStorage.getItem(AUTHENTICATED_USER_KEY);

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUserInfo(parsedUserData);
    }
  }, []);

  useEffect(() => {
    // This will trigger every time the URL changes
    const urlParams = new URLSearchParams(location.search);
    const shiftId = urlParams.get("shiftId");
    // Perform any additional logic here if needed
  }, [location]);

  const urlParams = new URLSearchParams(location.search);
  const shiftId = urlParams.get("shiftId");
  const refresh = urlParams.get("refresh");

  useEffect(() => {
    history.push("/");
  }, [refresh]);

  return (
    <Flex direction="column" h="100vh">
      <NavBar
        firstName={userInfo.firstName}
        lastName={userInfo.lastName}
        userRole={userInfo.role}
        id={userInfo.id}
      />
      <Flex flex="1">
        <Box pt={10} pl={8} border="1px" borderColor="gray.100" backgroundColor="#f4efe9">
          {/* Shifts will re-render when location changes */}
          <Shifts key={refresh} />
        </Box>

        <Box flex="1" pt={10} pl={6} border="1px" borderColor="gray.100" backgroundColor="#4c464a">
          {shiftId ? (
            <ShiftDetails shiftId={shiftId} />
          ) : (
            <CustomizedCalendar key={refresh} />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
