import React from "react";
import {
  Box,
  Flex,
  Link as ChakraLink,
  Image,
  Spacer,
  Avatar,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  useToast,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { RxChevronDown } from "react-icons/rx";
import { PiBell } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import { LuNavigation } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { HiLogout } from "react-icons/hi";
import abtc_logo from "../../images/abtc_logo.png";
import { logout } from "../../utils/logout";

interface NavBarProps {
  firstName: string;
  lastName: string;
  userRole: string;
}

const NavBar: React.FC<NavBarProps> = ({ firstName, lastName, userRole }) => {
  const location = useLocation();
  const toast = useToast();
  const isAdmin = userRole === "ADMIN";

  return (
    <Flex bg="white" p={4} alignItems="center">
      <Box ml={4}>
        <Image src={abtc_logo} alt="ABTC Logo" maxWidth="180px" height="auto" />
      </Box>
      <ChakraLink
        as={ReactRouterLink}
        to="/volunteer-dashboard"
        color={location.pathname === "/" ? "#3F3575" : "#444750"}
        fontWeight="500"
        _hover={{ color: "black", textDecoration: "none" }}
        ml={6}
        backgroundColor={location.pathname === "/" ? "#D9D7E3" : "none"}
        paddingLeft={4}
        paddingRight={4}
        paddingTop={1}
        paddingBottom={1}
        borderRadius={8}
      >
        <Flex align="center">
          <Icon as={GoHome} boxSize={5} mr={3} />
          Home
        </Flex>
      </ChakraLink>
      {isAdmin ? (
        <Box ml={3}>
          {" "}
          <Menu>
            {" "}
            <MenuButton
              as={Box}
              color={
                location.pathname.startsWith("/manage-accounts")
                  ? "#3F3575"
                  : "#444750"
              }
              fontWeight="500"
              _hover={{ color: "black", textDecoration: "none" }}
              backgroundColor={
                location.pathname.startsWith("/manage-accounts")
                  ? "#D9D7E3"
                  : "none"
              }
              paddingLeft={4}
              paddingRight={4}
              paddingTop={1}
              paddingBottom={1}
              borderRadius={8}
            >
              {" "}
              <Flex align="center">
                {" "}
                <Icon as={BsPerson} boxSize={5} mr={2} /> Manage Accounts{" "}
                <Icon as={RxChevronDown} boxSize={6} ml={2} />{" "}
              </Flex>{" "}
            </MenuButton>{" "}
            <MenuList bg="white" border="none">
              {" "}
              <MenuItem
                as={ReactRouterLink}
                to="/manage-accounts/employee-directory"
                color="#444750"
                fontWeight="500"
                _hover={{ color: "black", textDecoration: "none" }}
              >
                Account Directory
              </MenuItem>
              <MenuItem
                as={ReactRouterLink}
                to="/platform-signup-requests"
                color="#444750"
                fontWeight="500"
                _hover={{ color: "black", textDecoration: "none" }}
              >
                Platform Requests
              </MenuItem>{" "}
            </MenuList>{" "}
          </Menu>{" "}
        </Box>
      ) : (
        <>
          <ChakraLink
            color={location.pathname === "/about" ? "#3F3575" : "#444750"}
            fontWeight="500"
            _hover={{ color: "black", textDecoration: "none" }}
            ml={6}
            backgroundColor={
              location.pathname === "/about" ? "#D9D7E3" : "none"
            }
            paddingLeft={4}
            paddingRight={4}
            paddingTop={1}
            paddingBottom={1}
            borderRadius={8}
            href="https://www.abettertentcity.org"
          >
            <Flex align="center">
              <Icon as={LuNavigation} boxSize={5} mr={3} />
              About
            </Flex>
          </ChakraLink>
          <ChakraLink
            color={location.pathname === "/contact-us" ? "#3F3575" : "#444750"}
            fontWeight="500"
            _hover={{ color: "black", textDecoration: "none" }}
            ml={6}
            backgroundColor={
              location.pathname === "/contact-us" ? "#D9D7E3" : "none"
            }
            paddingLeft={4}
            paddingRight={4}
            paddingTop={1}
            paddingBottom={1}
            borderRadius={8}
            href="mailto:abtc@waterlooregion.org"
          >
            <Flex align="center">
              <Icon as={MdOutlineAlternateEmail} boxSize={5} mr={3} />
              Contact Us
            </Flex>
          </ChakraLink>
        </>
      )}

      <Spacer />
      {/*  TODO: add logic behind notification button */}
      <ChakraLink
        as={ReactRouterLink}
        to="/notifications"
        color="#444750"
        fontWeight="500"
        _hover={{ color: "black", textDecoration: "none" }}
        paddingRight={4}
      >
        <Icon as={PiBell} boxSize={6} />
      </ChakraLink>
      <Box>
        <Popover trigger="hover" placement="bottom-end">
          <PopoverTrigger>
            <Box
              width="40px"
              height="40px"
              borderRadius="50%"
              backgroundColor="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              color="black"
            >
              {firstName?.charAt(0)}
              {lastName?.charAt(0)}
            </Box>
          </PopoverTrigger>
          <PopoverContent maxW="200px">
            <PopoverHeader>
              {firstName} {lastName}
            </PopoverHeader>
            <PopoverBody>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p>Role: </p>
                <p style={{ fontWeight: "bold" }}>{userRole}</p>
              </div>
            </PopoverBody>
            <PopoverBody
              display="flex"
              justifyContent="end"
              cursor="pointer"
              _hover={{ bg: "gray.100" }}
              onClick={() => {
                logout();
              }}
            >
              <Box
                display="flex"
                flexDirection="row"
                gap="10px"
                alignItems="center"
                justifyContent="end"
                w="100%"
                fontSize="16px"
                fontWeight="500"
                color="#CA3433"
              >
                Sign Out
                <Icon as={HiLogout} boxSize={5} />
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </Flex>
  );
};

export default NavBar;
