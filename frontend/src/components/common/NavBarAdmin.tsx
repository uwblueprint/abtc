import React from 'react';
import {
  Box,
  Flex,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Spacer,
  Avatar,
  Icon,
} from '@chakra-ui/react';
import { Link as ReactRouterLink, useLocation } from 'react-router-dom';
import { BsPerson } from 'react-icons/bs';
import { RxChevronDown } from "react-icons/rx";
import { PiBell } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import abtc_logo from '../../images/abtc_logo.png';

const NavBarAdmin: React.FC = () => {
  const location = useLocation();

  return (
    <Flex bg="white" p={4} alignItems="center">
      <Box ml={4}>
        <Image src={abtc_logo} alt="ABTC Logo" maxWidth="180px" height="auto"/>
      </Box >
      <ChakraLink
        as={ReactRouterLink}
        to="/"
        color={location.pathname === '/' ? '#3F3575' : "#444750"}
        fontWeight='500'
        _hover={{ color: "black", textDecoration: "none" }}
        ml={6}
        backgroundColor={location.pathname === '/' ? '#D9D7E3' : 'none'}
        paddingLeft={4}
        paddingRight={4}
        paddingTop={1}
        paddingBottom={1}
        borderRadius={8}
      >
        <Flex align="center">
          <Icon as={GoHome} boxSize={5} mr={3}/>
          Home
        </Flex>
      </ChakraLink>
      <Box ml={3}>
        <Menu>
          <MenuButton
            as={Box}
            color={location.pathname.startsWith('/manage-accounts') ? '#3F3575' : "#444750"}
            fontWeight="500"
            _hover={{ color: "black", textDecoration: "none" }}
            backgroundColor={location.pathname.startsWith('/manage-accounts') ? '#D9D7E3' : 'none'}
            paddingLeft={4}
            paddingRight={4}
            paddingTop={1}
            paddingBottom={1}
            borderRadius={8}
          >
            <Flex align="center">
              <Icon as={BsPerson} boxSize={5} mr={2} />
                Manage Accounts
              <Icon as={RxChevronDown} boxSize={6} ml={2}/>
            </Flex>
          </MenuButton>
          <MenuList bg="white" border="none">
            <MenuItem
              as={ReactRouterLink}
              to="/manage-accounts/volunteers"
              color="#444750"
              fontWeight="500"
              _hover={{ color: "black", textDecoration: "none" }}
            >
              Volunteers
            </MenuItem>
            <MenuItem
              as={ReactRouterLink}
              to="/manage-accounts/admin"
              color="#444750"
              fontWeight="500"
              _hover={{ color: "black", textDecoration: "none" }}
            >
              Admin
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Spacer />
       {/*  TODO: add logic behind notification button */}
      <ChakraLink
        as={ReactRouterLink}
        to="/notifications"
        color="#444750"
        fontWeight="500"
        _hover={{ color: "black", textDecoration: "none" }}
      >
        <Icon as={PiBell} boxSize={6} />
      </ChakraLink>
      <Box ml={6} mr={2}>
        <ChakraLink as={ReactRouterLink} to="/user-profile" fontWeight="bold" lineHeight="1.5">
          <Avatar size="md" name="User" src="https://placehold.co/25x25" />
        </ChakraLink>
      </Box>
      <Box>
        <Menu>
          <MenuButton
            as={Box}
            color="#444750"
            fontWeight="500"
            _hover={{ color: "black", textDecoration: "none" }}
          >
            <Flex align="center">
              <Box ml={2}>
                Name-First-Last
              </Box>
              <Icon as={RxChevronDown} boxSize={6} ml={2} mr={2}/>
            </Flex>
          </MenuButton>
          <MenuList bg="white" border="none" minW="auto" w="auto">
            <MenuItem
              as={ReactRouterLink}
              to="/profile/placeholder"
              color="#444750"
              fontWeight="500"
              _hover={{ color: "black", textDecoration: "none" }}
            >
              Placeholder
            </MenuItem>
            <MenuItem
              as={ReactRouterLink}
              to="/profile/placeholder1"
              color="#444750"
              fontWeight="500"
              _hover={{ color: "black", textDecoration: "none" }}
            >
              Placeholder 2
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default NavBarAdmin;
