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
import { RxChevronDown } from "react-icons/rx";
import { PiBell } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import { LuNavigation } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import abtc_logo from '../../images/abtc_logo.png';

const NavBarVolunteer: React.FC = () => {
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
      <ChakraLink
        as={ReactRouterLink}
        to="/about"
        color={location.pathname === '/about' ? '#3F3575' : "#444750"}
        fontWeight='500'
        _hover={{ color: "black", textDecoration: "none" }}
        ml={6}
        backgroundColor={location.pathname === '/about' ? '#D9D7E3' : 'none'}
        paddingLeft={4}
        paddingRight={4}
        paddingTop={1}
        paddingBottom={1}
        borderRadius={8}
      >
        <Flex align="center">
          <Icon as={LuNavigation} boxSize={5} mr={3}/>
          About
        </Flex>
      </ChakraLink>
      <ChakraLink
        as={ReactRouterLink}
        to="/contact-us"
        color={location.pathname === '/contact-us' ? '#3F3575' : "#444750"}
        fontWeight='500'
        _hover={{ color: "black", textDecoration: "none" }}
        ml={6}
        backgroundColor={location.pathname === '/contact-us' ? '#D9D7E3' : 'none'}
        paddingLeft={4}
        paddingRight={4}
        paddingTop={1}
        paddingBottom={1}
        borderRadius={8}
      >
        <Flex align="center">
          <Icon as={FiPhone} boxSize={5} mr={3}/>
          Contact Us
        </Flex>
      </ChakraLink>
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

export default NavBarVolunteer;
