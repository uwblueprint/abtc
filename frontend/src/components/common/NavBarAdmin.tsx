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
  PopoverAnchor
} from '@chakra-ui/react';
import { Link as ReactRouterLink, useLocation } from 'react-router-dom';
import { BsPerson } from 'react-icons/bs';
import { RxChevronDown } from "react-icons/rx";
import { PiBell } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import abtc_logo from '../../images/abtc_logo.png';

interface NavBarAdminProps {
  firstName: string;
  lastName: string;
  role: string;
}

const NavBarAdmin: React.FC<NavBarAdminProps> = ({firstName, lastName, role}) => {
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

export default NavBarAdmin;
