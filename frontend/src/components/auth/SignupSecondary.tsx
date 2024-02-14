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
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "../../utils/ValidationUtils";
import { SIGNUP_PAGE, SIGNUP_EMERGENCY_CONTACT } from "../../constants/Routes";

const SignupSecondary = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const history = useHistory();

  const isButtonDisabled =
    !email ||
    email !== confirmEmail ||
    !password ||
    !phoneNumber ||
    !!emailError ||
    !!phoneNumberError ||
    !!passwordError;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const onNextClick = () => {
    console.log("Signup Info:", {
      email,
      phoneNumber,
    });
    history.push(SIGNUP_EMERGENCY_CONTACT);
  };

  const onBackClick = () => {
    history.push(SIGNUP_PAGE);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = validateEmail(value);
    setEmailError(error || "");
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    const error = validatePhoneNumber(value);
    setPhoneNumberError(error || "");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setPasswordError(error || "");
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
          <form onSubmit={handleSubmit}>
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
                onChange={(e: { target: { value: string } }) =>
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
                  target: { value: React.SetStateAction<string> };
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
                onChange={(e: { target: { value: string } }) =>
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
                onClick={onNextClick}
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

export default SignupSecondary;
