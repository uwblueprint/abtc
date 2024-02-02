import React from 'react';
import { Flex, Box, Center, Heading, FormControl, FormHelperText, FormLabel, Input, Button, Text, Link } from '@chakra-ui/react'

const Signup = (): React.ReactElement => {
  return (
    <Flex width="100vw" height="100vh" align="center" justify="center" background="dimgray">
        <Box width="md" pt={16} pr={16} pl={16} pb={10} m={5} background="white" rounded={20}>
          <Box pb={4} textAlign="left">
            <Heading size='lg'>Create an Account</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form>
              <FormControl border={2} borderColor="#0B0B0B" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input/>
              </FormControl>
              <FormControl mt={6} border={2} isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input/>
              </FormControl>
              <Center mt={4} mb={4}>
                <Button isDisabled width="full" mt={4} color="gray" background="#28214C" opacity="50%" type="submit">
                  Next
                </Button>
              </Center>
              <Center>
                {/* todo: change href link to Login Page */}
                <Text fontSize='sm'>Already have an account? <Link textDecoration="underline" href='https://chakra-ui.com' isExternal>Login</Link></Text>
              </Center>
            </form>
          </Box>
        </Box>
    </Flex>
  );
};

export default Signup;
