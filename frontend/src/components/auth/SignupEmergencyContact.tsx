import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
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
import { SignupFormStepComponentType, SignupFormStepProps } from "../../types/SignupFormStepTypes";

const SignupEmergencyContact: SignupFormStepComponentType = ({ back, onSubmit, updateFields, data, errors, updateErrorFields }: SignupFormStepProps): React.ReactElement => {
  const { emergencyFirstName, emergencyLastName, emergencyPhoneNumber } = data;
  const { phoneNumberError } = errors;

  const handlePhoneNumberChange = (value: string) => {
    updateFields({ emergencyPhoneNumber: value });
    const error = validatePhoneNumber(value);
    updateErrorFields({ phoneNumberError: error || "" });
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
          <form onSubmit={onSubmit}>
            <FormControl mt={6} border={2} borderColor="#0B0B0B" isRequired>
              <FormLabel>Emergency Contact First Name</FormLabel>
              <Input
                placeholder="First Name"
                value={emergencyFirstName}
                onChange={event => updateFields({ emergencyFirstName: event.target.value })}
              />
            </FormControl>
            <FormControl mt={6} border={2} isRequired>
              <FormLabel>Emergency Contact Last Name</FormLabel>
              <Input
                placeholder="Last Name"
                value={emergencyLastName}
                onChange={event => updateFields({ emergencyLastName: event.target.value })}
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
                onChange={(e: { target: { value: string; }; }) =>
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
                onClick={back}
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
