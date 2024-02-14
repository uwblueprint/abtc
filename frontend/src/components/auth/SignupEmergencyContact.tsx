import React, { useState } from "react";
import { useHistory, Link as ReactRouterLink } from "react-router-dom";
import {
  Flex,
  Box,
  Center,
  Heading,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Button,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { validatePhoneNumber } from "../../utils/ValidationUtils";
import { SIGNUP_SECONDARY } from "../../constants/Routes";

const SignupEmergencyContact = () => {
  const [emergencyFirstName, setEmergencyFisrtName] = useState("");
  const [emergencyLastName, setEmergencyLastName] = useState("");
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const history = useHistory();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const onClickCreate = () => {
    console.log("Emergency contact data:", {
      emergencyFirstName,
      emergencyLastName,
      emergencyPhoneNumber,
    });
  };

  const onBackClick = () => {
    history.push(SIGNUP_SECONDARY);
  };

  const handlePhoneNumberChange = (value: string) => {
    setEmergencyPhoneNumber(value);
    const error = validatePhoneNumber(value);
    setPhoneNumberError(error || "");
  };

  const isButtonDisabled =
    !emergencyFirstName ||
    !emergencyLastName ||
    !emergencyPhoneNumber ||
    !!phoneNumberError;

  return (
    <Flex
      width="100vw"
      height="100vh"
      align="center"
      justify="center"
      background="dimgray"
    >
      <Box
        width="md"
        pt={16}
        pr={16}
        pl={16}
        pb={10}
        m={5}
        background="white"
        rounded={20}
      >
        <Box pb={4} textAlign="left">
          <Heading size="lg">Create an Account</Heading>
        </Box>
        <Box my={4} textAlign="left">
          <form onSubmit={handleSubmit}>
            <FormControl mt={6} border={2} borderColor="#0B0B0B" isRequired>
              <FormLabel>Emergency Contact First Name</FormLabel>
              <Input
                placeholder="First Name"
                value={emergencyFirstName}
                onChange={(event: {
                  target: { value: React.SetStateAction<string> };
                }) => setEmergencyFisrtName(event.target.value)}
              />
            </FormControl>
            <FormControl mt={6} border={2} isRequired>
              <FormLabel>Emergency Contact Last Name</FormLabel>
              <Input
                placeholder="Last Name"
                value={emergencyLastName}
                onChange={(event: {
                  target: { value: React.SetStateAction<string> };
                }) => setEmergencyLastName(event.target.value)}
              />
            </FormControl>
            <FormControl
              mt={6}
              border={2}
              borderColor={phoneNumberError ? "red.500" : "#0B0B0B"}
              isRequired
            >
              <FormLabel>Emergency Contact Number</FormLabel>
              <Input
                placeholder="Number"
                value={emergencyPhoneNumber}
                onChange={(e: { target: { value: string } }) =>
                  handlePhoneNumberChange(e.target.value)
                }
              />
              {phoneNumberError && (
                <FormHelperText fontSize="12" textAlign="right" color="red.500">
                  {phoneNumberError}
                </FormHelperText>
              )}
            </FormControl>

            <Flex mt={4} mb={4} justify="space-between" w="100%">
              <Button
                mt={4}
                mr={4}
                w="35%"
                color="white"
                background="#28214C"
                type="submit"
                onClick={onBackClick}
              >
                Back
              </Button>
              <Button
                w="61%"
                mt={4}
                color="white"
                background="#28214C"
                isDisabled={isButtonDisabled}
                type="submit"
                onClick={onClickCreate}
              >
                Create
              </Button>
            </Flex>

            <Center>
              <Text fontSize="sm">
                Already have an account?{" "}
                <ChakraLink
                  as={ReactRouterLink}
                  to="/login"
                  textDecoration="underline"
                >
                  Login
                </ChakraLink>
              </Text>
            </Center>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default SignupEmergencyContact;
