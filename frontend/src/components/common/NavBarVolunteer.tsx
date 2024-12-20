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
  Button,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useToast
} from '@chakra-ui/react';
import { Link as ReactRouterLink, useLocation } from 'react-router-dom';
import { RxChevronDown } from "react-icons/rx";
import { PiBell } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import { LuNavigation } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import abtc_logo from '../../images/abtc_logo.png';
import CreateShiftMain from '../pages/CreateShift/CreateShiftMain';

interface NavBarVolunteerProps {
  firstName: string;
  lastName: string;
  role: string;
}

const NavBarVolunteer: React.FC<NavBarVolunteerProps> = ({firstName, lastName, role}) => {
  const location = useLocation();
  const toast = useToast();

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
        href="https://www.abettertentcity.org"
      >
        <Flex align="center">
          <Icon as={LuNavigation} boxSize={5} mr={3}/>
          About
        </Flex>
      </ChakraLink>
      <ChakraLink
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
        href="mailto:abtc@waterlooregion.org"
      >
        <Flex align="center">
          <Icon as={FiPhone} boxSize={5} mr={3}/>
          Contact Us
        </Flex>
      </ChakraLink>
      {/* <button type="button" className="btn btn-primary" onClick={() => showToast("test@example.com")}>
        Test Toast
      </button> */}
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
                <Avatar size="md" name="User" src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSNfBG0r9nBON7QsYexKnLDtTnn4bjfuWZyDndX4OuZPwJTtPUA" />
              </PopoverTrigger>
              <PopoverContent maxW="200px">
                <PopoverHeader>{firstName} {lastName}</PopoverHeader>
                <PopoverBody>Role: {role}</PopoverBody>
              </PopoverContent>
            </Popover>
      </Box>
    </Flex>
  );
};

export default NavBarVolunteer;
