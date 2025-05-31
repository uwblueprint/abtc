import React, { useState } from "react";
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
import abtc_logo from "../../images/abtc_logo_2.png";
import { logout } from "../../utils/logout";
import NotificationModal from "./NotificationModal";

interface NavBarProps {
  firstName: string;
  lastName: string;
  userRole: string;
  id: string;
}

const NavBar: React.FC<NavBarProps> = ({
  firstName,
  lastName,
  userRole,
  id,
}) => {
  const location = useLocation();
  const toast = useToast();
  const isAdmin = userRole === "ADMIN";

  // State for modal visibility
  const [isModalOpen, setModalOpen] = useState(false);

  const [numUnchecked, setNumUnchecked] = useState(0);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return (
    <Flex flexDirection="column" justifyContent="end">
      <Flex bg="white" p={4} alignItems="center" backgroundColor="#3b2f3d">
        <Box ml={4}>
          <Image
            src={abtc_logo}
            alt="ABTC Logo"
            maxWidth="180px"
            height="auto"
          />
        </Box>
        <ChakraLink
          as={ReactRouterLink}
          to="/dashboard"
          color="#444750"
          fontWeight="500"
          _hover={{ color: "black", textDecoration: "none" }}
          ml={6}
          paddingLeft={4}
          paddingRight={4}
          paddingTop={1}
          paddingBottom={1}
          borderRadius={8}
        >
          <Flex align="center" color="white">
            <Icon as={GoHome} boxSize={5} mr={3} color="white"/>
            Home
          </Flex>
        </ChakraLink>
        {isAdmin ? (
          <Box ml={3}>
            <Menu>
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
                <Flex align="center" color="white">
                  <Icon as={BsPerson} boxSize={5} mr={2} /> Manage Accounts
                  <Icon as={RxChevronDown} boxSize={6} ml={2} />
                </Flex>
              </MenuButton>
              <MenuList bg="white" border="none">
                <MenuItem
                  as={ReactRouterLink}
                  to="/account-directory"
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
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        ) : (
          <>
            <Button
              onClick={handleModalOpen}
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
              leftIcon={<Icon as={LuNavigation} boxSize={5} />}
            >
              About
            </Button>
            <ChakraLink
              color={
                location.pathname === "/contact-us" ? "#3F3575" : "#444750"
              }
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
        <Flex
          onClick={() => {
            setModalOpen(!isModalOpen);
          }}
          position="relative"
        >
          <Icon as={PiBell} boxSize={7} mr={2} color="white"/>
          {numUnchecked > 0 && (
            <Box
              position="absolute"
              top="-5px"
              left="-8px"
              backgroundColor="red.500"
              color="white"
              borderRadius="full"
              width="20px"
              height="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="12px"
              fontWeight="bold"
            >
              {numUnchecked}
            </Box>
          )}
        </Flex>

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

        {/* About Modal */}
      </Flex>
      <NotificationModal
        isVisible={isModalOpen}
        onClose={handleModalClose}
        numUnchecked={numUnchecked}
        setNumUnchecked={setNumUnchecked}
        userId={id}
        role={userRole}
      />
    </Flex>
  );
};

export default NavBar;
