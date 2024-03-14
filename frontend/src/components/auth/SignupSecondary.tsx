import React, { useState } from "react";
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
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "../../utils/ValidationUtils";
import { SignupFormStepComponentType, SignupFormStepProps } from "../../types/SignupFormTypes";

const SignupSecondary: SignupFormStepComponentType = ({ back, onSubmit, updateFields, data, errors, updateErrorFields }: SignupFormStepProps): React.ReactElement => {
  const { email, phoneNumber, password } = data;
  const { emailError, phoneNumberError, passwordError } = errors;
  const [confirmEmail, setConfirmEmail] = useState("");

  const isButtonDisabled =
    !email ||
    email !== confirmEmail ||
    !password ||
    !phoneNumber ||
    !!emailError ||
    !!phoneNumberError ||
    !!passwordError;

  const handleEmailChange = (value: string) => {
    updateFields({ email: value });
    const error = validateEmail(value);
    updateErrorFields({ emailError: error || "" });
  };

  const handlePhoneNumberChange = (value: string) => {
    updateFields({ phoneNumber: value });
    const error = validatePhoneNumber(value);
    updateErrorFields({ phoneNumberError: error || "" });
  };

  const handlePasswordChange = (value: string) => {
    updateFields({ password: value });
    const error = validatePassword(value);
    updateErrorFields({ passwordError: error || "" });
  };

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
            <FormControl
              border={2}
              borderColor={emailError ? "red.500" : "#0B0B0B"}
              isRequired
            >
              <FormLabel>E-mail</FormLabel>
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e: { target: { value: string; }; }) =>
                  handleEmailChange(e.target.value)
                }
              />
              {emailError && (
                <FormHelperText fontSize="12" textAlign="right" color="red.500">
                  {emailError}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              mt={4}
              border={2}
              borderColor={confirmEmail !== email ? "red.500" : "#0B0B0B"}
              isRequired
            >
              <FormLabel>Confirm E-mail</FormLabel>
              <Input
                type="email"
                placeholder="E-mail"
                value={confirmEmail}
                onChange={(event: {
                  target: { value: React.SetStateAction<string>; };
                }) => setConfirmEmail(event.target.value)}
              />
              {confirmEmail !== email && (
                <FormHelperText fontSize="12" textAlign="right" color="red.500">
                  Email addresses do not match
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              mt={4}
              border={2}
              borderColor={phoneNumberError ? "red.500" : "#0B0B0B"}
              isRequired
            >
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                placeholder="Number"
                value={phoneNumber}
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
            <FormControl
              mt={4}
              border={2}
              borderColor={passwordError ? "red.500" : "#0B0B0B"}
              isRequired
            >
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: { target: { value: string; }; }) =>
                  handlePasswordChange(e.target.value)
                }
              />
              <FormHelperText
                fontSize="12"
                textAlign="right"
                color={passwordError ? "red.500" : "grey"}
              >
                Must include 1 letter, 1 number and 8 characters
              </FormHelperText>
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
                Next
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
                  Log In
                </ChakraLink>
              </Text>
            </Center>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default SignupSecondary;
