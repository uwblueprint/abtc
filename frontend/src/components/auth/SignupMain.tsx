import React from 'react';
import { Flex, Box, Center, Heading, FormControl, FormLabel, Input, Button, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link as ReactRouterLink } from "react-router-dom";
import { LOGIN_PAGE } from "../../constants/Routes";
import { SignupFormStepComponentType, SignupFormStepProps } from "../../types/SignupFormStepTypes";

const SignupMain: SignupFormStepComponentType = ({ back, onSubmit, updateFields, data }: SignupFormStepProps): React.ReactElement => {
  const { firstName, lastName } = data;

  return (
    <Flex width="100vw" height="100vh" align="center" justify="center" background="dimgray">
      <Box width="md" pt={16} pr={16} pl={16} pb={10} m={5} background="white" rounded={20}>
        <Box pb={4} textAlign="left">
          <Heading size="lg">Create an Account</Heading>
        </Box>
        <Box my={4} textAlign="left">
          <form onSubmit={onSubmit}>
            <FormControl border={2} borderColor="#0B0B0B" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input value={firstName} onChange={event => { updateFields({ firstName: event.target.value }); }} />
            </FormControl>
            <FormControl mt={6} border={2} isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input value={lastName} onChange={event => { updateFields({ lastName: event.target.value }); }} />
            </FormControl>
            <Center mt={4} mb={4}>
              <Button type="submit" isDisabled={firstName === "" || lastName === ""} width="full" mt={4} color="white" background="#28214C">
                Next
              </Button>
            </Center>
            <Center>
              <Text fontSize="sm">Already have an account? <ChakraLink as={ReactRouterLink} to={LOGIN_PAGE} textDecoration="underline">Log In</ChakraLink></Text>
            </Center>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default SignupMain;
